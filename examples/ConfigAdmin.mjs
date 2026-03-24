import { findHostnamePortProtocol} from 'CoreUtils'
// ________________________________________________________________________________
// Properties
// ________________________________________________________________________________
const WITH_CREDENTIALS = false
const instanceId =  "admin";
const appEndpoint = "";
const {hostname, port, protocol, isSecure} = findHostnamePortProtocol()

// ________________________________________________________________________________
// GLOBAL CONSTANTS
// ________________________________________________________________________________
export default {
    isDev: true,
    WITH_CREDENTIALS: WITH_CREDENTIALS,

    instanceId: instanceId,
    type: "Island",
    appEndpoint: appEndpoint,

    connection: {
        readOnly: true,
        hostname: hostname,
        port: 1995,
        protocol: protocol,
        endpoint: "socket",
        username: "root",
        password: "root",
        isSecure: isSecure,
    }

} // end of Constants

