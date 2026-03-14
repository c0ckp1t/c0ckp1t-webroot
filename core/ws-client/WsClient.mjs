
const { BehaviorSubject } = rxjs;
const { WebSocketSubject } = rxjs.webSocket;
const { from } = rxjs;
const { switchMapTo, tap } = rxjs.operators;
const { map, takeWhile, filter, take, distinctUntilChanged } = rxjs.operators;

import { Code2, toBinary, fromBinary, eventBus } from 'WsUtils'

// Note: This is global because we want to search across all connections
import { api as apiLogger } from './WsLogUtils.mjs'

//________________________________________________________________________________
// ConnectionStates
//________________________________________________________________________________
export const ConnectionStates = {
    IDLE: 0,
    CONNECTING: 1,
    CONNECTED: 2,
    ERROR: 3,
    CLOSED: 4
};
export const ConnectionLookUp = [
    'IDLE',
    'CONNECTING',
    'CONNECTED',
    'ERROR',
    'CLOSED'
];

// https://github.com/Luka967/websocket-close-codes
// code = 1000 connection closed normally
// code = 1001 connection is going away, server shut down, or tab closed
// code = 1002  protocol error occurred, endpoint received a malformed frame
// code = 1003  InvalidMessageType - cannot accept the data type it received.
// code = 1005  Got no close status but transport layer finished normally (e.g. TCP FIN but no previous CLOSE frame)
// code = 1006  Transport layer broke (e.g. couldn't connect, TCP RST)
// code = 1007  InvalidPayloadData - received data inconsistent with the message type.
// code = 1008  endpoint terminated connection
// code = 1009  MessageTooBig - message that is too big for it to process.
// code = 1011  InternalServerError - error on the server.
// code = 1012  Server/service is restarting
// code = 3000  Endpoint must be authorized to perform application-based request. Equivalent to HTTP 401
// code = 3003  Endpoint is authorized but has no permissions to perform application-based request. Equivalent to HTTP 403
// code = 3008  Endpoint took too long to respond to application-based request. Equivalent to HTTP 408
export function getCodeDescription(code) {
    if (typeof code !== 'number') {
        return 'unknown';
    }

    const codeMap = {
        1000: 'connection closed normally',
        1001: 'connection is going away (server shutdown or tab closed)',
        1002: 'protocol error occurred (malformed frame)',
        1003: 'invalid message type - cannot accept data type',
        1005: 'no close status but transport finished normally',
        1006: 'transport layer broke or couldn’t connect (TCP RST)',
        1007: 'invalid payload data - data inconsistent with message type',
        1008: 'endpoint terminated connection (policy violation)',
        1009: 'message too big',
        1011: 'internal server error',
        1012: 'server/service is restarting',
        3000: 'endpoint must be authorized (HTTP 401 equivalent)',
        3003: 'no permission to perform request (HTTP 403 equivalent)',
        3008: 'endpoint took too long to respond (HTTP 408 equivalent)',

        4001: 'C0ckp1t - missing cookie',
        4002: 'C0ckp1t - cookie decode error',
        4003: 'C0ckp1t - invalid authenticator',
        4004: 'C0ckp1t - validate session failed',
        4005: 'C0ckp1t - received text but binary is required',
        4006: 'C0ckp1t - unhandled exception',
    };

    return codeMap[code] || 'unknown';
}
//________________________________________________________________________________
// WsClient
// ________________________________________________________________________________
export default class WsClient {

    constructor(id) {
        this.id = id
        this.subscriptionCount = 0

        this.subscriptionCount$ = new BehaviorSubject(this.subscriptionCount);
        this.status$ = new BehaviorSubject({state: ConnectionStates.IDLE});

        this.url = null
        this.socket$ = null
        this.logInBound = (data) => {
            apiLogger.logInbound(this.id, data)
        }
        this.logOutBound = (data) => {
            apiLogger.logOutbound(this.id, data)
        }
    }

