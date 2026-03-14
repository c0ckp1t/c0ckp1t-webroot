// ________________________________________________________________________________
// AuthNState
// ________________________________________________________________________________
export const AuthNState = {
    IDLE: {
        entry: ['idle'],
        on: {
            'client.authenticate': {target: 'AUTHENTICATING'}
        }
    },
    // ________________________________________________________________________________
    // AUTHENTICATE
    // ________________________________________________________________________________
    AUTHENTICATING: {
        entry: ['authenticate'],
        on: {
            'authenticate.ok':   {target: 'CONNECTING'},
            'authenticate.nok':  {target: 'AUTHENTICATION_FAILED'},
        }
    },
    AUTHENTICATION_FAILED: {
        entry: ['authenticationFailed'],
        on: {
            'client.authenticate': {target: 'AUTHENTICATING'},
        }
    },
    // ________________________________________________________________________________
    // CONNECT
    // ________________________________________________________________________________
    CONNECTING: {
        entry: ['connecting'],
        on: {
            'client.connect.ok':  {target: 'CONNECTION_OK'},
            'client.connect.nok': {target: 'CONNECTION_NOK'},
            'client.error':       {target: 'CONNECTION_NOK'},
            'client.closed':       {target: 'CONNECTION_NOK'},
        }
    },
    CONNECTION_OK: {
        entry: ['connectedOk'],
        on: {
            'connection.ok': {target: 'READY'}
        }
    },
    CONNECTION_NOK: {
        entry: ['connectionNok'],
        on: {
            'client.authenticate': {target: 'AUTHENTICATING'}
        }
    },

    // ________________________________________________________________________________
    // READY STATE
    // ________________________________________________________________________________
    READY: {
        entry: ['ready'],
        on: {
            'client.disconnect':       {target: 'DISCONNECTED'},
            'client.closed':           {target: 'DISCONNECTED'},
            'authenticate.update':     {target: 'AUTH_UPDATE'},
        }
    },

    // ________________________________________________________________________________
    // AUTHENTICATE
    // ________________________________________________________________________________
    AUTH_UPDATE: {
        entry: ['authenticateUpdate'],
        on: {
            'authenticate.update.ok':   {target: 'READY'},
            'authenticate.update.nok':  {target: 'READY'},
        }
    },
    // ________________________________________________________________________________
    // DISCONNECT
    // ________________________________________________________________________________
    DISCONNECTED: {
        entry: ['disconnected'],
        on: {
            'client.authenticate': {target: 'AUTHENTICATING'}
        }
    },

}