/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
let globalScope;
if (typeof window === 'undefined') {
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        // TODO: Replace any with WorkerGlobalScope from lib.webworker.d.ts #3492
        globalScope = self;
    }
    else {
        globalScope = global;
    }
}
else {
    globalScope = window;
}
function scheduleMicroTask(fn) {
    Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
}
exports.scheduleMicroTask = scheduleMicroTask;
// Need to declare a new variable for global here since TypeScript
// exports the original value of the symbol.
const _global = globalScope;
exports.global = _global;
function getTypeNameForDebugging(type) {
    return type['name'] || typeof type;
}
exports.getTypeNameForDebugging = getTypeNameForDebugging;
// TODO: remove calls to assert in production environment
// Note: Can't just export this and import in in other files
// as `assert` is a reserved keyword in Dart
_global.assert = function assert(condition) {
    // TODO: to be fixed properly via #2830, noop for now
};
function isPresent(obj) {
    return obj != null;
}
exports.isPresent = isPresent;
function isBlank(obj) {
    return obj == null;
}
exports.isBlank = isBlank;
const STRING_MAP_PROTO = Object.getPrototypeOf({});
function isStrictStringMap(obj) {
    return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}
exports.isStrictStringMap = isStrictStringMap;
function isDate(obj) {
    return obj instanceof Date && !isNaN(obj.valueOf());
}
exports.isDate = isDate;
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token == null) {
        return '' + token;
    }
    if (token.overriddenName) {
        return `${token.overriddenName}`;
    }
    if (token.name) {
        return `${token.name}`;
    }
    const res = token.toString();
    const newLineIndex = res.indexOf('\n');
    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
}
exports.stringify = stringify;
class NumberWrapper {
    static parseIntAutoRadix(text) {
        const result = parseInt(text);
        if (isNaN(result)) {
            throw new Error('Invalid integer literal when parsing ' + text);
        }
        return result;
    }
    static isNumeric(value) { return !isNaN(value - parseFloat(value)); }
}
exports.NumberWrapper = NumberWrapper;
// JS has NaN !== NaN
function looseIdentical(a, b) {
    return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}
exports.looseIdentical = looseIdentical;
function isJsObject(o) {
    return o !== null && (typeof o === 'function' || typeof o === 'object');
}
exports.isJsObject = isJsObject;
function print(obj) {
    // tslint:disable-next-line:no-console
    console.log(obj);
}
exports.print = print;
function warn(obj) {
    console.warn(obj);
}
exports.warn = warn;
function setValueOnPath(global, path, value) {
    const parts = path.split('.');
    let obj = global;
    while (parts.length > 1) {
        const name = parts.shift();
        if (obj.hasOwnProperty(name) && obj[name] != null) {
            obj = obj[name];
        }
        else {
            obj = obj[name] = {};
        }
    }
    if (obj === undefined || obj === null) {
        obj = {};
    }
    obj[parts.shift()] = value;
}
exports.setValueOnPath = setValueOnPath;
let _symbolIterator = null;
function getSymbolIterator() {
    if (!_symbolIterator) {
        if (globalScope.Symbol && Symbol.iterator) {
            _symbolIterator = Symbol.iterator;
        }
        else {
            // es6-shim specific logic
            const keys = Object.getOwnPropertyNames(Map.prototype);
            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];
                if (key !== 'entries' && key !== 'size' &&
                    Map.prototype[key] === Map.prototype['entries']) {
                    _symbolIterator = key;
                }
            }
        }
    }
    return _symbolIterator;
}
exports.getSymbolIterator = getSymbolIterator;
function isPrimitive(obj) {
    return !isJsObject(obj);
}
exports.isPrimitive = isPrimitive;
function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
exports.escapeRegExp = escapeRegExp;
//# sourceMappingURL=lang.js.map