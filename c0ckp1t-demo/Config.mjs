// ________________________________________________________________________________
// Properties
// ________________________________________________________________________________
// XMLHttpRequest from a different domain cannot set cookie values for their own
// domain unless withCredentials is set to true before making the request.
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
const WITH_CREDENTIALS = false
// Note: VueUtils requires this to be 'default'
const instanceId =  "demo";
// Used for requestion app components and files
const appEndpoint = "";

const islandDir = "c0ckp1t-demo"

// ________________________________________________________________________________
// GLOBAL CONSTANTS
// ________________________________________________________________________________
export default {
    isDev: true,
    WITH_CREDENTIALS: WITH_CREDENTIALS,

    instanceId: instanceId,
    type: "LOCAL",
    appName:  "C0ckp1t Demo",
    appEndpoint: appEndpoint,
    islandDir: islandDir,

    // This creates the navigation tree
    root: {
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
                endpoint: `/${instanceId}/homepage`,
                isLeaf: true,
                isRoot: false,
                path: ["homepage"],
                name: "homepage",
                children: []
            },
            {
                depth: 1,
                endpoint: `/${instanceId}/docs`,
                isLeaf: true,
                isRoot: false,
                path: ["docs"],
                name: "docs",
                children: []
            }
        ]
    },

    // This is used to create routes for the vue router
    routes: [
        {path: instanceId, location: `${appEndpoint}/${islandDir}/main.vue`, children: [
                {path: '', redirect: `/${instanceId}/homepage`},
                {path: 'homepage', location: `${appEndpoint}/${islandDir}/pages/homepage.vue`},
                {path: 'docs', redirect: `/${instanceId}/docs/Introduction.md`},
                {path: 'docs/:pathMatch(.*)*', location: `${appEndpoint}/${islandDir}/pages/documentation.vue`},
            ] },
    ]


} // end of Constants

