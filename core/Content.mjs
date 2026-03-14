
/**
 * This module manages the content articles for the application.
 */
import {reactive, ref, markRaw, onMounted, watch, computed, onErrorCaptured} from 'vue'
// import { get, set, del } from 'idb-keyval'
import {get, set, del} from 'idb-keyval'

export const articlesFiltered = computed(() => {
    return Content.articles.filter(article => {
        return true
    })
})

const articlePathToSha1=  "article-path-to-sha1"

export const Content = reactive({
    // ________________________________________________________________________________
    // ARTICLES
    // ________________________________________________________________________________
    articlesUpdated: null,
    /**
     *  [
     *     {
     *       name: "Generating Kotlin Documentation",
     *       desc: "Use Dokka to generate documentation for your Kotlin projects with ease.",
     *       to: "/docs?p=/Java-Documentation.md",
     *       updated: "2024-01-01",
     *       tags: ['programming']
     *     }, ...
     *  ]
     */

    articlePathToSha1Table: {},
    articles: [],
    articleTags: []
})

/**
 *
 * @param key
 * @returns
 */
export async function cacheGet(key ) {
    return get(key) ?? null
}

export async function cachePut(key, text) {
    // prevent caching if article no longer exists
    if(!Content.articlePathToSha1Table[key]){
        return text
    }
    return set(key, text)
}

export async function cacheDelete(key, text) {
    return del(key)
}

async function fetchArticles() {
    // This table always has latest sha1 for each article path
    const articlePathToSha1Table = await get(articlePathToSha1) ?? {}
    const resArticles = await fetch('/documentation/published_articles.json')
    const jsonArr = (await resArticles.json()).map(article => {
        article.to = `/docs/${article.path}`
        article.desc = "N/A"
        article.updated = article.updatedMs ? new Date(article.updatedMs).toISOString().slice(0, 10) : null
        article.created = article.createdMs ? new Date(article.createdMs).toISOString().slice(0, 10) : null
        article.sha1 = article.kv?.sha1 ?? null
        article.createdMs = null

        if(articlePathToSha1Table[article.path]) {
            if(articlePathToSha1Table[article.path] !== article.sha1) {
                del(article.path);
            }
        } else {
            articlePathToSha1Table[article.path] = article.sha1
        }

        return article
    }).sort((a, b) => b.updatedMs - a.updatedMs)
    Content.articles = jsonArr
    Content.articlesUpdated = Date.now()
    Content.articleTags = Array.from(new Set(jsonArr.flatMap(article => article.tags || []))).sort()

    await set(articlePathToSha1, articlePathToSha1Table)
    Content.articlePathToSha1Table = articlePathToSha1Table;
}

// fetchArticles()



