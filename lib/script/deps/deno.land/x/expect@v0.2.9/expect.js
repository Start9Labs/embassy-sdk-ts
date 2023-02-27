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
exports.addMatchers = exports.expect = void 0;
const builtInMatchers = __importStar(require("./matchers.js"));
const asserts_js_1 = require("../../std@0.97.0/testing/asserts.js");
const matchers = {
    ...builtInMatchers,
};
function expect(value) {
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
                    throw new asserts_js_1.AssertionError("expected value must be a Promise");
                }
                isPromised = true;
                return self;
            }
            if (name === "rejects") {
                if (!(value instanceof Promise)) {
                    throw new asserts_js_1.AssertionError("expected value must be a Promise");
                }
                value = value.then((value) => {
                    throw new asserts_js_1.AssertionError(`Promise did not reject. resolved to ${value}`);
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
                            throw new asserts_js_1.AssertionError("should not " + result.message);
                        }
                    }
                    else {
                        let result = matcher(value, ...args);
                        if (!result.pass) {
                            throw new asserts_js_1.AssertionError(result.message || "Unknown error");
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
exports.expect = expect;
function addMatchers(newMatchers) {
    Object.assign(matchers, newMatchers);
}
exports.addMatchers = addMatchers;