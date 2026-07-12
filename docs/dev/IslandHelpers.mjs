import {findHostnamePortProtocol} from 'ConfigUtils';

// ________________________________________________________________________________
// NODE HELPERS
// ________________________________________________________________________________
export function adjustNode(node) {
    node._expanded ??= true;
    if (Array.isArray(node.children)) {
        node.children.forEach((child) => {
            adjustNode(child);
        });
    }
}

export function adjustConfig(children, instanceId) {
    children.forEach((node) => {
        if (node.location) {
            node.location = `/${instanceId}${node.location}`;
        }
        if (node.children) {
            adjustConfig(node.children, instanceId);
        }
    });
}

// ________________________________________________________________________________
// CONFIGURATION VALIDATION
// ________________________________________________________________________________
export function validateIslandConfig(config) {
    if (!config) {
        throw new Error("config is required");
    }
    if (typeof config !== 'object') {
        throw new Error("Island config must be an object must was `" + typeof config + "`");
    }
    if (typeof config.instanceId !== `string` || config.instanceId.trim() === ``) {
        throw new Error(`Island config requires non-empty instanceId property`);
    }
    config.type = "Island";
    const {serverUrl} = findHostnamePortProtocol();
    config.SERVER_API_URL = serverUrl;
    return config;
}

export function validateIslandDefaultConfig(config) {
    if (!config) {
        throw new Error("config is required");
    }
    if (typeof config !== 'object') {
        throw new Error("IslandDefault config must be an object must was `" + typeof config + "`");
    }
    if (typeof config.instanceId !== `string` || config.instanceId.trim() === ``) {
        throw new Error(`IslandDefault config requires non-empty instanceId property`);
    }
    config.type = "IslandDefault";
    if (!Array.isArray(config?.routes) || config.routes.length === 0) {
        config.routes = [];
    }
    return config;
}
