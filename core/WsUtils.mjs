
import {encode, decode} from 'msgpack'
import {api as notify} from 'NotifyUtils'

// https://github.com/developit/mitt
import mitt from 'mitt'
export const eventBus = mitt();

//________________________________________________________________________________
// Action
//________________________________________________________________________________
export const Action = {
    TEST: "TEST",
    CRUD: "CRUD",
    NODE: "NODE",
    MARKET: "MARKET",
    DISCONNECT: "DISCONNECT",
    AUTH: "AUTH",
    WF: "WF",
    OSGI: "OSGI"
}

//________________________________________________________________________________
// WsPacket
//________________________________________________________________________________
export const Code = {
    LREQ: "LREQ", // last request
    REQ: "REQ",
    FACK: "FACK", // last acknowledge
    ACK: "ACK",
    LACK: "LACK", // last acknowledge
    ERROR: "ERROR"
}

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

export function generateRandomInt32() {
    return Math.floor(Math.random() * (1 << 31))
}

/**
 * @param action {string}
 * @param dto {object}
 * @returns {{code: string, bytes, action: string, id: number}}
 */
export function buildWsPacket(action, dto) {
    return {
        "action" : action,
        "bytes" : toBinary(dto),
        "id" : generateRandomInt32(),
        "code" : Code.REQ
    }
}

//________________________________________________________________________________
// ConnectionStates
//________________________________________________________________________________
export const ConnectionStates = {
    IDLE: 0,
    CONNECTING: 1,
    CONNECTED: 2,
    RETRYING: 3,
    ERROR: 4,
    CLOSED: 5,
    AUTHENTICATING: 6,
    INVALID_CREDENTIALS: 7,
    OFFLINE: 8,
    ONLINE: 9,
    DISCONNECT: 10
};

export const ConnectionLookUp = [
    'IDLE',
    'CONNECTING',
    'CONNECTED',
    'RETRYING',
    'ERROR',
    'CLOSED',
    'AUTHENTICATING',
    'INVALID CREDENTIALS',
    'OFFLINE',
    'ONLINE',
    'DISCONNECT'
];

// ________________________________________________________________________________
// Serialize / Deserialize
// ________________________________________________________________________________
let decoder = new TextDecoder()

export function fromByteArray(obj) {
    return decoder.decode(obj)
}

export function toBinary(obj) {
    return encode(obj)
}

export function fromBinary(obj) {
    return decode(obj)
}


export function toJson(obj) {
    return JSON.stringify(obj)
}

export function fromJson(jsonString) {
    return JSON.parse(jsonString)
}

// ________________________________________________________________________________
// EXEC API
// ________________________________________________________________________________
export function ok(message = "ok") {
    return { isOk: true, result: message }
}

export function nok(message = "nok", stack = []) {
    return { isOk: false, result: message, stack}
}

//________________________________________________________________________________
// EXEC2 API
//________________________________________________________________________________
export function errorHandler(error, local) {
    notify.exec2Error(error)
    local.stdoutText += "[ERROR HANDLER]\n"
    local.stdoutText += error.toString()
    local.isLoading = false
}

export function completeHandler(local) {
    local.isLoading = false
}

// ________________________________________________________________________________
//
// ________________________________________________________________________________
export function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
    return true;
}

// ________________________________________________________________________________
// HTTP
// ________________________________________________________________________________
export const Http = {

    async getText (path, credentials = "include") {
        try {
            const response = await fetch(path, {
                // "include" - will send cookies and authentication headers with the request, even for cross-origin URLs.
                // "same-origin"  - (the default in browsers) sends cookies only if the request is to the same origin.
                // "omit" - never sends cookies, regardless of the origin.
                credentials: credentials,
                method: "GET",
            });
            return await httpResponseToResp(response, path)
        } catch (error) {
            return {
                isOk: false,
                result: error
            };
        }
    },

    async getBinary(path, credentials = "include") {
        try {
            const response = await fetch(path, {
                credentials: credentials,
                method: "GET",
            });
            if (!response.ok) {
                return {
                    isOk: false,
                    result: `HTTP error: ${response.status} ${response.statusText}`
                };
            }
            return {
                isOk: true,
                result: await response.arrayBuffer()
            };
        } catch (error) {
            return {
                isOk: false,
                result: error
            };
        }
    },

    async getJson(path, credentials = "include") {
        try {
            const response = await fetch(path, {
                credentials: credentials,
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });
            return await response.json();
        } catch (error) {
            return {
                isOk: false,
                result: error
            };
        }
    },

    async postJson(path, body, credentials = "include") {
        try {
            const response = await fetch(path, {
                credentials: credentials,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(body)
            });
            return await response.json()
        } catch (error) {
            return {
                isOk: false,
                result: error
            };
        }
    }
}

const endpointNotFoundSuffixes = ['.vue', '.mjs', '.md']
export async function httpResponseToResp(response, endpoint) {
    if (!response.ok) {
        return {
            isOk: false,
            result: `HTTP error: ${response.status} ${response.statusText}`
        };
    }
    const text = await response.text();
    if (text.startsWith('<!DOCTYPE html>') && endpointNotFoundSuffixes.some(suffix => endpoint.endsWith(suffix))) {
        return {
            isOk: false,
            result: `[NOT_FOUND]\n\n${endpoint}`
        };
    }
    return {
        isOk: true,
        result: text
    };
}
