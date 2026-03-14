import { expect, test } from 'vitest'

// Import the functions to test
import {
    sha256,
    sha1,
    generateRandomId,
    convertMsToString,
    sortObjectKeysWithIdFirst,
    sortByPropertyAsc,
    sortByPropertyDesc,
    extractBasePath,
    extractBasePath2,
    substrAfterFirstSlash,
    substrWithoutLeadingSlash,
    endpointToRouterName,
    capitalizeFirstLetter,
    extractLastPath,
    truncateAndKeepLast,
    truncateAndKeepFirst,
    parentPath,
    leafPath,
    startsWithLetter,
    groupArrayByProperty,
    groupObjectByProperty,
    bytesToMB,
    formatBytes,
    formatDuration,
    tryJson,
    ok,
    nok,
    indexOfNonString,
    splitPathString,
    cleanFileName
} from '../../core/JsUtils.mjs';

// ________________________________________________________________________________
// sha256
// ________________________________________________________________________________
test('sha256 - hashes text to hex string', async () => {
    // Uses crypto.subtle which is available in Node.js
    const result = await sha256('hello');
    expect(result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
});

test('sha256 - returns consistent hash for same input', async () => {
    const result1 = await sha256('test');
    const result2 = await sha256('test');
    expect(result1).toBe(result2);
});

test('sha256 - different inputs produce different hashes', async () => {
    const result1 = await sha256('hello');
    const result2 = await sha256('world');
    expect(result1).not.toBe(result2);
});

// ________________________________________________________________________________
// sha1
// ________________________________________________________________________________
test('sha1 - browser only function using window.isSecureContext', () => {
    // This function uses window.isSecureContext which is browser-only
    // Cannot test in Node.js/vitest environment
});

// ________________________________________________________________________________
// generateRandomId
// ________________________________________________________________________________
test('generateRandomId - generates id with default prefix and length', () => {
    const result = generateRandomId();
    expect(result.startsWith('id')).toBe(true);
    expect(result.length).toBe(2 + 8); // 'id' + 8 random chars
});

test('generateRandomId - generates id with custom prefix', () => {
    const result = generateRandomId('user');
    expect(result.startsWith('user')).toBe(true);
    expect(result.length).toBe(4 + 8); // 'user' + 8 random chars
});

test('generateRandomId - generates id with custom length', () => {
    const result = generateRandomId('id', 12);
    expect(result.startsWith('id')).toBe(true);
    expect(result.length).toBe(2 + 12);
});

test('generateRandomId - contains only alphanumeric characters after prefix', () => {
    const result = generateRandomId('pre', 20);
    const randomPart = result.slice(3);
    expect(/^[A-Za-z0-9]+$/.test(randomPart)).toBe(true);
});

// ________________________________________________________________________________
// convertMsToString
// ________________________________________________________________________________
test('convertMsToString - converts milliseconds', () => {
    expect(convertMsToString(500)).toBe('500 ms');
    expect(convertMsToString(5000)).toBe('5.00 s');
    expect(convertMsToString(120000)).toBe('2.00 mins');
    expect(convertMsToString(1000)).toBe('1.00 s');
    expect(convertMsToString(60000)).toBe('1.00 mins');
});


// ________________________________________________________________________________
// sortObjectKeysWithIdFirst
// ________________________________________________________________________________
test('sortObjectKeysWithIdFirst - puts id first and sorts other keys', () => {
    const input = { name: 'test', id: '123', age: 25 };
    const result = sortObjectKeysWithIdFirst(input);
    const keys = Object.keys(result);
    expect(keys[0]).toBe('id');
    expect(keys.slice(1)).toEqual(['age', 'name']);
});

test('sortObjectKeysWithIdFirst - works without id key', () => {
    const input = { name: 'test', age: 25 };
    const result = sortObjectKeysWithIdFirst(input);
    const keys = Object.keys(result);
    expect(keys).toEqual(['age', 'name']);
});

test('sortObjectKeysWithIdFirst - preserves values', () => {
    const input = { name: 'test', id: '123', age: 25 };
    const result = sortObjectKeysWithIdFirst(input);
    expect(result.id).toBe('123');
    expect(result.name).toBe('test');
    expect(result.age).toBe(25);
});

// ________________________________________________________________________________
// sortByPropertyAsc
// ________________________________________________________________________________
test('sortByPropertyAsc - sorts numbers ascending', () => {
    const arr = [{ val: 3 }, { val: 1 }, { val: 2 }];
    const result = sortByPropertyAsc(arr, 'val');
    expect(result.map(x => x.val)).toEqual([1, 2, 3]);
});

test('sortByPropertyAsc - sorts strings ascending', () => {
    const arr = [{ name: 'charlie' }, { name: 'alice' }, { name: 'bob' }];
    const result = sortByPropertyAsc(arr, 'name');
    expect(result.map(x => x.name)).toEqual(['alice', 'bob', 'charlie']);
});

// ________________________________________________________________________________
// sortByPropertyDesc
// ________________________________________________________________________________
test('sortByPropertyDesc - sorts numbers descending', () => {
    const arr = [{ val: 1 }, { val: 3 }, { val: 2 }];
    const result = sortByPropertyDesc(arr, 'val');
    expect(result.map(x => x.val)).toEqual([3, 2, 1]);
});

test('sortByPropertyDesc - sorts strings descending', () => {
    const arr = [{ name: 'alice' }, { name: 'charlie' }, { name: 'bob' }];
    const result = sortByPropertyDesc(arr, 'name');
    expect(result.map(x => x.name)).toEqual(['charlie', 'bob', 'alice']);
});

// ________________________________________________________________________________
// extractBasePath
// ________________________________________________________________________________
test('extractBasePath - extracts base path with trailing slash', () => {
    expect(extractBasePath('/osgi/_admin')).toBe('/osgi/');
    expect(extractBasePath('/client/cli/homepage')).toBe('/client/cli/');
    expect(extractBasePath('/user/profile')).toBe('/user/');
    expect(extractBasePath('')).toBe('');
    expect(extractBasePath('no-slash')).toBe('');
    expect(extractBasePath('/')).toBe('');
    expect(() => extractBasePath(123)).toThrow('[INVALID_ARGUMENT]');
});

// ________________________________________________________________________________
// extractBasePath2
// ________________________________________________________________________________
test('extractBasePath2 - extracts base path without trailing slash', () => {
    expect(extractBasePath2('/osgi/_admin')).toBe('/osgi');
    expect(extractBasePath2('/client/cli/homepage')).toBe('/client/cli');
    expect(extractBasePath2('/user/profile')).toBe('/user');
    expect(extractBasePath2('/settings')).toBe('/');
    expect(extractBasePath2('no-slash')).toBe('/');
    expect(extractBasePath2('/')).toBe('/');
    expect(extractBasePath2('')).toBe('/');
    expect(() => extractBasePath2(123)).toThrow('[INVALID_ARGUMENT]');
});

// ________________________________________________________________________________
// substrAfterFirstSlash
// ________________________________________________________________________________
test('substrAfterFirstSlash - extracts first segment', () => {
    expect(substrAfterFirstSlash('/client/cli/homepage')).toBe('client');
    expect(substrAfterFirstSlash('/user/profile')).toBe('user');
    expect(substrAfterFirstSlash('/settings')).toBe('settings');
    expect(substrAfterFirstSlash('no-slash')).toBe('no-slash');
    expect(substrAfterFirstSlash('/')).toBe('');
});

// ________________________________________________________________________________
// substrWithoutLeadingSlash
// ________________________________________________________________________________
test('substrWithoutLeadingSlash - removes trailing slash', () => {
    expect(substrWithoutLeadingSlash('/test/')).toBe('/test');
    expect(substrWithoutLeadingSlash('/test')).toBe('/test');
    expect(substrWithoutLeadingSlash('')).toBe('');
});

// ________________________________________________________________________________
// endpointToRouterName
// ________________________________________________________________________________
test('endpointToRouterName - converts single segment', () => {
    expect(endpointToRouterName('/cli')).toBe('cli');
    expect(endpointToRouterName('/cli/test')).toBe('cli-test');
    expect(endpointToRouterName('/cli/test/')).toBe('cli-test');
    expect(endpointToRouterName('cli')).toBe('cli');
    expect(endpointToRouterName('')).toBe('');
    expect(endpointToRouterName('/')).toBe('');
});

// ________________________________________________________________________________
// capitalizeFirstLetter
// ________________________________________________________________________________
test('capitalizeFirstLetter - capitalizes first letter', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
    expect(capitalizeFirstLetter('')).toBe('');
    expect(capitalizeFirstLetter('a')).toBe('A');
});

