import http from 'node:http'
import express from 'express'
import { WebSocketServer } from 'ws'
import { encode, decode } from '@msgpack/msgpack'

// Code2 packet types - matching WsUtils.mjs
export const Code2 = {
    ACCEPT: "ACCEPT",
    COMPLETE: "COMPLETE",

    EXEC_REQ: "EXEC_REQ",
    EXEC_RESP: "EXEC_RESP",

    EXEC2_REQ: "EXEC2_REQ",
    EXEC2_RESP: "EXEC2_RESP",

    EXEC3_REQ: "EXEC3_REQ",
    EXEC3_PUSH: "EXEC3_PUSH",
    EXEC3_RESP: "EXEC3_RESP",
    EXEC3_CLOSE: "EXEC3_CLOSE",

    EVENT: "EVENT",
    ERROR: "ERROR"
}

/**
 * Serialize packet to binary using msgpack
 * @param {object} obj
 * @returns {Uint8Array}
 */
export function toBinary(obj) {
    return encode(obj)
}

/**
 * Deserialize binary to packet using msgpack
 * @param {ArrayBuffer|Uint8Array} obj
 * @returns {object}
 */
export function fromBinary(obj) {
    return decode(obj)
}

/**
 * Combined HTTP + WebSocket Server using Express.
 * 
 * Provides an Express app for HTTP routes/static files and a WebSocket
 * server for binary msgpack communication on the same port.
 * 
 * Usage:
 *   const server = new WsServer({ wsPath: '/socket' })
 * 
 *   // Add HTTP routes / middleware via server.app
 *   server.app.use(express.static('./public'))
 *   server.app.get('/api/health', (req, res) => res.json({ ok: true }))
 * 
 *   // Register WebSocket endpoints
 *   server.registerEndpoint('/auth', async (args, bytes, client) => {
 *       return { isOk: true, result: 'authenticated' }
 *   })
 * 
 *   await server.start(3040)
 * 
 * WebSocket packet structure:
 * {
 *   id: number,        // Request ID for matching responses
 *   code: string,      // Code2 type (EXEC_REQ, EXEC2_REQ, etc.)
 *   endpoint: string,  // Endpoint path like "/auth" or "/api/users"
 *   args: array,       // Arguments array
 *   bytes: Uint8Array  // Optional binary payload
 * }
 */
export default class WsServer {
    
    constructor(options = {}) {
        this.wss = null
        this.httpServer = null
        this.port = null
        this.clients = new Set()
        this.endpoints = new Map()

        // Path on which WebSocket upgrades are accepted
        this.wsPath = options.wsPath || '/socket'

        // Express app - publicly accessible for adding routes/middleware
        this.app = express()

        // Store remaining options for WebSocketServer (excluding our custom keys)
        const { wsPath, ...wsOptions } = options
        this.wsOptions = wsOptions
    }

    /**
     * Start the HTTP + WebSocket server on a single port.
     * @param {number} port - Port to listen on
     * @returns {Promise<void>}
     */
    start(port) {
        return new Promise((resolve, reject) => {
            this.port = port

            // Create HTTP server from the Express app
            this.httpServer = http.createServer(this.app)

            // Create WebSocket server in noServer mode - we handle upgrades manually
            this.wss = new WebSocketServer({ 
                noServer: true,
                ...this.wsOptions
            })

            // Handle HTTP upgrade requests - only upgrade on the configured wsPath
            this.httpServer.on('upgrade', (request, socket, head) => {
                const url = new URL(request.url, `http://${request.headers.host}`)
                
                if (url.pathname === this.wsPath) {
                    this.wss.handleUpgrade(request, socket, head, (ws) => {
                        this.wss.emit('connection', ws, request)
                    })
                } else {
                    // Reject WebSocket connections on other paths
                    socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
                    socket.destroy()
                }
            })

            this.wss.on('connection', (ws, req) => {
                this._handleConnection(ws, req)
            })

            this.httpServer.on('error', (error) => {
                console.error(`[WsServer] error:`, error)
                reject(error)
            })

            this.httpServer.listen(port, () => {
                console.log(`[WsServer] listening on port ${port} (HTTP + WebSocket on ${this.wsPath})`)
                resolve()
            })
        })
    }

