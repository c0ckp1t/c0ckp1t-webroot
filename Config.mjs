import {deepMerge, DEFAULTS} from "CoreUtils";
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
// Default Nav Tree Builder
// ________________________________________________________________________________
export function buildNavTree(instanceId) {
    return {
        icon: "fa-house",
        depth: 0,
        endpoint: "/",
        isLeaf: false,
        isRoot: true,
        name: "",
        path: [],
        children: [
            {
                depth: 1,
                endpoint: `/${instanceId}/connections`,
                isLeaf: true,
                isRoot: false,
                path: ["connections"],
                name: "Connections",
                children: []
            },
            {
                depth: 1,
                endpoint: `/${instanceId}/cache`,
                isLeaf: true,
                isRoot: false,
                path: ["cache"],
                name: "Cache",
                children: []
            },
            {
                icon: "fa-network-wired",
                depth: 1,
                endpoint: `/${instanceId}/traffic`,
                isLeaf: true,
                isRoot: false,
                path: ["traffic"],
                name: "Traffic",
                children: []
            },
            {
                icon: "fa-bell",
                depth: 1,
                endpoint: `/${instanceId}/notifies`,
                isLeaf: true,
                isRoot: false,
                path: ["notifies"],
                name: "Notifies",
                children: []
            },
            {
                icon: "fa-info",
                depth: 1,
                endpoint: `/${instanceId}/docs`,
                isLeaf: true,
                isRoot: false,
                path: ["docs"],
                name: "Documentation",
                children: []
            },
            {
                icon: "fa-info",
                depth: 1,
                endpoint: `/${instanceId}/components`,
                isLeaf: true,
                isRoot: false,
                path: ["components"],
                name: "Components",
                children: [
                    {
                        icon: "fa-info",
                        depth: 2,
                        endpoint: `/${instanceId}/components/bootstrap`,
                        isLeaf: true,
                        isRoot: false,
                        path: ["bootstrap"],
                        name: "Bootstrap",
                        children: []
                    },
                    {
                        icon: "fa-info",
                        depth: 2,
                        endpoint: `/${instanceId}/components/basic`,
                        isLeaf: true,
                        isRoot: false,
                        path: ["basic"],
                        name: "Basic",
                        children: []
                    },
                    {
                        icon: "fa-info",
                        depth: 2,
                        endpoint: `/${instanceId}/components/advanced`,
                        isLeaf: true,
                        isRoot: false,
                        path: ["advanced"],
                        name: "Advanced",
                        children: []
                    },
                    {
                        icon: "fa-info",
                        depth: 2,
                        endpoint: `/${instanceId}/components/theme`,
                        isLeaf: true,
                        isRoot: false,
                        path: ["theme"],
                        name: "Theme",
                        children: []
                    },
                ]
            }
        ]
    };
}

// ________________________________________________________________________________
// Routes Builder
// ________________________________________________________________________________
export function buildRoutes(instanceId = "default", prefix = "") {
    return [
        { path: '/', name: 'root', children: [
                {path: '', redirect: `/${instanceId}/docs/Introduction.md`},
                {path: `${instanceId}`, children: [
                        {path: 'docs', redirect: `/${instanceId}/docs/Introduction.md`},
                        {path: 'docs/:pathMatch(.*)*', location: `${prefix}/core/pages/Documentation.vue`},
                        {path: 'connections', location: `${prefix}/core/pages/Connections.vue`},
                        {path: 'connections/:id', location: `${prefix}/core/pages/Connection.vue`},
                        {path: 'cache', location: `${prefix}/core/pages/Cache.vue`},
                        {path: 'traffic', location: `${prefix}/core/pages/Traffic.vue`},
                        {path: 'notifies', location: `${prefix}/core/pages/Notifies.vue`},
                        {path: 'components', location: `${prefix}/core/pages/frontend/Components.vue`, children: [
                                {path: 'basic', location: `${prefix}/core/pages/frontend/ComponentsBasic.vue`},
                                {path: 'advanced', location: `${prefix}/core/pages/frontend/ComponentsAdv.vue`},
                                {path: 'theme', location: `${prefix}/core/pages/frontend/Theme.vue`},
                                {path: 'bootstrap', location: `${prefix}/core/pages/frontend/Bootstrap.vue`},
                            ]},
                    ]}
            ] },
        { path: '/:pathMatch(.*)*', name: '404', location: `${prefix}/core/Page404.vue` }
    ];
}

// ________________________________________________________________________________
// Components
// ________________________________________________________________________________
/**
 * Return the default Vue components
 * using sha1 hashes
 * @returns {Object}
 */