// ________________________________________________________________________________
// extractLastPath
// ________________________________________________________________________________
test('extractLastPath - extracts file name from path', () => {
    expect(extractLastPath('/test/1/2/3/vue.js')).toBe('vue.js');
    expect(extractLastPath('/a/b/c')).toBe('c');
    expect(extractLastPath('file.txt')).toBe('file.txt');
});

// ________________________________________________________________________________
// truncateAndKeepLast
// ________________________________________________________________________________
test('truncateAndKeepLast - keeps full text if shorter than max', () => {
    expect(truncateAndKeepLast('hello', 16)).toBe('hello');
    expect(truncateAndKeepLast('this is a long text', 8)).toBe('ong text');
    expect(truncateAndKeepLast('short')).toBe('short');
});

// ________________________________________________________________________________
// truncateAndKeepFirst
// ________________________________________________________________________________
test('truncateAndKeepFirst - keeps full text if shorter than max', () => {
    expect(truncateAndKeepFirst('hello', 16)).toBe('hello');
    expect(truncateAndKeepFirst('this is a long text', 8)).toBe('this is ');
    expect(truncateAndKeepFirst(undefined)).toBe('');
    expect(truncateAndKeepFirst(null)).toBe('');
});

// ________________________________________________________________________________
// parentPath
// ________________________________________________________________________________
test('parentPath - extracts parent with trailing slash', () => {
    expect(parentPath('/osgi/_admin/')).toBe('/osgi');
    expect(parentPath('/osgi/_admin')).toBe('/osgi');
    expect(parentPath('/osgi')).toBe('');
    expect(parentPath('/osgi/')).toBe('');
    expect(parentPath('osgi')).toBe('');
});

