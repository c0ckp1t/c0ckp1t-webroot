
// https://runjs.app/play

const encoder = new TextEncoder();

export async function sha256(text) {
    // hash the message
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export async function sha1(text) {
    // hash the message
    const data = encoder.encode(text);
    // WARNING: this won't work if not using HTTPS or localhost
    if(window.isSecureContext) {
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // convert bytes to hex string
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    return text.length
}

export function generateRandomId(prefix = 'id', length = 8) {
    // Characters that can be included in the ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = prefix; // Start the ID with the provided prefix to ensure it starts with a letter

    // Generate the random part of the ID
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}


export function convertMsToString(runtimeMs) {
    if(runtimeMs >= 60000) {
        return `${((runtimeMs / 1000) / 60).toFixed(2)} mins`
    } else if (runtimeMs >= 1000) {
        return `${((runtimeMs / 1000)).toFixed(2)} s`
    } else {
        return `${runtimeMs} ms`
    }
}

// ________________________________________________________________________________
// SORT
// ________________________________________________________________________________
export function sortObjectKeysWithIdFirst(obj) {
    const keys = Object.keys(obj);
    const sortedKeys = keys.filter(key => key !== 'id').sort();

    // Ensure 'id' is the first key
    if (keys.includes('id')) {
        sortedKeys.unshift('id');
    }

    const sortedObj = {};
    sortedKeys.forEach(key => {
        sortedObj[key] = obj[key];
    });

    return sortedObj;
}

// the smallest value appears first and largest last
export function sortByPropertyAsc(arr, property) {
    return arr.sort((a, b) => {
        if (a[property] < b[property]) {
            return -1;
        } else if (a[property] > b[property]) {
            return 1;
        }
        return 0;
    });
}
// desc - largest value appears first and smallest last
export function sortByPropertyDesc(arr, property) {
    return arr.sort((a, b) => {
        if (a[property] < b[property]) {
            return 1;
        } else if (a[property] > b[property]) {
            return -1;
        }
        return 0;
    });
}

// ________________________________________________________________________________
// STRING
// ________________________________________________________________________________
// console.log(extractBasePath("/osgi/_admin")); // "/osgi/"
// console.log(extractBasePath("/client/cli/homepage")); // "/client/cli"
// console.log(extractBasePath("/user/profile"));        // "/user/"
// console.log(extractBasePath("/settings"));           // ""
// console.log(extractBasePath("no-slash"));           // ""
// console.log(extractBasePath("/"));                 // ""
export function extractBasePath(filePath) {
    if (typeof filePath !== 'string') {
        throw `[INVALID_ARGUMENT] - filePath needs to be string`
    }
    // Match everything before the last '/' or the entire string if no '/' is found
    const match = filePath.match(/(.+\/)?/);
    if (match) {
        return match[1] || ''; // Return the matched part or an empty string if none
    } else {
        return ''; // Return an empty string if no match is found
    }
}

// console.log(extractBasePath2("/osgi/_admin")); // "/osgi"
// console.log(extractBasePath2("/client/cli/homepage")); // "/client/cli"
// console.log(extractBasePath2("/user/profile"));        // "/user"
// console.log(extractBasePath2("/settings"));           // "/"
// console.log(extractBasePath2("no-slash"));           // "/"
// console.log(extractBasePath2("/"));                 // "/"
// console.log(extractBasePath2(""));                 // "/"
export function extractBasePath2(filePath) {
    if (typeof filePath !== 'string') {
        throw `[INVALID_ARGUMENT] - filePath needs to be string`
    }

    if (!filePath || filePath === '/') {
        return '/';
    }

    // Get the last index of '/'
    const lastSlashIndex = filePath.lastIndexOf('/');
    if (lastSlashIndex === -1) {
        // No slash found
        return '/';
    }

    if (lastSlashIndex === 0) {
        return '/';
    }

    // Return everything up to the last slash
    return filePath.substring(0, lastSlashIndex);
}


// Test Cases
// console.log(substrAfterFirstSlash("/client/cli/homepage")); // "client"
// console.log(substrAfterFirstSlash("/user/profile"));        // "user"
// console.log(substrAfterFirstSlash("/settings"));           // "settings"
// console.log(substrAfterFirstSlash("no-slash"));           // "no-slash"
// console.log(substrAfterFirstSlash("/"));                 // "" (No segment)
export function substrAfterFirstSlash(str) {
    if (!str.includes("/")) return str; // If no "/", return the whole string
    const parts = str.split('/'); // Split by "/"
    return parts.length > 1 ? parts[1] : ''; // Return the second part or empty string if no "/"
}

export function substrWithoutLeadingSlash(str) {
    return str.endsWith("/") ? str.slice(0, -1) : str;
}
// /cli -> cli
// /cli/test -> cli-test
// /cli/test/ -> cli-test
//  cli -> cli
// "" - >  ""
// "/" - >  ""
export function endpointToRouterName(str) {
    return str.trim().split("/").filter(item => item !== "").join("-")
}

/**
 *  capitalizeFirstLetter
 * @param str
 * @returns {string}
 */
export function capitalizeFirstLetter(str) {
    if (str.length === 0) return str; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 *  /test/1/2/3/vue.js -> vue.js
 * @param path
 * @returns {string}
 */
export function extractLastPath(path) {
    return path.split("/")[path.split("/").length -1]
}

export function truncateAndKeepLast(text, maxLength = 16) {
    if (text.length <= maxLength) {
        return text; // No truncation needed
    } else {
        return text.slice(-maxLength); // Return the last maxLength characters
    }
}

export function truncateAndKeepFirst(text, maxLength = 16) {
    if(text === undefined || text === null) return ""
    if (text.length <= maxLength) {
        return text; // No truncation needed
    } else {
        return text.slice(0, maxLength); // Return the last maxLength characters
    }
}


// /osgi/_admin/ -> /osgi
// /osgi/_admin -> /osgi
// /osgi -> ""
// /osgi/ -> ""
// osgi -> ""
export function parentPath(filePath) {
    // Remove any trailing slash first
    const trimmed = filePath.replace(/\/+$/, ""); // e.g. "/a/b/" -> "/a/b"
    if(trimmed.includes('/')) {
        return trimmed.slice(0, trimmed.lastIndexOf('/'));
    }
    return ""
}

// /cli/test/hello -> hello
// /cli/test/ -> ""
// cli -> cli
// https://jsfiddle.net/
export function leafPath(filePath) {
    if(filePath.includes('/')) {
        // Everything after the last slash
        return filePath.slice(filePath.lastIndexOf('/') + 1);
    }
    // If there's no slash, the entire filePath is the leaf
    return filePath
}

/**
 * Determine if str starts with a letter
 * @param str
 * @returns {boolean}
 */
export function startsWithLetter(str) {
    return /^[a-zA-Z]/.test(str);
}





/**
 * Groups a list of objects by their 'prop' property.
 *
 * @param {Array} items - An array of objects, each with 'params', 'ret', and 'group' properties.
 * @param {String|Number} prop - a key into an object
 * @returns {Object} - An object whose keys are group names and values are arrays of objects.
 */
export function groupArrayByProperty(items, prop) {
    return items.reduce((acc, item) => {
        // Check if group is undefined, null, or blank (empty after trim)
        const key = item[prop]
        if ( key === undefined || key === null ||
            (typeof key === 'string' && key.trim() === '')
        ) {
            throw new Error(`Invalid value for property=${prop}: ${JSON.stringify(item)}`)
        }
        // If this group hasn't been seen yet, initialize an empty array
        if (!acc[key]) {
            acc[key] = []
        }

        // Push the current item into the array for its group
        acc[key].push(item)
        return acc
    }, {})
}

/**
 * Groups the values (objects) of a given data object by the specified `prop`,
 * inserting the object's original key (like "id1", "id2", etc.) into the object
 * under the property 'k'.
 *
 * @param {Object} data - An object whose keys are item IDs and whose values each have the property `prop`.
 * @param {string|number} prop - The property name by which to group (e.g. "group").
 * @returns {Object} - An object whose keys are the distinct values of `prop`,
 *                     and whose values are arrays of the original objects (plus `k`).
 */
export function groupObjectByProperty(data, prop) {
    // Object.entries(data) => [ [key, value], [key, value], ... ]
    // Example: [ ["id1", { group: "A", ... }], ["id2", { group: "B", ... }] ]
    return Object.entries(data).reduce((acc, [dataKey, item]) => {
        // The grouping value, e.g. item.group
        const groupValue = item[prop];

        // Validate that groupValue is neither undefined, null, nor blank
        if ( groupValue === undefined || groupValue === null ||
            (typeof groupValue === 'string' && groupValue.trim() === '')
        ) {
            throw new Error(`Invalid value for property="${prop}": ${JSON.stringify(item)}`);
        }

        // If this grouping value doesn't exist yet, initialize it
        if (!acc[groupValue]) {
            acc[groupValue] = [];
        }

        // Push the item, adding a 'k' property that stores the original dataKey (like "id1")
        acc[groupValue].push({
            ...item,
            dataKey: dataKey,
        });

        return acc;
    }, {});
}


// ________________________________________________________________________________
// CONVERSIONS
// ________________________________________________________________________________
export function bytesToMB(bytes) {
    const MEGABYTES = 1024 * 1024;  // 1 MB in bytes
    return (bytes / MEGABYTES).toFixed(3);
}

/**
 * Convert bytes into a human-readable string (K, MB, GB, TB, etc.)
 *
 * console.log(formatBytes(500));             // "500.00 B"
 * console.log(formatBytes(2048));            // "2.00 KB"
 * console.log(formatBytes(500000));          // "488.28 KB"
 * console.log(formatBytes(1048576));         // "1.00 MB"
 * console.log(formatBytes(1073741824));      // "1.00 GB"
 * console.log(formatBytes(1099511627776));   // "1.00 TB"
 *
 * @param {number} bytes - The size in bytes
 * @returns {string} - Human-readable file size
 */
export function formatBytes(bytes) {
    if(bytes === undefined || bytes === null || isNaN(bytes)) {
        return 'Unknown';
    }
    if (bytes < 1024) {
        return bytes + ' B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let value = bytes;

    // Divide by 1024 until the value is smaller than 1024 or we reach the last unit
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }

    // Round to 2 decimal places and attach the appropriate unit
    return value.toFixed(2) + ' ' + units[unitIndex];
}

export function formatDuration(durationMs) {
    if(durationMs === undefined || durationMs === null || isNaN(durationMs)) {
        return 'Unknown';
    }
    const seconds = (durationMs / 1000) % 60;
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0 || days > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `;
    result += `${seconds.toFixed(2)}s`;

    return result.trim();
}

export function tryJson(data) {
    try {
        const res = JSON.parse(data)
        return JSON.stringify(res, null, 2)
    } catch(e) {
        return data
    }
}

// ________________________________________________________________________________
// RPCResult
// ________________________________________________________________________________
/**
 * @typedef {Object} RPCResult
 * @property {boolean} isOk - Indicates if the operation was successful.
 * @property {*} result - The result of the operation.
 */
export function ok(res) {
    return {
        isOk: true,
        result: res
    }
}

/**
 * @typedef {Object} RPCResult
 * @property {boolean} isOk - Indicates if the operation was successful.
 * @property {array} stack
 * @property {*} result - The result of the operation.
 */
export function nok(res, stack = []) {
    return {
        isOk: false,
        result: res,
        stack: stack
    }
}

/**
 * Checks that each element of an array is a string
 * @param arr
 * @returns index of first non string or -1 if they are all strings
 */
export function indexOfNonString(arr) {
    // If the input is not an array, decide what to return.
    // Here we return -1 to indicate "no invalid element found."
    if (!Array.isArray(arr)) {
        throw Error("indexOfNonString only works with arrays")
    }

    // Loop through the array, checking each item
    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'string') {
            return i;  // Return the index immediately if it's not a string
        }
    }

    // If we finish the loop without finding any non-string, return -1
    return -1;
}

/**
 *
 * TEST CASES
 * console.log(splitPath('/hello/test/one'));
 * Output: { first: '/hello', rest: '/test/one' }
 *
 * console.log(splitPath('/1/2/3/4/'));
 * Output: { first: '/1', rest: '/2/3/4/' }
 *
 * console.log(splitPath('/single'));
 * Output: { first: '/single', rest: '' }
 */
export function splitPathString(path) {
    // Find the index of the second slash, starting search after index 0
    const secondSlashIndex = path.indexOf('/', 1);

    if (secondSlashIndex === -1) {
        // There is no second part
        return { first: path, rest: '' };
    }

    return {
        first: path.slice(0, secondSlashIndex),
        rest: path.slice(secondSlashIndex)
    };
}


/**
 * Cleans a file name by replacing dots with hyphens, removing special characters,
 * @param name
 * @returns {*}
 */
export function cleanFileName(name) {
    return name
        .replace(/\./g, "-")
        .replace(/[^A-Za-z0-9 _-]/g, "")
        .replace(/ /g, "-")
        .slice(0, 24);
}