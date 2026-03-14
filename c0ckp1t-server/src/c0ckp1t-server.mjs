#!/usr/bin/env node
/**
 * c0ckp1t-server.mjs
 * 
 * Entry point for the C0ckp1t server.
 * Serves the Vue.js SPA static files and provides WebSocket endpoints
 * on a single port.
 * 
 * Usage:
 *   node src/c0ckp1t-server.mjs [options]
 * 
 * Options:
 *   -p, --port <number>    Port to listen on (default: 3040)
 *   -w, --webroot <path>   Path to webroot directory (default: auto-detected)
 *   --ws-path <path>       WebSocket upgrade path (default: /socket)
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { program } from 'commander'
import express from 'express'
import WsServer from './WsServer.mjs'

// __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Default webroot is two levels up from c0ckp1t-server/src/
const DEFAULT_WEBROOT = path.resolve(__dirname, '../../')
const DEFAULT_PORT = 3041
const DEFAULT_WS_PATH = '/socket'

// ________________________________________________________________________________
// CLI
// ________________________________________________________________________________
program
    .name('c0ckp1t-server')
    .description('C0ckp1t HTTP + WebSocket server')
    .option('-p, --port <number>', 'port to listen on', DEFAULT_PORT)
    .option('-w, --webroot <path>', 'path to webroot directory', DEFAULT_WEBROOT)
    .option('--ws-path <path>', 'WebSocket upgrade path', DEFAULT_WS_PATH)
    .parse()

const opts = program.opts()
const port = parseInt(opts.port, 10)
const webrootPath = path.resolve(opts.webroot)
const wsPath = opts.wsPath

// ________________________________________________________________________________
// SERVER
// ________________________________________________________________________________
const server = new WsServer({ wsPath })

// ________________________________________________________________________________
// HTTP MIDDLEWARE
// ________________________________________________________________________________

// Parse JSON bodies for HTTP API routes
server.app.use(express.json())

// Serve static files from the webroot
server.app.use(express.static(webrootPath))

// ________________________________________________________________________________
// SPA FALLBACK
// ________________________________________________________________________________
// Vue.js client-side routing: if a request doesn't match a static file,
// serve index.html so Vue Router handles it. Requests with file extensions
// that weren't matched by express.static are genuinely missing -> 404.
server.app.get('*', (req, res) => {
    if (path.extname(req.path)) {
        // Has a file extension (e.g., .js, .css, .png) but wasn't found
        // by express.static - it's a missing file, not a client route
        return res.status(404).send('Not found')
    }
    // No file extension - treat as a Vue Router client-side route
    res.sendFile(path.join(webrootPath, 'index-cdn.html'))
    // res.sendFile(path.join(webrootPath, 'index.html'))
})

// ________________________________________________________________________________
// START
// ________________________________________________________________________________
console.log(`[c0ckp1t-server] webroot: ${webrootPath}`)
console.log(`[c0ckp1t-server] ws path: ${wsPath}`)

server.start(port).then(() => {
    console.log(`[c0ckp1t-server] ready at http://localhost:${port}`)
}).catch((err) => {
    console.error(`[c0ckp1t-server] failed to start:`, err)
    process.exit(1)
})

// ________________________________________________________________________________
// GRACEFUL SHUTDOWN
// ________________________________________________________________________________
function shutdown(signal) {
    console.log(`\n[c0ckp1t-server] received ${signal}, shutting down...`)
    server.stop().then(() => {
        console.log(`[c0ckp1t-server] stopped`)
        process.exit(0)
    }).catch((err) => {
        console.error(`[c0ckp1t-server] shutdown error:`, err)
        process.exit(1)
    })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