// ________________________________________________________________________________
// leafPath
// ________________________________________________________________________________
test('leafPath - extracts leaf from path', () => {
    expect(leafPath('/cli/test/hello')).toBe('hello');
    expect(leafPath('cli')).toBe('cli');
    expect(leafPath('/cli/test/')).toBe('');
});

// ________________________________________________________________________________
// startsWithLetter
// ________________________________________________________________________________
test('startsWithLetter - returns true for lowercase letter', () => {
    expect(startsWithLetter('hello')).toBe(true);
    expect(startsWithLetter('Hello')).toBe(true);
    expect(startsWithLetter('123')).toBe(false);
    expect(startsWithLetter('_test')).toBe(false);
    expect(startsWithLetter('')).toBe(false);
});


// ________________________________________________________________________________
// groupArrayByProperty
// ________________________________________________________________________________
test('groupArrayByProperty - groups items by property', () => {
    const items = [
        { name: 'a', group: 'A' },
        { name: 'b', group: 'B' },
        { name: 'c', group: 'A' }
    ];
    const result = groupArrayByProperty(items, 'group');
    expect(result['A'].length).toBe(2);
    expect(result['B'].length).toBe(1);
});

test('groupArrayByProperty - throws for undefined property value', () => {
    const items = [{ name: 'a' }];
    expect(() => groupArrayByProperty(items, 'group')).toThrow('Invalid value for property');
});

test('groupArrayByProperty - throws for blank string property value', () => {
    const items = [{ name: 'a', group: '  ' }];
    expect(() => groupArrayByProperty(items, 'group')).toThrow('Invalid value for property');
});

// ________________________________________________________________________________
// groupObjectByProperty
// ________________________________________________________________________________
test('groupObjectByProperty - groups object values by property', () => {
    const data = {
        id1: { name: 'a', group: 'A' },
        id2: { name: 'b', group: 'B' },
        id3: { name: 'c', group: 'A' }
    };
    const result = groupObjectByProperty(data, 'group');
    expect(result['A'].length).toBe(2);
    expect(result['B'].length).toBe(1);
});

test('groupObjectByProperty - adds dataKey property', () => {
    const data = {
        id1: { name: 'a', group: 'A' }
    };
    const result = groupObjectByProperty(data, 'group');
    expect(result['A'][0].dataKey).toBe('id1');
});

test('groupObjectByProperty - throws for undefined property value', () => {
    const data = { id1: { name: 'a' } };
    expect(() => groupObjectByProperty(data, 'group')).toThrow('Invalid value for property');
});

