"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknown = exports.tuple = exports.string = exports.some = exports.shape = exports.regex = exports.recursive = exports.partial = exports.parserName = exports.Parser = exports.Parse = exports.oneOf = exports.object = exports.number = exports.nill = exports.natural = exports.literals = exports.literal = exports.isFunction = exports.instanceOf = exports.guard = exports.every = exports.dictionary = exports.deferred = exports.boolean = exports.arrayOf = exports.array = exports.anyOf = exports.any = exports.allOf = exports.matches = exports.Validator = void 0;
const index_js_1 = require("./parsers/index.js");
Object.defineProperty(exports, "any", { enumerable: true, get: function () { return index_js_1.any; } });
Object.defineProperty(exports, "arrayOf", { enumerable: true, get: function () { return index_js_1.arrayOf; } });
Object.defineProperty(exports, "boolean", { enumerable: true, get: function () { return index_js_1.boolean; } });
Object.defineProperty(exports, "deferred", { enumerable: true, get: function () { return index_js_1.deferred; } });
Object.defineProperty(exports, "dictionary", { enumerable: true, get: function () { return index_js_1.dictionary; } });
Object.defineProperty(exports, "every", { enumerable: true, get: function () { return index_js_1.every; } });
Object.defineProperty(exports, "guard", { enumerable: true, get: function () { return index_js_1.guard; } });
Object.defineProperty(exports, "instanceOf", { enumerable: true, get: function () { return index_js_1.instanceOf; } });
Object.defineProperty(exports, "isFunction", { enumerable: true, get: function () { return index_js_1.isFunction; } });
Object.defineProperty(exports, "literal", { enumerable: true, get: function () { return index_js_1.literal; } });
Object.defineProperty(exports, "literals", { enumerable: true, get: function () { return index_js_1.literals; } });
Object.defineProperty(exports, "natural", { enumerable: true, get: function () { return index_js_1.natural; } });
Object.defineProperty(exports, "number", { enumerable: true, get: function () { return index_js_1.number; } });
Object.defineProperty(exports, "object", { enumerable: true, get: function () { return index_js_1.object; } });
Object.defineProperty(exports, "Validator", { enumerable: true, get: function () { return index_js_1.Parser; } });
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return index_js_1.Parser; } });
Object.defineProperty(exports, "partial", { enumerable: true, get: function () { return index_js_1.partial; } });
Object.defineProperty(exports, "recursive", { enumerable: true, get: function () { return index_js_1.recursive; } });
Object.defineProperty(exports, "regex", { enumerable: true, get: function () { return index_js_1.regex; } });
Object.defineProperty(exports, "shape", { enumerable: true, get: function () { return index_js_1.shape; } });
Object.defineProperty(exports, "some", { enumerable: true, get: function () { return index_js_1.some; } });
Object.defineProperty(exports, "string", { enumerable: true, get: function () { return index_js_1.string; } });
Object.defineProperty(exports, "tuple", { enumerable: true, get: function () { return index_js_1.tuple; } });
const named_js_1 = require("./parsers/named.js");
Object.defineProperty(exports, "parserName", { enumerable: true, get: function () { return named_js_1.parserName; } });
const simple_parsers_js_1 = require("./parsers/simple-parsers.js");
Object.defineProperty(exports, "unknown", { enumerable: true, get: function () { return simple_parsers_js_1.unknown; } });
class Matched {
    constructor(value) {
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
        });
        Object.defineProperty(this, "when", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ((..._args) => {
                // deno-lint-ignore no-explicit-any
                return this;
                // deno-lint-ignore no-explicit-any
            })
        });
        Object.defineProperty(this, "unwrap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (() => {
                return this.value;
                // deno-lint-ignore no-explicit-any
            })
        });
    }
    defaultTo(_defaultValue) {
        return this.value;
    }
    defaultToLazy(_getValue) {
        return this.value;
    }
}
class MatchMore {
    constructor(a) {
        Object.defineProperty(this, "a", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: a
        });
        Object.defineProperty(this, "when", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ((...args) => {
                const [outcome, ...matchers] = args.reverse();
                // deno-lint-ignore no-this-alias
                const me = this;
                const parser = exports.matches.some(...matchers.map((matcher) => 
                // deno-lint-ignore no-explicit-any
                matcher instanceof index_js_1.Parser ? matcher : (0, index_js_1.literal)(matcher)));
                const result = parser.enumParsed(this.a);
                if ("error" in result) {
                    // deno-lint-ignore no-explicit-any
                    return me;
                }
                const { value } = result;
                if (outcome instanceof Function) {
                    // deno-lint-ignore no-explicit-any
                    return new Matched(outcome(value));
                }
                // deno-lint-ignore no-explicit-any
                return new Matched(outcome);
                // deno-lint-ignore no-explicit-any
            })
        });
        Object.defineProperty(this, "unwrap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (() => {
                throw new Error("Expecting that value is matched");
                // deno-lint-ignore no-explicit-any
            })
        });
    }
    defaultTo(value) {
        return value;
    }
    defaultToLazy(getValue) {
        return getValue();
    }
}
/**
 * Want to be able to bring in the declarative nature that a functional programming
 * language feature of the pattern matching and the switch statement. With the destructors
 * the only thing left was to find the correct structure then move move forward.
 * Using a structure in chainable fashion allows for a syntax that works with typescript
 * while looking similar to matches statements in other languages
 *
 * Use: matches('a value').when(matches.isNumber, (aNumber) => aNumber + 4).defaultTo('fallback value')
 */
exports.matches = Object.assign(function matchesFn(value) {
    return new MatchMore(value);
}, {
    array: index_js_1.isArray,
    arrayOf: index_js_1.arrayOf,
    some: index_js_1.some,
    tuple: index_js_1.tuple,
    regex: index_js_1.regex,
    number: index_js_1.number,
    natural: index_js_1.natural,
    isFunction: index_js_1.isFunction,
    object: index_js_1.object,
    string: index_js_1.string,
    shape: index_js_1.shape,
    partial: index_js_1.partial,
    literal: index_js_1.literal,
    every: index_js_1.every,
    guard: index_js_1.guard,
    unknown: simple_parsers_js_1.unknown,
    any: index_js_1.any,
    boolean: index_js_1.boolean,
    dictionary: index_js_1.dictionary,
    literals: index_js_1.literals,
    nill: index_js_1.isNill,
    instanceOf: index_js_1.instanceOf,
    Parse: index_js_1.Parser,
    parserName: named_js_1.parserName,
    recursive: index_js_1.recursive,
    deferred: index_js_1.deferred,
});
const array = index_js_1.isArray;
exports.array = array;
const nill = index_js_1.isNill;
exports.nill = nill;
const Parse = index_js_1.Parser;
exports.Parse = Parse;
const oneOf = index_js_1.some;
exports.oneOf = oneOf;
const anyOf = index_js_1.some;
exports.anyOf = anyOf;
const allOf = index_js_1.every;
exports.allOf = allOf;
exports.default = exports.matches;