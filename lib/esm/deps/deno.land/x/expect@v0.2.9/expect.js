import * as builtInMatchers from "./matchers.js";
import { AssertionError } from "../../std@0.97.0/testing/asserts.js";
const matchers = {
    ...builtInMatchers,
};
export function expect(value) {
    let isNot = false;
    let isPromised = false;
    const self = new Proxy({}, {
        get(_, name) {
            if (name === "not") {
                isNot = !isNot;
                return self;
            }
            if (name === "resolves") {
                if (!(value instanceof Promise)) {
                    throw new AssertionError("expected value must be a Promise");
                }
                isPromised = true;
                return self;
            }
            if (name === "rejects") {
                if (!(value instanceof Promise)) {
                    throw new AssertionError("expected value must be a Promise");
                }
                value = value.then((value) => {
                    throw new AssertionError(`Promise did not reject. resolved to ${value}`);
                }, (err) => err);
                isPromised = true;
                return self;
            }
            const matcher = matchers[name];
            if (!matcher) {
                throw new TypeError(typeof name === "string"
                    ? `matcher not found: ${name}`
                    : "matcher not found");
            }
            return (...args) => {
                function applyMatcher(value, args) {
                    if (isNot) {
                        let result = matcher(value, ...args);
                        if (result.pass) {
                            throw new AssertionError("should not " + result.message);
                        }
                    }
                    else {
                        let result = matcher(value, ...args);
                        if (!result.pass) {
                            throw new AssertionError(result.message || "Unknown error");
                        }
                    }
                }
                return isPromised
                    ? value.then((value) => applyMatcher(value, args))
                    : applyMatcher(value, args);
            };
        },
    });
    return self;
}
export function addMatchers(newMatchers) {
    Object.assign(matchers, newMatchers);
}