    /**
     * Stop the server (HTTP + WebSocket).
     * @returns {Promise<void>}
     */
    stop() {
        return new Promise((resolve, reject) => {
            // Close all WebSocket client connections
            for (const client of this.clients) {
                client.ws.close(1000, 'Server shutting down')
            }
            this.clients.clear()

            // Close the WebSocket server
            if (this.wss) {
                this.wss.close()
                this.wss = null
            }

            // Close the HTTP server
            if (this.httpServer) {
                this.httpServer.close((err) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.httpServer = null
                        resolve()
                    }
                })
            } else {
                resolve()
            }
        })
    }

    /**
     * Register a WebSocket endpoint handler.
     * @param {string} endpoint - Endpoint path (e.g., "/auth", "/api/users")
     * @param {function} handler - Async function(args, bytes, client) => response
     *   Handler can return:
     *   - { isOk: true, result: any } for success
     *   - { isOk: false, result: string } for error
     *   - An observable/async generator for streaming (EXEC2)
     */
    registerEndpoint(endpoint, handler) {
        this.endpoints.set(endpoint, handler)
    }

    /**
     * Broadcast an event to all connected WebSocket clients.
     * @param {string} endpoint - Event endpoint
     * @param {any} data - Event data
     */
    broadcast(endpoint, data) {
        const packet = {
            id: 0,
            code: Code2.EVENT,
            endpoint: endpoint,
            args: [],
            bytes: data ? toBinary(data) : null
        }
        const binary = toBinary(packet)
        
        for (const client of this.clients) {
            if (client.ws.readyState === 1) { // WebSocket.OPEN
                client.ws.send(binary)
            }
        }
    }

    /**
     * Send a packet to a specific client.
     * @param {object} client - Client object from this.clients
     * @param {object} packet - Packet to send
     */
    _sendToClient(client, packet) {
        if (client.ws.readyState === 1) { // WebSocket.OPEN
            const binary = toBinary(packet)
            client.ws.send(binary)
        }
    }

    /**
     * Handle a new WebSocket connection.
     * @param {WebSocket} ws 
     * @param {http.IncomingMessage} req 
     */
    _handleConnection(ws, req) {
        const client = {
            ws: ws,
            id: this._generateClientId(),
            url: req.url,
            connectedAt: Date.now()
        }
        
        this.clients.add(client)
        console.log(`[WsServer] client connected: ${client.id}`)

        ws.on('message', async (data, isBinary) => {
            try {
                if (!isBinary) {
                    // Send error - we expect binary messages
                    this._sendError(client, 0, 'Binary messages required', 4005)
                    return
                }
                
                const packet = fromBinary(data)
                await this._handlePacket(client, packet)
            } catch (error) {
                console.error(`[WsServer] message error:`, error)
                this._sendError(client, 0, error.message)
            }
        })

        ws.on('close', (code, reason) => {
            console.log(`[WsServer] client disconnected: ${client.id}, code: ${code}`)
            this.clients.delete(client)
        })

        ws.on('error', (error) => {
            console.error(`[WsServer] client error: ${client.id}`, error)
        })
    }

    /**
     * Handle an incoming packet.
     * @param {object} client 
     * @param {object} packet 
     */
    async _handlePacket(client, packet) {
        const { id, code, endpoint, args, bytes } = packet

        switch (code) {
            case Code2.EXEC_REQ:
                await this._handleExecReq(client, id, endpoint, args, bytes)
                break
            
            case Code2.EXEC2_REQ:
                await this._handleExec2Req(client, id, endpoint, args, bytes)
                break
            
            case Code2.EXEC3_REQ:
                await this._handleExec3Req(client, id, endpoint, args, bytes)
                break
            
            case Code2.EXEC3_PUSH:
                await this._handleExec3Push(client, id, bytes)
                break
            
            case Code2.EXEC3_CLOSE:
                await this._handleExec3Close(client, id)
                break
            
            default:
                this._sendError(client, id, `Unknown packet code: ${code}`)
        }
    }

    /**
     * Handle EXEC_REQ - single request/response
     */
    async _handleExecReq(client, id, endpoint, args, bytes) {
        const handler = this.endpoints.get(endpoint)
        
        if (!handler) {
            this._sendError(client, id, `Endpoint not found: ${endpoint}`)
            return
        }

        try {
            // Send ACCEPT
            this._sendToClient(client, {
                id: id,
                code: Code2.ACCEPT,
                endpoint: endpoint,
                args: [],
                bytes: null
            })

            // Execute handler
            const result = await handler(args, bytes, client)
            
            // Send response
            this._sendToClient(client, {
                id: id,
                code: Code2.EXEC_RESP,
                endpoint: endpoint,
                args: [],
                bytes: toBinary(result)
            })

            // Send COMPLETE
            this._sendToClient(client, {
                id: id,
                code: Code2.COMPLETE,
                endpoint: endpoint,
                args: [],
                bytes: null
            })
        } catch (error) {
            this._sendError(client, id, error.message, null, endpoint)
        }
    }

    /**
     * Handle EXEC2_REQ - streaming response
     * Handler should return an async iterable or call the provided emit function
     */
    async _handleExec2Req(client, id, endpoint, args, bytes) {
        const handler = this.endpoints.get(endpoint)
        
        if (!handler) {
            this._sendError(client, id, `Endpoint not found: ${endpoint}`)
            return
        }

        try {
            // Send ACCEPT
            this._sendToClient(client, {
                id: id,
                code: Code2.ACCEPT,
                endpoint: endpoint,
                args: [],
                bytes: null
            })

            // Create emit function for handler to send multiple responses
            const emit = (data) => {
                this._sendToClient(client, {
                    id: id,
                    code: Code2.EXEC2_RESP,
                    endpoint: endpoint,
                    args: [],
                    bytes: data  // Already binary or will be serialized
                })
            }

            // Execute handler - it can return a single value, an array, or use emit
            const result = await handler(args, bytes, client, emit)
            
            // If result is an async iterable, iterate and send
            if (result && typeof result[Symbol.asyncIterator] === 'function') {
                for await (const item of result) {
                    emit(item instanceof Uint8Array ? item : toBinary(item))
                }
            } else if (Array.isArray(result)) {
                // If result is an array, send each item
                for (const item of result) {
                    emit(item instanceof Uint8Array ? item : toBinary(item))
                }
            } else if (result !== undefined && result !== null) {
                // Single result
                emit(result instanceof Uint8Array ? result : toBinary(result))
            }

            // Send COMPLETE
            this._sendToClient(client, {
                id: id,
                code: Code2.COMPLETE,
                endpoint: endpoint,
                args: [],
                bytes: null
            })
        } catch (error) {
            this._sendError(client, id, error.message, null, endpoint)
        }
    }

    /**
     * Handle EXEC3_REQ - bidirectional streaming
     */
    async _handleExec3Req(client, id, endpoint, args, bytes) {
        const handler = this.endpoints.get(endpoint)
        
        if (!handler) {
            this._sendError(client, id, `Endpoint not found: ${endpoint}`)
            return
        }

        try {
            // Send ACCEPT
            this._sendToClient(client, {
                id: id,
                code: Code2.ACCEPT,
                endpoint: endpoint,
                args: [],
                bytes: null
            })

            // Store stream context on client for PUSH/CLOSE handling
            if (!client.streams) {
                client.streams = new Map()
            }

            const streamContext = {
                id: id,
                endpoint: endpoint,
                handler: handler,
                args: args,
                emit: (data) => {
                    this._sendToClient(client, {
                        id: id,
                        code: Code2.EXEC3_RESP,
                        endpoint: endpoint,
                        args: [],
                        bytes: data instanceof Uint8Array ? data : toBinary(data)
                    })
                }
            }

            client.streams.set(id, streamContext)

            // Call handler with stream context
            await handler(args, bytes, client, streamContext.emit, streamContext)
        } catch (error) {
            this._sendError(client, id, error.message, null, endpoint)
        }
    }

    /**
     * Handle EXEC3_PUSH - client pushing data to an open stream
     */
    async _handleExec3Push(client, id, bytes) {
        if (!client.streams || !client.streams.has(id)) {
            this._sendError(client, id, `No active stream for id: ${id}`)
            return
        }

        const streamContext = client.streams.get(id)
        
        // If handler has an onPush method, call it
        if (streamContext.onPush) {
            try {
                await streamContext.onPush(bytes)
            } catch (error) {
                this._sendError(client, id, error.message, null, streamContext.endpoint)
            }
        }
    }

    /**
     * Handle EXEC3_CLOSE - client closing a stream
     */
    async _handleExec3Close(client, id) {
        if (!client.streams || !client.streams.has(id)) {
            return
        }

        const streamContext = client.streams.get(id)
        
        // If handler has an onClose method, call it
        if (streamContext.onClose) {
            try {
                await streamContext.onClose()
            } catch (error) {
                console.error(`[WsServer] stream close error:`, error)
            }
        }

        // Send COMPLETE
        this._sendToClient(client, {
            id: id,
            code: Code2.COMPLETE,
            endpoint: streamContext.endpoint,
            args: [],
            bytes: null
        })

        client.streams.delete(id)
    }

    /**
     * Send an error response.
     */
    _sendError(client, id, message, code = null, endpoint = '/error') {
        const errorData = {
            isOk: false,
            result: message,
            stack: []
        }

        this._sendToClient(client, {
            id: id,
            code: Code2.ERROR,
            endpoint: endpoint,
            args: [],
            bytes: toBinary(errorData)
        })

        // Also send COMPLETE after error
        this._sendToClient(client, {
            id: id,
            code: Code2.COMPLETE,
            endpoint: endpoint,
            args: [],
            bytes: null
        })
    }

    /**
     * Generate a unique client ID.
     */
    _generateClientId() {
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
}
