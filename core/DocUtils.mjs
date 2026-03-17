

import {cacheGet, cachePut, cacheDelete} from "./Content.mjs"
import {getLogger} from "Logging";

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'DocUtils.mjs'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")


/**
 * Documentation Utilities
 *
 * read/writes using  /sys/resolver exec interface
 *  const args = ["read",  remotePathURL];
 *  return registry.exec("/sys/resolver", args)
 *
 */
export class DocUtils {

    constructor(browserBasePath, remoteBasePath) {
        this.browserBasePath = "/docs"
        this.remoteBasePath = "/docs"
        if(browserBasePath) {
            if (typeof browserBasePath !== 'string' ) {
                throw Error(`DocUtils.constructor - invalid browserBasePath=${browserBasePath}`)
            }
            this.browserBasePath = browserBasePath.trim()
        }
        if(remoteBasePath) {
            if (typeof remoteBasePath !== 'string' ) {
                throw Error(`DocUtils.constructor - invalid remoteBasePath=${remoteBasePath}`)
            }
            this.remoteBasePath = remoteBasePath.trim()
        }
    }

    /**
     *
     * /Introduction.md -> /default/docs/Introduction.md
     * @param currentBrowserPath
     * @param documentPath
     * @returns {*|string}
     */
    documentPathToBrowserPath = (currentBrowserPath, documentPath) => {
        if (!documentPath || typeof documentPath !== 'string' || documentPath.trim() === '' ) {
            return `${this.browserBasePath}/Introduction.md`;
        }
        if(documentPath.startsWith('/')) {
            return normalizePath(`${this.browserBasePath}${documentPath}` )
        }

        const currentDir = currentBrowserPath.substring(0, currentBrowserPath.lastIndexOf('/') + 1) || '/';
        const combined = currentDir + documentPath;
        return normalizePath(combined )

    }

    /**
     *
     * /default/docs/Introduction.md -> /docs/Introduction.md
     * @param browserPath
     * @returns {*|string}
     */
    browserPathToRemotePath = (browserPath) => {
        logger.debug(`[browserPathToRemotePath]\nbrowserPath=${browserPath}\nbrowserBasePath=${this.browserBasePath}\nremoteBasePath=${this.remoteBasePath}`)
        return browserPath.replace(this.browserBasePath, this.remoteBasePath)
    }

    /**
     * Convert documentURL to remotePath
     */
    documentPathToRemotePath = (instanceId, baseBrowserPath, currentPath, documentPath) => {
        const browserPath = this.documentPathToBrowserPath(baseBrowserPath, currentPath, documentPath)
        return this.browserPathToRemotePath(instanceId, browserPath)
    }

    browserPathToDocumentPath = (browserPath) => {
        if (!browserPath || typeof browserPath !== 'string' || browserPath.trim() === '') {
            return `/Introduction.md`;
        }
        return browserPath.replace(`${this.browserBasePath}/`, "/")
    }

    /**
     * WARNING - spacing is important here
     * @param remotePathURL
     * @param message
     * @return {string}
     */
    buildFailedMarkdown = (remotePathURL, message) => {
        return `
# fetch failed

* remotePathURL=${remotePathURL}

### result

${message}
`
    }

    removeFromCache = async (currentPath, documentURL) => {
        const remotePathURL = this.documentPathToRemotePath(currentPath, documentURL)
        const key = remotePathURL.substring(remotePathURL.lastIndexOf('/') + 1)
        await cacheDelete(key)
    }

    retrieveText = async (registry, remotePath) => {
        logger.debug(`[retrieveText] - instanceId=${registry?.instanceId} remotePath=${remotePath}`)
        /**
        const key = remotePathURL.substring(remotePathURL.lastIndexOf('/') + 1)
        const cachedText = await cacheGet(key)
        if(cachedText) {
            logger.debug(`retrieveText: cache HIT for key=${key}`)
            return {
                isOk: true,
                result: cachedText
            }
        } else {
            logger.debug(`retrieveText: cache MISS for key=${key}`)
        }
         */

        try {
            const resp = await registry.getText(remotePath)
            if(resp.isOk) {
                // await cachePut(key, resp.result)
                return resp
            }
            return {
                isOk: false,
                result: this.buildFailedMarkdown(remotePath, resp.result)
            }
        } catch(e) {
            return {
                isOk: false,
                result: this.buildFailedMarkdown(remotePath, `${e.toLocaleString()}`)
            }
        }
    }
}

// ________________________________________________________________________________
// HELPER METHODS
// ________________________________________________________________________________
/**
 * Normalize a path by resolving . and .. segments
 * Won't allow .. to go above the base
 * @param {string} remainingPath - The path to normalize (without base)
 * @param {string} base - The base prefix that can't be traversed above (default: '/')
 */
export function normalizePath(remainingPath, base = '/') {
    const segments = remainingPath.split('/');
    const result = [];

    for (const segment of segments) {
        if (segment === '' || segment === '.') {
            continue;
        } else if (segment === '..') {
            if (result.length > 0) {
                result.pop();
            }
        } else {
            result.push(segment);
        }
    }

    return base + result.join('/');
}

/**
 *  /admin/jte/docs/v4/actions/jte/docs/Introduction.md
 *  -> /admin/jte/docs
 *
 * @param url
 */
export function extractBasePathFromURL(url) {
    const docsMarker = '/docs';
    const firstDocsIndex = url.indexOf(docsMarker);

    if (firstDocsIndex === -1) {
        throw Error(`extractBasePathFromURL - docs marker not found in url=${url}`)
    }
    return url.slice(0, firstDocsIndex + docsMarker.length);
}