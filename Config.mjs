import {deepMerge, DEFAULTS, buildNavTree, buildRoutes, defaultVueComponents} from "ConfigUtils";
/**
 * Configuration Factory for C0ckp1t Applications
 *
 * Usage:
 *   import { createConfig } from './Config.mjs';
 *
 *   // Local mode (all defaults)
 *   const config = createConfig();
 *
 *   // CDN mode
 *   const config = createConfig({
 *       appEndpoint: "https://cdn.jsdelivr.net/npm/c0ckp1t@latest"
 *   });
 *
 *   // Custom instance
 *   const config = createConfig({
 *       instanceId: "myapp",
 *       appName: "My App",
 *       isDev: false,
 *   });
 */
// ________________________________________________________________________________
// Factory
// ________________________________________________________________________________
/**
 * Create a C0ckp1t configuration object.
 *
 * @param {Object} overrides - Properties to override.
 * @returns {Object} The configuration object.
 */
export function createConfig(overrides = {}) {
    // 1. Separate root/routes from scalar overrides so deepMerge handles scalars
    const { root: rootOverride, components: componentsOverride, routes: routesOverride, ...scalarOverrides } = overrides;

    // 2. Merge scalar defaults with overrides
    const merged = deepMerge(DEFAULTS, scalarOverrides);

    // 3. Resolve the key variables that nav/routes depend on
    const { instanceId, routePrefix, componentPrefix } = merged;

    // 4. Build or use provided root nav tree
    const root = rootOverride !== undefined ? rootOverride : buildNavTree(instanceId);

    // 5. Build or use provided routes
    const routes = routesOverride !== undefined ? routesOverride : buildRoutes(instanceId, routePrefix);

    const components = componentsOverride !== undefined ? componentsOverride : defaultVueComponents(componentPrefix);
    // 6. Assemble final config
    return {
        ...merged,
        root,
        routes,
        components
    };
}

export default createConfig;