    status() {
        return this.status$.pipe(distinctUntilChanged())
    }

    connect(url) {
        console.log(`[WsClient.mjs] url=${url}, state=${this.status$.value.state}`)
        this.url = url
        this.status$.next({state: ConnectionStates.CONNECTING, url: url})
        return new Promise((resolve, reject) => {
            // https://github.com/ReactiveX/rxjs/blob/master/src/internal/observable/dom/WebSocketSubject.ts
            this.socket$ = new WebSocketSubject({
                url: this.url,
                // deserializer: msg => msg,
                binaryType: 'arraybuffer',
                deserializer: msg => {
                    return fromBinary(msg.data)
                },
                serializer: (pkt) => {
                    return toBinary(pkt)
                },
                openObserver: {
                    next: () => {
                        this.status$.next({state:ConnectionStates.CONNECTED})
                        resolve(true)
                    },
                    error: e => reject(e)
                },
                closeObserver: {
                    next: (event) => {
                        // Note: See error codes above for event.code
                        this.status$.next({state: ConnectionStates.CLOSED, code: event.code, reason: event.reason, clean: event.wasClean});
                        console.log(`[WsClient.js] - WebSocket closed. Code: ${event.code}, Reason: ${event.reason}, Clean: ${event.wasClean}`);
                    },
                    error: e => console.log(e)
                }
            })

            // https://rxjs.dev/deprecations/subscribe-arguments
            // This is required because we don't actually connect until we send first packet
            this.socket$.subscribe(
                (data) => this.logInBound(data),
                (error) => {
                  console.log(error)
                  console.log(this)

                    this.logInBound(error)
                    if (error.type === "close") {
                        console.log("[WsClient.js] - got close event")
                    }
                    if (error.type === "error") {
                        this.status$.next({state: ConnectionStates.ERROR, error: error})
                        reject(error)
                    }
                }
            ) // end of subscribe

            // eventBus
            // /alert : Object     ( display and alert: {title, message})
            // /invalidate : String (cache has been invalidated for the given endpoint)
            // /refresh : Empty  (registry changed need to refresh)
            this.socket$.pipe(
                filter(pkt => {
                    return pkt.code === Code2.EVENT
                })
            ).subscribe((pkt) => {
                eventBus.emit(pkt.endpoint, pkt)
            })
        }); // end of promise
    }

    close() {
        this.socket$.unsubscribe()
    }

    send(aWsPacket) {
        this.logOutBound(aWsPacket)
        this.socket$.next(aWsPacket)
    }

    /*
        Doesn't work because it will return FACK
        but we don't want the first message
    */
    sendAndGetPromise(aWsPacket) {
        this.logOutBound(aWsPacket)
        const promise = this.socket$.pipe(
            tap({
                subscribe: () => {
                    this.subscriptionCount += 1
                    this.subscriptionCount$.next(this.subscriptionCount)
                },
                unsubscribe: () =>  {
                    this.subscriptionCount -= 1
                    this.subscriptionCount$.next(this.subscriptionCount)
                }

            }),
            filter(reply => {
                return reply.id == aWsPacket.id
            }),
            take(1)
        ).toPromise();
        this.socket$.next(aWsPacket)
        return promise;
    }

    sendAndGetObservable(aWsPacket) {
        this.logOutBound(aWsPacket)
        this.socket$.next(aWsPacket)
        return this.socket$.pipe(
            // timeout(60000), // Set a 1-minute timeout
            tap({
                subscribe: () => {
                    this.subscriptionCount += 1
                    this.subscriptionCount$.next(this.subscriptionCount)
                },
                // TODO: doesn't work when server throws exception
                unsubscribe: () =>  {
                    this.subscriptionCount -= 1
                    this.subscriptionCount$.next(this.subscriptionCount)
                }
            }),
            filter(reply => {
                return reply.id === aWsPacket.id
            }),
            takeWhile( reply => reply.code !== Code2.COMPLETE , true)
        )
    }



}
