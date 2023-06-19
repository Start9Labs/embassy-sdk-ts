import * as dntShim from "../../../../_dnt.test_shims.js";
import { equal } from '../../std@0.97.0/testing/asserts.js';
import { diff, DiffType } from '../../std@0.97.0/testing/_diff.js';
import { bold, green, red, white } from '../../std@0.97.0/fmt/colors.js';
import * as mock from './mock.js';
const ACTUAL = red(bold('actual'));
const EXPECTED = green(bold('expected'));
const CAN_NOT_DISPLAY = '[Cannot display]';
function createStr(v) {
    try {
        return dntShim.Deno.inspect(v);
    }
    catch (e) {
        return red(CAN_NOT_DISPLAY);
    }
}
function createColor(diffType) {
    switch (diffType) {
        case DiffType.added:
            return (s) => green(bold(s));
        case DiffType.removed:
            return (s) => red(bold(s));
        default:
            return white;
    }
}
function createSign(diffType) {
    switch (diffType) {
        case DiffType.added:
            return '+   ';
        case DiffType.removed:
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
        const diffResult = diff(actualString.split('\n'), expectedString.split('\n'));
        return buildMessage(diffResult);
    }
    catch (e) {
        return `\n${red(CAN_NOT_DISPLAY)} + \n\n`;
    }
}
function buildFail(message) {
    return {
        pass: false,
        message
    };
}
export function toBe(actual, expected) {
    if (actual === expected)
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toBe(${EXPECTED})\n\n${buildDiffMessage(actual, expected)}`);
}
export function toEqual(actual, expected) {
    if (equal(actual, expected))
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toEqual(${EXPECTED})\n\n${buildDiffMessage(actual, expected)}`);
}
export function toBeGreaterThan(actual, comparison) {
    if (actual > comparison)
        return { pass: true };
    const actualString = createStr(actual);
    const comparisonString = createStr(comparison);
    return buildFail(`expect(${ACTUAL}).toBeGreaterThan(${EXPECTED})\n\n  ${red(actualString)} is not greater than ${green(comparisonString)}`);
}
export function toBeLessThan(actual, comparison) {
    if (actual < comparison)
        return { pass: true };
    const actualString = createStr(actual);
    const comparisonString = createStr(comparison);
    return buildFail(`expect(${ACTUAL}).toBeLessThan(${EXPECTED})\n\n  ${red(actualString)} is not less than ${green(comparisonString)}`);
}
export function toBeGreaterThanOrEqual(actual, comparison) {
    if (actual >= comparison)
        return { pass: true };
    const actualString = createStr(actual);
    const comparisonString = createStr(comparison);
    return buildFail(`expect(${ACTUAL}).toBeGreaterThanOrEqual(${EXPECTED})\n\n  ${red(actualString)} is not greater than or equal to ${green(comparisonString)}`);
}
export function toBeLessThanOrEqual(actual, comparison) {
    if (actual <= comparison)
        return { pass: true };
    const actualString = createStr(actual);
    const comparisonString = createStr(comparison);
    return buildFail(`expect(${ACTUAL}).toBeLessThanOrEqual(${EXPECTED})\n\n  ${red(actualString)} is not less than or equal to ${green(comparisonString)}`);
}
export function toBeTruthy(value) {
    if (value)
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeTruthy()

      ${red(actualString)} is not truthy`);
}
export function toBeFalsy(value) {
    if (!value)
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeFalsy()\n\n    ${red(actualString)} is not falsy`);
}
export function toBeDefined(value) {
    if (typeof value !== 'undefined')
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeDefined()\n\n    ${red(actualString)} is not defined`);
}
export function toBeUndefined(value) {
    if (typeof value === 'undefined')
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeUndefined()\n\n    ${red(actualString)} is defined but should be undefined`);
}
export function toBeNull(value) {
    if (value === null)
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeNull()\n\n    ${red(actualString)} should be null`);
}
export function toBeNaN(value) {
    if (typeof value === 'number' && isNaN(value))
        return { pass: true };
    const actualString = createStr(value);
    return buildFail(`expect(${ACTUAL}).toBeNaN()\n\n    ${red(actualString)} should be NaN`);
}
export function toBeInstanceOf(value, expected) {
    if (value instanceof expected)
        return { pass: true };
    const actualString = createStr(value);
    const expectedString = createStr(expected);
    return buildFail(`expect(${ACTUAL}).toBeInstanceOf(${EXPECTED})\n\n    expected ${green(expected.name)} but received ${red(actualString)}`);
}
export function toMatch(value, pattern) {
    const valueStr = value.toString();
    if (typeof pattern === 'string') {
        if (valueStr.indexOf(pattern) !== -1)
            return { pass: true };
        const actualString = createStr(value);
        const patternString = createStr(pattern);
        return buildFail(`expect(${ACTUAL}).toMatch(${EXPECTED})\n\n    expected ${red(actualString)} to contain ${green(patternString)}`);
    }
    else if (pattern instanceof RegExp) {
        if (pattern.exec(valueStr))
            return { pass: true };
        const actualString = createStr(value);
        const patternString = createStr(pattern);
        return buildFail(`expect(${ACTUAL}).toMatch(${EXPECTED})\n\n    ${red(actualString)} did not match regex ${green(patternString)}`);
    }
    else {
        return buildFail('Invalid internal state');
    }
}
export function toHaveProperty(value, propName) {
    if (typeof value === 'object' && typeof value[propName] !== 'undefined') {
        return { pass: true };
    }
    const actualString = createStr(value);
    const propNameString = createStr(propName);
    return buildFail(`expect(${ACTUAL}).toHaveProperty(${EXPECTED})\n\n    ${red(actualString)} did not contain property ${green(propNameString)}`);
}
export function toHaveLength(value, length) {
    if (value?.length === length)
        return { pass: true };
    const actualString = createStr(value.length);
    const lengthString = createStr(length);
    return buildFail(`expect(${ACTUAL}).toHaveLength(${EXPECTED})\n\n    expected array to have length ${green(lengthString)} but was ${red(actualString)}`);
}
export function toContain(value, item) {
    if (value && typeof value.includes === 'function' && value.includes(item)) {
        return { pass: true };
    }
    const actualString = createStr(value);
    const itemString = createStr(item);
    if (value && typeof value.includes === 'function') {
        return buildFail(`expect(${ACTUAL}).toContain(${EXPECTED})\n\n    ${red(actualString)} did not contain ${green(itemString)}`);
    }
    else {
        return buildFail(`expect(${ACTUAL}).toContain(${EXPECTED})\n\n    expected ${red(actualString)} to have an includes method but it is ${green(itemString)}`);
    }
}
export function toThrow(value, error) {
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
                return buildFail(`expect(${ACTUAL}).toThrow(${EXPECTED})\n\nexpected ${red(actualString)} to throw error matching ${green(errorString)} but it threw ${red(value.toString())}`);
            }
        }
        else if (error instanceof RegExp) {
            if (!value.message.match(error)) {
                return buildFail(`expect(${ACTUAL}).toThrow(${EXPECTED})\n\nexpected ${red(actualString)} to throw error matching ${green(errorString)} but it threw ${red(value.toString())}`);
            }
        }
        return { pass: true };
    }
    else {
        return buildFail(`expect(${ACTUAL}).toThrow(${EXPECTED})\n\nexpected ${red(actualString)} to throw but it did not`);
    }
}
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
export function toHaveBeenCalled(value) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenCalled');
    if (error)
        return buildFail(error);
    const actualString = createStr(value);
    if (calls && calls.length !== 0)
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toHaveBeenCalled()\n\n    ${red(actualString)} was not called`);
}
export function toHaveBeenCalledTimes(value, times) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenCalledTimes');
    if (error)
        return buildFail(error);
    if (!calls)
        return buildFail('Invalid internal state');
    if (calls && calls.length === times)
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toHaveBeenCalledTimes(${EXPECTED})\n\n    expected ${times} calls but was called: ${calls.length}`);
}
export function toHaveBeenCalledWith(value, ...args) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenCalledWith');
    if (error)
        return buildFail(error);
    const wasCalledWith = calls && calls.some((c) => equal(c.args, args));
    if (wasCalledWith)
        return { pass: true };
    const argsString = createStr(args);
    return buildFail(`expect(${ACTUAL}).toHaveBeenCalledWith(${EXPECTED})\n\n    function was not called with: ${green(argsString)}`);
}
export function toHaveBeenLastCalledWith(value, ...args) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenLastCalledWith');
    if (error)
        return buildFail(error);
    if (!calls || !calls.length) {
        return buildFail(`expect(${ACTUAL}).toHaveBeenLastCalledWith(...${EXPECTED})\n\n    expect last call args to be ${args} but was not called`);
    }
    const lastCall = calls[calls.length - 1];
    if (equal(lastCall.args, args))
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toHaveBeenLastCalledWith(...${EXPECTED})\n\n    expect last call args to be ${args} but was: ${lastCall.args}`);
}
export function toHaveBeenNthCalledWith(value, nth, ...args) {
    const { calls, error } = extractMockCalls(value, 'toHaveBeenNthCalledWith');
    if (error)
        return buildFail(error);
    const nthCall = calls && calls[nth - 1];
    if (nthCall) {
        if (equal(nthCall.args, args))
            return { pass: true };
        return buildFail(`expect(${ACTUAL}).toHaveBeenNthCalledWith(${EXPECTED})\n\n    expect ${nth}th call args to be ${args} but was: ${nthCall.args}`);
    }
    else {
        return buildFail(`expect(${ACTUAL}).toHaveBeenNthCalledWith(${EXPECTED})\n\n    ${nth}th call was not made.`);
    }
}
export function toHaveReturnedWith(value, result) {
    const { calls, error } = extractMockCalls(value, 'toHaveReturnedWith');
    if (error)
        return buildFail(error);
    const wasReturnedWith = calls && calls.some((c) => c.returns && equal(c.returned, result));
    if (wasReturnedWith)
        return { pass: true };
    return buildFail(`expect(${ACTUAL}).toHaveReturnedWith(${EXPECTED})\n\n    function did not return: ${result}`);
}
export function toHaveReturned(value) {
    const { calls, error } = extractMockCalls(value, 'toHaveReturned');
    if (error)
        return buildFail(error);
    if (calls && calls.some((c) => c.returns))
        return { pass: true };
    // TODO(allain): better messages
    return buildFail(`expected function to return but it never did`);
}
// TODO(allain): better messages
export function toHaveLastReturnedWith(value, expected) {
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
    if (equal(lastCall.returned, expected))
        return { pass: true };
    return buildFail(`expected last call to return ${expected} but returned: ${lastCall.returned}`);
}
export function toHaveReturnedTimes(value, times) {
    const { calls, error } = extractMockCalls(value, 'toHaveReturnedTimes');
    if (error)
        return buildFail(error);
    const returnCount = calls && calls.filter((c) => c.returns).length;
    if (returnCount !== times) {
        return buildFail(`expected ${times} returned times but returned ${returnCount} times`);
    }
    return { pass: true };
}
export function toHaveNthReturnedWith(value, nth, expected) {
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
    if (!equal(nthCall.returned, expected)) {
        return buildFail(`expected ${nth}th call to return ${expected} but returned: ${nthCall.returned}`);
    }
    return { pass: true };
}