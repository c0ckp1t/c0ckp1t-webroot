// ________________________________________________________________________________
// IMPORTS
// ________________________________________________________________________________
import {getLogger} from "Logging"

// ________________________________________________________________________________
// LOGGING
// ________________________________________________________________________________
const LOG_HEADER = 'MarkdownUtils.mjs'
const logger = getLogger(LOG_HEADER)
logger.debug("[INIT]")

const remotePathPrefix = '/docs/';

// ________________________________________________________________________________
// EXPORTED UTILITY FUNCTIONS
// ________________________________________________________________________________
/**
 * Replace table HTML to add Bootstrap classes
 *  <table class="table table-success table-striped">
 *   https://getbootstrap.com/docs/5.3/content/tables/
 * @param {string} inputString - HTML string with table tags
 * @returns {string} Modified HTML string
 */
export function decorateTableHTML(inputString) {
    return inputString.replace(
        /<table([^>]*)>/gi,
        (match, existingAttributes) => {
            // Check if table already has a class attribute
            if (existingAttributes.includes('class=')) {
                // Append Bootstrap classes to existing class attribute
                return match.replace(
                    /class="([^"]*)"/,
                    'class="$1 table table-dark table-striped"'
                );
            }
            // Add Bootstrap classes to tables without existing class
            return `<table${existingAttributes} class="table table-sm table-dark table-striped-columns">`;
        }
    );
}

/**
 * Replace href attributes in anchor tags based on link type
 * - Anchor links (#section): Keep href, add scroll handler
 * - HTTP/HTTPS links: Keep href, add styling
 * - Relative/absolute document links: Convert to Vue click handler
 *
 * @param {string} inputString - HTML string with anchor tags
 * @param adjustHrefPath  Function To modify href paths if needed
 * @returns {string} Modified HTML string
 *
 */
export function replaceHrefLinks(inputString, adjustHrefPath = (path) => path) {
  return inputString.replace(
    /a href="([^"]*)"/g,
    (match, param) => {
      logger.debug(`[REGEX_HREF] match=${match} param=${param}`)
      // Check if it's an anchor link (starts with #)
      if (param.startsWith('#')) {
        // Keep href for anchor links - this is the FIX for the bug!
        // Before: would convert to @click handler, losing anchor functionality
        // After: preserves href so browser can scroll to target
        return `a href="${param}" @click.prevent="scrollToAnchor('${param}')"`
      }

      // Check for HTTP/HTTPS links or already has class
      if (match.toLowerCase().includes("http") || match.toLowerCase().includes("class")) {
        return `${match} class="link-primary" target="_blank"`
      }
      
      // Relative/absolute document links - use Vue handler
      return `a  href="${param}" @click.prevent="href('${param}')"`

    }
  );
}

/**
 * Extract size dimensions from alt text
 * Matches format: =100x200 at the end of alt text
 * 
 * @param {string} alt - Alt text that may contain size
 * @returns {Object|null} {width, height} or null if no size found
 */
export function extractSizeFromAlt(alt) {
  const match = alt.match(/=(\d+)x(\d+)$/);
  if (match) {
    return { width: match[1], height: match[2] };
  }
  return null;
}

/**
 * Replace img src attributes and handle size extraction from alt text
 * Converts relative paths to absolute paths for documentation
 * 
 * @param {string} inputString - HTML string with img tags
 * @returns {string} Modified HTML string
 */
export function replaceImgLinks(inputString) {
  return inputString.replace(
    /img src="([^"]*)" alt="([^"]*)"/g,
    (match, src, alt) => {
      logger.debug(`[REGEX_IMG] match=${match} src=${src} alt=${alt}`)
      const size = extractSizeFromAlt(alt);
      let sizeAttrs = '';
      if (size) {
        sizeAttrs = `width="${size.width}" `;
        alt = alt.replace(/=(\d+)x(\d+)$/, ''); // Remove size from alt
      }
      const adjustedSrc = "" + src.replace(/^\.\//, remotePathPrefix);
      logger.debug(`[IMG] - ${src} -> ${adjustedSrc}`)
      return `img src="${adjustedSrc}" class="mk-img" ${sizeAttrs} alt="${alt.trim()}"`
    }
  );
}

/**
 * Replace Vue template syntax to prevent interpretation
 * Escapes {{ }} so they display literally in markdown
 * 
 * @param {string} text - HTML/text with potential Vue syntax
 * @returns {string} Text with escaped Vue syntax
 */
export function replaceVueSpecial(text) {
  const regex = /\{\{\s*(.+?)\s*\}\}/g;
  const after = text.replace(regex, '&lbrace;&lbrace;$1&rbrace;&rbrace;');
  return after
}

/**
 * Remove YAML front matter from markdown text
 * Front matter is enclosed in --- delimiters
 * 
 * @param {string} markdownText - Markdown text that may have front matter
 * @returns {string} Markdown text without front matter
 */
export function removeMarkdownHeader(markdownText) {
  let text = markdownText
  if(text.startsWith("---")) {
    const lines = text.split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if(line.includes("---")) {
        logger.debug(`${i} lines of header`)
        return lines.slice(i+1).join("\n")
      }
      if(line.includes("#")) {
        return text
      }
    }
  }
  return text
}


// ________________________________________________________________________________
// EXPORTED UTILITY FUNCTIONS
// ________________________________________________________________________________
/**
 * Slugify a string for use as an anchor ID
 * Matches markdown-it-anchor behavior with custom normalization
 *
 * Converts: "Common Example / Skeleton" -> "common-example-skeleton"
 * Converts: "Test & Validation" -> "test-validation"
 * Converts: "100% Coverage" -> "100-coverage"
 *
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
export function slugify(str) {
    return str.toLowerCase()
        .trim()
        .replace(/\s+/g, '-')           // spaces → hyphens
        .replace(/[^\w\-]+/g, '-')      // special chars → hyphens
        .replace(/\-\-+/g, '-')         // multiple hyphens → single hyphen
        .replace(/^-+/, '')             // trim leading hyphens
        .replace(/-+$/, '')             // trim trailing hyphens
}