export function defaultVueComponents(prefix = "") {
    return {
        ExecButton: { path: `${prefix}/components/ExecButton.vue`, hash: `97e3d2ce89808c5a69f41404e1337f743015f0cc` },
        XInput: { path: `${prefix}/components/xinput.vue`, hash: `cd47d7d038316367df6fd7e265aa3625b72a7777` },
        XInput2: { path: `${prefix}/components/xinput2.vue`, hash: `320e52ac991baebded7c2a9f52a4cfc2cde47b55` },
        XLabel: { path: `${prefix}/components/xlabel.vue`, hash: `90a9837aa8e06f1d3a5b7601337afd78a872d181` },
        XDropdown: { path: `${prefix}/components/xdropdown.vue`, hash: `52b29b72fd6512eefccd9caa76e26dd91d9f9f9e` },
        XDropdown2: { path: `${prefix}/components/xdropdown2.vue`, hash: `e7b163eda42fb7e1a6f07b011c423f8f275eb65d` },
        XSection: { path: `${prefix}/components/xsection.vue`, hash: `27285d606f57d13f80156bb11cd34449f88df950` },
        XTableOpen: { path: `${prefix}/components/xtable-open.vue`, hash: `a1b9a4f670817978022a4c596e2e2f89dd4568c2` },
        XCollapse: { path: `${prefix}/components/xcollapse.vue`, hash: `ba1479bd1080a4fa5abdf6c91c7328ae679f78e6` },
        XToggle: { path: `${prefix}/components/xtoggle.vue`, hash: `2f6871d2d3069ac8f35b6bf76de6c2109f42d9d1` },
        XToggle3: { path: `${prefix}/components/xtoggle3.vue`, hash: `61d0464e6ed9983e817eb0cde928dceb7c0fdc75` },
        XCheck: { path: `${prefix}/components/xcheck.vue`, hash: `ee0d6b30600fb41589123f6d66f2791f1332d4f7` },
        XCheckbox: { path: `${prefix}/components/xcheckbox.vue`, hash: `a290c0cbb7bffce83c235dd5a1c98ed9c441a5b0` },
        XTextarea: { path: `${prefix}/components/xtextarea.vue`, hash: `f8bb08419082aa5443630ab07172674b50c7a248` },
        XHidden: { path: `${prefix}/components/xhidden.vue`, hash: `ecb396e12dd894040e715c0854275e4d5016fcb9` },
        XCode: { path: `${prefix}/components/xcode.vue`, hash: `4d9d9165fea0539c9a983fcdffae8dedcfd537ae` },
        XCodeSlot: { path: `${prefix}/components/xcode-slot.vue`, hash: `` },
        XButton: { path: `${prefix}/components/xbutton.vue`, hash: `2e956caa47e46377ea5a809f7438d0fc38be73b9` },
        XTabs: { path: `${prefix}/components/xtabs.vue`, hash: `83dc219106bdc86ae86dcd16cf95ebd7f11bc952` },
        XKv: { path: `${prefix}/components/xkv.vue`, hash: `8951d3a5e3786cfc9c705b13c1f71e3f90dd2552` },
        XNav: { path: `${prefix}/components/xnav.vue`, hash: `8d51c73e5716deed3577652e362c50526ddbe4e1` },
        XMap: { path: `${prefix}/components/xmap.vue`, hash: `daee357d9e2ef96df0166dd7add0339d46a1cc01` },
        XList: { path: `${prefix}/components/xlist.vue`, hash: `217ced04a333238d169c300a721b75f0ddd5e95b` },
        XJson: { path: `${prefix}/components/xjson.vue`, hash: `0a3ef6265b4070b0f002d659776c02756cc1da5a` },
        XCard: { path: `${prefix}/components/xcard.vue`, hash: `de3fbb23ae7b00d4c90a717dd361cb9315e9ded6` },
        XCardH: { path: `${prefix}/components/xcard-h.vue`, hash: `de4d42f1056c5d2b8431f15e6b1180d9f9898ac2` },
        XColor: { path: `${prefix}/components/xcolor.vue`, hash: `9bf9497ff66e213277f17af290c21c0a35752510` },
        "v-ace-editor": { path: `${prefix}/components/vue3-ace-editor.vue`, hash: `70ce4a39152af5cf0f7cb6b1d4fdafc8b6225edc` },
        XMarkdown: { path: `${prefix}/components/xmarkdown.vue`, hash: `15f835547fab8a8c8aad47d72640c8e918a7b9da` },
        XSound: { path: `${prefix}/components/xsound.vue`, hash: `3e8ad4aa3c767f757dd49b99aa6f961547caf970` },
        XUpload: { path: `${prefix}/components/xupload.vue`, hash: `7a872277e0047fca11e950efe08f2bffa670abdb` },
        XTree: { path: `${prefix}/components/xtree.vue`, hash: `3b6534e86996c48ab05072a9b793ecc78d83a0eb` },
        CodeMirror: { path: `${prefix}/components/code-mirror.vue`, hash: `3ce1028adb75831e01c4264d5764c14f60a1bd00` },
        XTerminal: { path: `${prefix}/components/xterminal.vue`, hash: `1c01f92c0a08bd4937f9768a1d49f12a9a84feea` },
    }
}


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