// ________________________________________________________________________________
// bytesToMB
// ________________________________________________________________________________
test('bytesToMB - converts bytes to megabytes', () => {
    expect(bytesToMB(1048576)).toBe('1.000');
    expect(bytesToMB(524288)).toBe('0.500');
});

// ________________________________________________________________________________
// formatBytes
// ________________________________________________________________________________
test('formatBytes - formats bytes', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(2048)).toBe('2.00 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
    expect(formatBytes(1073741824)).toBe('1.00 GB');
    expect(formatBytes(1099511627776)).toBe('1.00 TB');
    expect(formatBytes(undefined)).toBe('Unknown');
    expect(formatBytes(null)).toBe('Unknown');
    expect(formatBytes(NaN)).toBe('Unknown');
});

// ________________________________________________________________________________
// formatDuration
// ________________________________________________________________________________
test('formatDuration - formats seconds', () => {
    expect(formatDuration(5000)).toBe('5.00s');
    expect(formatDuration(65000)).toBe('1m 5.00s');
    expect(formatDuration(3665000)).toBe('1h 1m 5.00s');
    expect(formatDuration(90065000)).toBe('1d 1h 1m 5.00s');
    expect(formatDuration(undefined)).toBe('Unknown');
    expect(formatDuration(null)).toBe('Unknown');
});

// ________________________________________________________________________________
// tryJson
// ________________________________________________________________________________
test('tryJson - parses and formats valid JSON', () => {
    const input = '{"name":"test"}';
    const result = tryJson(input);
    expect(result).toBe('{\n  "name": "test"\n}');
});

test('tryJson - returns original data for invalid JSON', () => {
    const input = 'not json';
    expect(tryJson(input)).toBe('not json');
});

// ________________________________________________________________________________
// ok
// ________________________________________________________________________________
test('ok - creates success result', () => {
    const result = ok('data');
    expect(result.isOk).toBe(true);
    expect(result.result).toBe('data');
});

test('ok - handles object result', () => {
    const result = ok({ name: 'test' });
    expect(result.isOk).toBe(true);
    expect(result.result.name).toBe('test');
});

// ________________________________________________________________________________
// nok
// ________________________________________________________________________________
test('nok - creates failure result', () => {
    const result = nok('error');
    expect(result.isOk).toBe(false);
    expect(result.result).toBe('error');
});

test('nok - includes stack', () => {
    const result = nok('error', ['trace1', 'trace2']);
    expect(result.stack).toEqual(['trace1', 'trace2']);
});

test('nok - defaults to empty stack', () => {
    const result = nok('error');
    expect(result.stack).toEqual([]);
});

// ________________________________________________________________________________
// indexOfNonString
// ________________________________________________________________________________
test('indexOfNonString - returns -1 for all strings', () => {
    expect(indexOfNonString(['a', 'b', 'c'])).toBe(-1);
    expect(indexOfNonString(['a', 123, 'c'])).toBe(1);
    expect(indexOfNonString([null, 'a', 'b'])).toBe(0);
    expect(indexOfNonString([])).toBe(-1);
    expect(() => indexOfNonString('not array')).toThrow('indexOfNonString only works with arrays');
});

// ________________________________________________________________________________
// splitPathString
// ________________________________________________________________________________
test('splitPathString - splits path into first and rest', () => {
    const result = splitPathString('/hello/test/one');
    expect(result.first).toBe('/hello');
    expect(result.rest).toBe('/test/one');
});

test('splitPathString - handles multiple segments', () => {
    const result = splitPathString('/1/2/3/4/');
    expect(result.first).toBe('/1');
    expect(result.rest).toBe('/2/3/4/');
});

test('splitPathString - handles single segment', () => {
    const result = splitPathString('/single');
    expect(result.first).toBe('/single');
    expect(result.rest).toBe('');
});

// ________________________________________________________________________________
// cleanFileName
// ________________________________________________________________________________
test('cleanFileName - replaces dots with hyphens', () => {
    expect(cleanFileName('file.name.txt')).toBe('file-name-txt');
    expect(cleanFileName('my file name')).toBe('my-file-name');
    expect(cleanFileName('file@#$name')).toBe('filename');
    expect(cleanFileName('clean-name')).toBe('clean-name');
});

test('cleanFileName - truncates to 24 characters', () => {
    const result = cleanFileName('this is a very long file name that exceeds limit');
    expect(result.length).toBeLessThanOrEqual(24);
});
