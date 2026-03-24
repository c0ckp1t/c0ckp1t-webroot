import { findHostnamePortProtocol} from 'ConfigUtils'
// ________________________________________________________________________________
// Properties
// ________________________________________________________________________________
const WITH_CREDENTIALS = false
const instanceId =  "anonymous";
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
        username: "anonymous",
        password: "anonymous",
        isSecure: isSecure,
    }

} // end of Constants
