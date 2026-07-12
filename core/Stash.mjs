/**
 * Stash - IndexedDB-backed key-value storage using idb-keyval.
 *
 * Each Stash instance creates its own isolated IDB database
 * via createStore(), so keys never collide across different stores.
 *
 * IndexedDB is scoped to the origin, which is defined as:
 *  scheme + hostname + port
 *
 *  http://localhost:3000 and http://localhost:3001 are different origins
 *  https://app.example.com and https://api.example.com are different origins
 *
 * @example
 *   const componentStash = new Stash('components')
 */
import { get, set, del, keys, entries, clear, createStore } from 'idb-keyval'

export class Stash {
    #store

    /**
     * @param {string} name - Unique name for this store. Used as the IDB database name prefix.
     */
    constructor(name) {
        this.name = name
        this.#store = createStore(`c0ckp1t-${name}`, 'keyval')
    }

    /**
     * Get a value by key. Returns null if the key does not exist.
     * @param {string} key
     * @returns {Promise<any>}
     */
    async get(key) {
        return (await get(key, this.#store)) ?? null
    }

    /**
     * Set a key-value pair.
     * @param {string} key
     * @param {*} value - Any structured-clonable value.
     * @returns {Promise<void>}
     */
    async set(key, value) {
        return set(key, value, this.#store)
    }

    /**
     * Delete a key from the store.
     * @param {string} key
     * @returns {Promise<void>}
     */
    async del(key) {
        return del(key, this.#store)
    }

    /**
     * List all entries as [key, value] pairs.
     * i.e, [
     *      ["admin", { ...config object... }]
     *  ]
     * @returns {Promise<[string, any][]>}
     */
    async list() {
        return entries(this.#store)
    }

    /**
     * Get all keys in the store.
     * @returns {Promise<string[]>}
     */
    async keys() {
        return keys(this.#store)
    }

    /**
     * Get all keys in the store.
     * @returns {Promise<any[]>}
     */
    async values() {
        const allEntries = await entries(this.#store)
        return allEntries.map(([key, value]) => value)
    }

    /**
     * Remove all entries from the store.
     * @returns {Promise<void>}
     */
    async clear() {
        return clear(this.#store)
    }
}
