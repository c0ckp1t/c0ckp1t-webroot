// ________________________________________________________________________________
// Logging.mjs
// ________________________________________________________________________________

// Note: localStorage is global in browser environment object
// Note: window.log is provided by loglevel library (imported globally in index.html)
// https://github.com/kutuluk/loglevel-plugin-prefix

const loggerPrefixFn = (level, name, timestamp) => `[${name}]`;
const prefixer = prefix.noConflict();
prefixer.reg(log);
prefixer.apply(log, { format: loggerPrefixFn });


// ________________________________________________________________________________
// STORE
// ________________________________________________________________________________
export const store = {
  defaultLogLevel: "INFO",
  localStorageKey: "loggers",
  loggers: { }
}


// https://www.npmjs.com/package/loglevel
export function getLogger(location) {
  const logger = log.getLogger(location)
  if(store.loggers.hasOwnProperty(location)) {
    logger.setLevel(store.loggers[location])
  } else {
    logger.setLevel(store.defaultLogLevel)
    store.loggers[location] = store.defaultLogLevel
  }
  return logger
}

export function setLogger(location, level) {
  const logger = log.getLogger(location)
  logger.setLevel(level)
  store.loggers[location] = level


  localStorage.setItem(store.localStorageKey, JSON.stringify(store.loggers));
}

export function listLoggers() {
  return store.loggers
}

export function clearLocalStorage() {
  localStorage.removeItem(store.localStorageKey)
}

export function init(config) {
  // const json = localStorage.getItem(localStorageKey)
  // Object.assign(loggers, JSON.parse(json));

  log.trace(`[INIT] - trace - enabled`)
  log.debug(`[INIT] - debug - enabled`)
  log.info (`[INIT] - info - enabled`)
  log.warn( `[INIT] - warn - enabled`)
  log.error(`[INIT] - error - enabled`)
  store.loggers = { ...(config?.defaultLoggerLevels ?? {}) }
  store.defaultLogLevel = config?.defaultLogLevel ?? store.defaultLogLevel

  // Re-apply levels to loggers that were created before init() ran.
  // This is necessary because ES module imports are hoisted, so modules
  // like VueUtils.mjs call getLogger() before init() has populated the config.
  const allLoggers = log.getLoggers()
  for (const [name, logger] of Object.entries(allLoggers)) {
    if (store.loggers.hasOwnProperty(name)) {
      logger.setLevel(store.loggers[name])
    } else {
      logger.setLevel(store.defaultLogLevel)
    }
  }
}


