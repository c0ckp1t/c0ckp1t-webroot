import { assign } from "xstate";

// ________________________________________________________________________________
// Helper: build a FAILED error context via assign
// ________________________________________________________________________________
const assignError = (step, msgFn) =>
    assign({
        error: (_ctx, event) => ({
            step,
            message: typeof msgFn === "function" ? msgFn(_ctx, event) : msgFn,
        }),
    });

// ________________________________________________________________________________
// AuthNState — single deterministic state machine
//
// States:
//   IDLE  →  FETCHING_COOKIE  →  CONNECTING_WS  →  CONNECTED (transient) →  READY
//   Any failure  →  FAILED
//   Closed/disconnect  →  DISCONNECTED
// ________________________________________________________________________________
export const AuthNState = {

    // ________________________________________________________________________________
    // IDLE — nothing happening
    // ________________________________________________________________________________
    IDLE: {
        on: {
            "connect": { target: "FETCHING_COOKIE" },
        },
    },

    // ________________________________________________________________________________
    // FETCHING_COOKIE — POST /cookie to get session cookie
    // ________________________________________________________________________________
    FETCHING_COOKIE: {
        entry: assign({ error: null }),
        invoke: {
            id: "fetchCookie",
            src: "fetchCookie",
            onDone: {
                target: "CONNECTING_WS",
            },
            onError: {
                target: "FAILED",
                actions: assignError("FETCHING_COOKIE", (_ctx, event) => {
                    const err = event.data;
                    return typeof err === "string" ? err : err?.message ?? String(err);
                }),
            },
        },
    },

    // ________________________________________________________________________________
    // CONNECTING_WS — opening WebSocket connection
    // ________________________________________________________________________________
    CONNECTING_WS: {
        invoke: {
            id: "connectWs",
            src: "connectWs",
            onDone: {
                target: "CONNECTED",
            },
            onError: {
                target: "FAILED",
                actions: assignError("CONNECTING_WS", (_ctx, event) => {
                    const err = event.data;
                    return typeof err === "string" ? err : err?.message ?? String(err);
                }),
            },
        },
        on: {
            "ws.error": {
                target: "FAILED",
                actions: assignError("CONNECTING_WS", (_ctx, event) =>
                    event.message ?? "WebSocket error during connect"
                ),
            },
            "ws.closed": {
                target: "FAILED",
                actions: assignError("CONNECTING_WS", (_ctx, event) =>
                    `WebSocket closed during connect (code=${event.code}, reason=${event.reason ?? ""})`
                ),
            },
        },
    },

    // ________________________________________________________________________________
    // CONNECTED — transient: WS is open, immediately transition to READY
    // ________________________________________________________________________________
    CONNECTED: {
        always: { target: "READY" },
    },

    // ________________________________________________________________________________
    // READY — fully connected and authenticated, ready for RPC
    // ________________________________________________________________________________
    READY: {
        on: {
            "disconnect":   { target: "DISCONNECTED" },
            "ws.closed":    { target: "DISCONNECTED" },
            "ws.error":     { target: "DISCONNECTED" },
        },
    },

    // ________________________________________________________________________________
    // DISCONNECTED — connection was closed (clean or not)
    // ________________________________________________________________________________
    DISCONNECTED: {
        entry: assign({
            error: (_ctx, event) => {
                if (event.type === "ws.closed") {
                    return {
                        step: "DISCONNECTED",
                        message: `WebSocket closed (code=${event.code}, reason=${event.reason ?? ""})`,
                        code: event.code,
                    };
                }
                return null;
            },
        }),
        on: {
            "connect": { target: "FETCHING_COOKIE" },
        },
    },

    // ________________________________________________________________________________
    // FAILED — something went wrong; error details in context.error
    // ________________________________________________________________________________
    FAILED: {
        on: {
            "connect": {
                target: "FETCHING_COOKIE",
                actions: assign({ error: null, retries: (ctx) => (ctx.retries ?? 0) + 1 }),
            },
        },
    },
};
