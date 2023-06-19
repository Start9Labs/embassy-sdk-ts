"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHaveNthReturnedWith = exports.toHaveReturnedTimes = exports.toHaveLastReturnedWith = exports.toHaveReturned = exports.toHaveReturnedWith = exports.toHaveBeenNthCalledWith = exports.toHaveBeenLastCalledWith = exports.toHaveBeenCalledWith = exports.toHaveBeenCalledTimes = exports.toHaveBeenCalled = exports.toThrow = exports.toContain = exports.toHaveLength = exports.toHaveProperty = exports.toMatch = exports.toBeInstanceOf = exports.toBeNaN = exports.toBeNull = exports.toBeUndefined = exports.toBeDefined = exports.toBeFalsy = exports.toBeTruthy = exports.toBeLessThanOrEqual = exports.toBeGreaterThanOrEqual = exports.toBeLessThan = exports.toBeGreaterThan = exports.toEqual = exports.toBe = void 0;
const dntShim = __importStar(require("../../../../_dnt.test_shims.js"));
const asserts_js_1 = require("../../std@0.97.0/testing/asserts.js");
const _diff_js_1 = require("../../std@0.97.0/testing/_diff.js");
const colors_js_1 = require("../../std@0.97.0/fmt/colors.js");
const mock = __importStar(require("./mock.js"));
const ACTUAL = (0, colors_js_1.red)((0, colors_js_1.bold)('actual'));
const EXPECTED = (0, colors_js_1.green)((0, colors_js_1.bold)('expected'));
const CAN_NOT_DISPLAY = '[Cannot display]';
function createStr(v) {
    try {
        return dntShim.Deno.inspect(v);
    }
    catch (e) {
        return (0, colors_js_1.red)(CAN_NOT_DISPLAY);
    }
}
function createColor(diffType) {
    switch (diffType) {
        case _diff_js_1.DiffType.added:
            return (s) => (0, colors_js_1.green)((0, colors_js_1.bold)(s));
        case _diff_js_1.DiffType.removed:
            return (s) => (0, colors_js_1.red)((0, colors_js_1.bold)(s));
        default:
            return colors_js_1.white;
    }
}
function createSign(diffType) {
    switch (diffType) {
        case _diff_js_1.DiffType.added:
            return '+   ';
        case _diff_js_1.DiffType.removed:
            return '-   ';
        default:
            return '    ';
    }
}
function buildMessage(diffResult) {
    return diffResult
        .map((result) => {
        const c = createColor(result.type);
        return c(`${createSign(result.type)}${result.value}`);
    })
        .join('\n');
}
function buildDiffMessage(actual, expected) {
    const actualString = createStr(actual);
    const expectedString = createStr(expected);
    let message;
    try {
        const diffResult = (0, _diff_js_1.diff)(actualString.split('\n'), expectedString.split('\n'));
        return buildMessage(diffResult);
    }
    catch (e) {
        return `\n${(0, colors_js_1.red)(CAN_NOT_DISPLAY)} + \n\n`;
    }
}
function buildFail(message) {
    return {
        pass: false,
        message
    };
}
function toBe(actual, expected) {
    if (actual === expected)
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toBe(${EXPECTED})\n\n${buildDiffMessage(actual, expected)}`);
}
exports.toBe = toBe;
function toEqual(actual, expected) {
    if ((0, asserts_js_1.equal)(actual, expected))
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toEqual(${EXPECTED})\n\n${buildDiffMessage(actual, expected)}`);
}
exports.toEqual = toEqual;
function toBeGreaterThan(actual, comparison) {
    if (actual > comparison)
        return { pass: true };
    const actualString = createStr(actual);
    const comparisonString = createStr(comparison);
    return buildFail(`expect(${ACTUAL}).toBeGreaterThan(${EXPECTED})\n\n  ${(0, colors_js_1.red)(actualString)} is not greater than ${(0, colors_js_1.green)(comparisonString)}`);
}
exports.toBeGreaterThan = toBeGreaterThan;
function toBeLessThan(actual, comparison) {
    if (actual < comparison)
        return { pass: true };
    const actualString = createStr(actual);
    const comparisonString = createStr(comparison);
    return buildFail(`expect(${ACTUAL}).toBeLessThan(${EXPECTED})\n\n  ${(0, colors_js_1.red)(actualString)} is not less than ${(0, colors_js_1.green)(comparisonString)}`);
}
exports.toBeLessThan = toBeLessThan;
function toBeGreaterThanOrEqual(actual, comparison) {
    if (actual >= comparison)
        return { pass: true };
    const actualString = createStr(actual);
    const comparisonString = createStr(comparison);
    return buildFail(`expect(${ACTUAL}).toBeGreaterThanOrEqual(${EXPECTED})\n\n  ${(0, colors_js_1.red)(actualString)} is not greater than or equal to ${(0, colors_js_1.green)(comparisonString)}`);
}
exports.toBeGreaterThanOrEqual = toBeGreaterThanOrEqual;
function toBeLessThanOrEqual(actual, comparison) {
    if (actual <= comparison)
        return { pass: true };
    const actualString = createStr(actual);
    const comparisonString = createStr(comparison);
    return buildFail(`expect(${ACTUAL}).toBeLessThanOrEqual(${EXPECTED})\n\n  ${(0, colors_js_1.red)(actualString)} is not less than or equal to ${(0, colors_js_1.green)(comparisonString)}`);
}
exports.toBeLessThanOrEqual = toBeLessThanOrEqual;
function toBeTruthy(value) {
    if (value)
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeTruthy()

      ${(0, colors_js_1.red)(actualString)} is not truthy`);
}
exports.toBeTruthy = toBeTruthy;
function toBeFalsy(value) {
    if (!value)
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeFalsy()\n\n    ${(0, colors_js_1.red)(actualString)} is not falsy`);
}
exports.toBeFalsy = toBeFalsy;
function toBeDefined(value) {
    if (typeof value !== 'undefined')
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeDefined()\n\n    ${(0, colors_js_1.red)(actualString)} is not defined`);
}
exports.toBeDefined = toBeDefined;
function toBeUndefined(value) {
    if (typeof value === 'undefined')
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeUndefined()\n\n    ${(0, colors_js_1.red)(actualString)} is defined but should be undefined`);
}
exports.toBeUndefined = toBeUndefined;
function toBeNull(value) {
    if (value === null)
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeNull()\n\n    ${(0, colors_js_1.red)(actualString)} should be null`);
}
exports.toBeNull = toBeNull;
function toBeNaN(value) {
    if (typeof value === 'number' && isNaN(value))
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeNaN()\n\n    ${(0, colors_js_1.red)(actualString)} should be NaN`);
}
exports.toBeNaN = toBeNaN;
function toBeInstanceOf(value, expected) {
    if (value instanceof expected)
        return { pass: true };
    const actualString = createStr(value);
    const expectedString = createStr(expected);
    return buildFail(`expect(${ACTUAL}).toBeInstanceOf(${EXPECTED})\n\n    expected ${(0, colors_js_1.green)(expected.name)} but received ${(0, colors_js_1.red)(actualString)}`);
}
exports.toBeInstanceOf = toBeInstanceOf;
function toMatch(value, pattern) {
    const valueStr = value.toString();
    if (typeof pattern === 'string') {
        if (valueStr.indexOf(pattern) !== -1)
            return { pass: true };
        const actualString = createStr(value);
        const patternString = createStr(pattern);
        return buildFail(`expect(${ACTUAL}).toMatch(${EXPECTED})\n\n    expected ${(0, colors_js_1.red)(actualString)} to contain ${(0, colors_js_1.green)(patternString)}`);
    }
    else if (pattern instanceof RegExp) {
        if (pattern.exec(valueStr))
            return { pass: true };
        const actualString = createStr(value);
        const patternString = createStr(pattern);
        return buildFail(`expect(${ACTUAL}).toMatch(${EXPECTED})\n\n    ${(0, colors_js_1.red)(actualString)} did not match regex ${(0, colors_js_1.green)(patternString)}`);
    }
    else {
        return buildFail('Invalid internal state');
    }
}
exports.toMatch = toMatch;
function toHaveProperty(value, propName) {
    if (typeof value === 'object' && typeof value[propName] !== 'undefined') {
        return { pass: true };
    }
    const actualString = createStr(value);
    const propNameString = createStr(propName);
    return buildFail(`expect(${ACTUAL}).toHaveProperty(${EXPECTED})\n\n    ${(0, colors_js_1.red)(actualString)} did not contain property ${(0, colors_js_1.green)(propNameString)}`);
}
exports.toHaveProperty = toHaveProperty;
function toHaveLength(value, length) {
    if (value?.length === length)
        return { pass: true };
    const actualString = createStr(value.length);
    const lengthString = createStr(length);
    return buildFail(`expect(${ACTUAL}).toHaveLength(${EXPECTED})\n\n    expected array to have length ${(0, colors_js_1.green)(lengthString)} but was ${(0, colors_js_1.red)(actualString)}`);
}
exports.toHaveLength = toHaveLength;
function toContain(value, item) {
    if (value && typeof value.includes === 'function' && value.includes(item)) {
        return { pass: true };
    }
    const actualString = createStr(value);
    const itemString = createStr(item);
    if (value && typeof value.includes === 'function') {
        return buildFail(`expect(${ACTUAL}).toContain(${EXPECTED})\n\n    ${(0, colors_js_1.red)(actualString)} did not contain ${(0, colors_js_1.green)(itemString)}`);
    }
    else {
        return buildFail(`expect(${ACTUAL}).toContain(${EXPECTED})\n\n    expected ${(0, colors_js_1.red)(actualString)} to have an includes method but it is ${(0, colors_js_1.green)(itemString)}`);
    }
}
exports.toContain = toContain;
function toThrow(value, error) {
    let fn;
    if (typeof value === 'function') {
        fn = value;
        try {
            value = value();
        }
        catch (err) {
            value = err;
        }
    }
    const actualString = createStr(fn);
    const errorString = createStr(error);
    if (value instanceof Error) {
        if (typeof error === 'string') {
            if (!value.message.includes(error)) {
                return buildFail(`expect(${ACTUAL}).toThrow(${EXPECTED})\n\nexpected ${(0, colors_js_1.red)(actualString)} to throw error matching ${(0, colors_js_1.green)(errorString)} but it threw ${(0, colors_js_1.red)(value.toString())}`);
            }
        }
        else if (error instanceof RegExp) {
            if (!value.message.match(error)) {
                return buildFail(`expect(${ACTUAL}).toThrow(${EXPECTED})\n\nexpected ${(0, colors_js_1.red)(actualString)} to throw error matching ${(0, colors_js_1.green)(errorString)} but it threw ${(0, colors_js_1.red)(value.toString())}`);
            }
        }
        return { pass: true };
    }
    else {
        return buildFail(`expect(${ACTUAL}).toThrow(${EXPECTED})\n\nexpected ${(0, colors_js_1.red)(actualString)} to throw but it did not`);
    }
}
exports.toThrow = toThrow;
function extractMockCalls(value, name) {
    if (typeof value !== 'function') {
        return {
            calls: null,
            error: `${name} only works on mock functions. received: ${value}`
        };
    }
    const calls = mock.calls(value);
    if (calls === null) {
        return { calls: null, error: `${name} only works on mock functions` };
    }
    return { calls };
}
function toHaveBeenCalled(value) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenCalled');
    if (error)
        return buildFail(error);
    const actualString = createStr(value);
    if (calls && calls.length !== 0)
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toHaveBeenCalled()\n\n    ${(0, colors_js_1.red)(actualString)} was not called`);
}
exports.toHaveBeenCalled = toHaveBeenCalled;
function toHaveBeenCalledTimes(value, times) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenCalledTimes');
    if (error)
        return buildFail(error);
    if (!calls)
        return buildFail('Invalid internal state');
    if (calls && calls.length === times)
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toHaveBeenCalledTimes(${EXPECTED})\n\n    expected ${times} calls but was called: ${calls.length}`);
}
exports.toHaveBeenCalledTimes = toHaveBeenCalledTimes;
function toHaveBeenCalledWith(value, ...args) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenCalledWith');
    if (error)
        return buildFail(error);
    const wasCalledWith = calls && calls.some((c) => (0, asserts_js_1.equal)(c.args, args));
    if (wasCalledWith)
        return { pass: true };
    const argsString = createStr(args);
    return buildFail(`expect(${ACTUAL}).toHaveBeenCalledWith(${EXPECTED})\n\n    function was not called with: ${(0, colors_js_1.green)(argsString)}`);
}
exports.toHaveBeenCalledWith = toHaveBeenCalledWith;
function toHaveBeenLastCalledWith(value, ...args) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenLastCalledWith');
    if (error)
        return buildFail(error);
    if (!calls || !calls.length) {
        return buildFail(`expect(${ACTUAL}).toHaveBeenLastCalledWith(...${EXPECTED})\n\n    expect last call args to be ${args} but was not called`);
    }
    const lastCall = calls[calls.length - 1];
    if ((0, asserts_js_1.equal)(lastCall.args, args))
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toHaveBeenLastCalledWith(...${EXPECTED})\n\n    expect last call args to be ${args} but was: ${lastCall.args}`);
}
exports.toHaveBeenLastCalledWith = toHaveBeenLastCalledWith;
function toHaveBeenNthCalledWith(value, nth, ...args) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenNthCalledWith');
    if (error)
        return buildFail(error);
    const nthCall = calls && calls[nth - 1];
    if (nthCall) {
        if ((0, asserts_js_1.equal)(nthCall.args, args))
            return { pass: true };
        return buildFail(`expect(${ACTUAL}).toHaveBeenNthCalledWith(${EXPECTED})\n\n    expect ${nth}th call args to be ${args} but was: ${nthCall.args}`);
    }
    else {
        return buildFail(`expect(${ACTUAL}).toHaveBeenNthCalledWith(${EXPECTED})\n\n    ${nth}th call was not made.`);
    }
}
exports.toHaveBeenNthCalledWith = toHaveBeenNthCalledWith;
function toHaveReturnedWith(value, result) {
    const { calls, error } = extractMockCalls(value, 'toHaveReturnedWith');
    if (error)
        return buildFail(error);
    const wasReturnedWith = calls && calls.some((c) => c.returns && (0, asserts_js_1.equal)(c.returned, result));
    if (wasReturnedWith)
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toHaveReturnedWith(${EXPECTED})\n\n    function did not return: ${result}`);
}
exports.toHaveReturnedWith = toHaveReturnedWith;
function toHaveReturned(value) {
    const { calls, error } = extractMockCalls(value, 'toHaveReturned');
    if (error)
        return buildFail(error);
    if (calls && calls.some((c) => c.returns))
        return { pass: true };
    // TODO(allain): better messages
    return buildFail(`expected function to return but it never did`);
}
exports.toHaveReturned = toHaveReturned;
// TODO(allain): better messages
function toHaveLastReturnedWith(value, expected) {
    const { calls, error } = extractMockCalls(value, 'toHaveLastReturnedWith');
    if (error)
        return buildFail(error);
    const lastCall = calls && calls[calls.length - 1];
    if (!lastCall) {
        return buildFail('no calls made to function');
    }
    if (lastCall.throws) {
        return buildFail(`last call to function threw: ${lastCall.thrown}`);
    }
    if ((0, asserts_js_1.equal)(lastCall.returned, expected))
        return { pass: true };
    return buildFail(`expected last call to return ${expected} but returned: ${lastCall.returned}`);
}
exports.toHaveLastReturnedWith = toHaveLastReturnedWith;
function toHaveReturnedTimes(value, times) {
    const { calls, error } = extractMockCalls(value, 'toHaveReturnedTimes');
    if (error)
        return buildFail(error);
    const returnCount = calls && calls.filter((c) => c.returns).length;
    if (returnCount !== times) {
        return buildFail(`expected ${times} returned times but returned ${returnCount} times`);
    }
    return { pass: true };
}
exports.toHaveReturnedTimes = toHaveReturnedTimes;
function toHaveNthReturnedWith(value, nth, expected) {
    const { calls, error } = extractMockCalls(value, 'toHaveNthReturnedWith');
    if (error)
        return buildFail(error);
    const nthCall = calls && calls[nth - 1];
    if (!nthCall) {
        return buildFail(`${nth} calls were now made`);
    }
    if (nthCall.throws) {
        return buildFail(`${nth}th call to function threw: ${nthCall.thrown}`);
    }
    if (!(0, asserts_js_1.equal)(nthCall.returned, expected)) {
        return buildFail(`expected ${nth}th call to return ${expected} but returned: ${nthCall.returned}`);
    }
    return { pass: true };
}
exports.toHaveNthReturnedWith = toHaveNthReturnedWith;