"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const index_js_1 = require("./index.js");
const utils_js_1 = require("../utils.js");
const any_parser_js_1 = require("./any-parser.js");
const array_parser_js_1 = require("./array-parser.js");
const bool_parser_js_1 = require("./bool-parser.js");
const concat_parser_js_1 = require("./concat-parser.js");
const default_parser_js_1 = require("./default-parser.js");
const function_parser_js_1 = require("./function-parser.js");
const guard_parser_js_1 = require("./guard-parser.js");
const mapped_parser_js_1 = require("./mapped-parser.js");
const maybe_parser_js_1 = require("./maybe-parser.js");
const named_js_1 = require("./named.js");
const nill_parser_js_1 = require("./nill-parser.js");
const number_parser_js_1 = require("./number-parser.js");
const object_parser_js_1 = require("./object-parser.js");
const or_parser_js_1 = require("./or-parser.js");
const shape_parser_js_1 = require("./shape-parser.js");
const string_parser_js_1 = require("./string-parser.js");
const utils_js_2 = require("./utils.js");
function unwrapParser(a) {
    if (a instanceof Parser)
        return unwrapParser(a.parser);
    return a;
}
const enumParsed = {
    parsed(value) {
        return { value };
    },
    invalid(error) {
        return { error };
    },
};
/**
 * A Parser is usually a function that takes a value and returns a Parsed value.
 * For this class we have that as our main reason but we want to be able to have other methods
 * including testing and showing text representations.
 *
 * The main function unsafeCast which will take in a value A (usually unknown) and will always return a B. If it cannot
 * it will throw an error.
 *
 * The parse function is the lower level function that will take in a value and a dictionary of what to do with success and failure.
 */
class Parser {
    constructor(parser, description = {
        name: "Wrapper",
        children: [parser],
        extras: [],
    }) {
        Object.defineProperty(this, "parser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: parser
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: description
        });
        /// This is a hack to get the type of what the parser is going to return.
        // deno-lint-ignore no-explicit-any
        Object.defineProperty(this, "_TYPE", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        /**
         * Use this as a guard clause, useful for escaping during the error cases.
         * https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
         * @param value
         * @returns
         */
        Object.defineProperty(this, "test", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (value) => {
                return this.parse(value, utils_js_2.booleanOnParse);
            }
        });
    }
    /**
     * Use this when you want to decide what happens on the succes and failure cases of parsing
     * @param a
     * @param onParse
     * @returns
     */
    parse(a, onParse) {
        return this.parser.parse(a, onParse);
    }
    /**
     * This is a constructor helper that can use a predicate tester in the form of a guard function,
     * and will return a parser that will only parse if the predicate returns true.
     * https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
     * @param checkIsA
     * @param name
     * @returns
     */
    static isA(checkIsA, name) {
        return new Parser(new index_js_1.IsAParser(checkIsA, name));
    }
    /**
     * Trying to convert the parser into a string representation
     * @param parserComingIn
     * @returns
     */
    static parserAsString(parserComingIn) {
        const parser = unwrapParser(parserComingIn);
        const { description: { name, extras, children }, } = parser;
        if (parser instanceof shape_parser_js_1.ShapeParser) {
            return `${name}<{${parser.description.children
                .map((subParser, i) => `${String(parser.description.extras[i]) || "?"}:${Parser.parserAsString(subParser)}`)
                .join(",")}}>`;
        }
        if (parser instanceof or_parser_js_1.OrParsers) {
            const parent = unwrapParser(parser.parent);
            const parentString = Parser.parserAsString(parent);
            if (parent instanceof or_parser_js_1.OrParsers)
                return parentString;
            return `${name}<${parentString},...>`;
        }
        if (parser instanceof guard_parser_js_1.GuardParser) {
            return String(extras[0] || name);
        }
        if (parser instanceof string_parser_js_1.StringParser ||
            parser instanceof object_parser_js_1.ObjectParser ||
            parser instanceof number_parser_js_1.NumberParser ||
            parser instanceof bool_parser_js_1.BoolParser ||
            parser instanceof any_parser_js_1.AnyParser) {
            return name.toLowerCase();
        }
        if (parser instanceof function_parser_js_1.FunctionParser) {
            return name;
        }
        if (parser instanceof nill_parser_js_1.NilParser) {
            return "null";
        }
        if (parser instanceof array_parser_js_1.ArrayParser) {
            return "Array<unknown>";
        }
        const specifiers = [
            ...extras.map(utils_js_1.saferStringify),
            ...children.map(Parser.parserAsString),
        ];
        const specifiersString = `<${specifiers.join(",")}>`;
        return `${name}${specifiersString}`;
    }
    /**
     * This is the most useful parser, it assumes the happy path and will throw an error if it fails.
     * @param value
     * @returns
     */
    unsafeCast(value) {
        const state = this.enumParsed(value);
        if ("value" in state)
            return state.value;
        const { error } = state;
        throw new TypeError(`Failed type: ${Parser.validatorErrorAsString(error)} given input ${(0, utils_js_1.saferStringify)(value)}`);
    }
    /**
     * This is the like the unsafe parser, it assumes the happy path and will throw and return a failed promise during failure.
     * @param value
     * @returns
     */
    castPromise(value) {
        const state = this.enumParsed(value);
        if ("value" in state)
            return Promise.resolve(state.value);
        const { error } = state;
        return Promise.reject(new TypeError(`Failed type: ${Parser.validatorErrorAsString(error)} given input ${(0, utils_js_1.saferStringify)(value)}`));
    }
    /**
     * When we want to get the error message from the input, to know what is wrong
     * @param input
     * @returns Null if there is no error
     */
    errorMessage(input) {
        const parsed = this.parse(input, enumParsed);
        if ("value" in parsed)
            return;
        return Parser.validatorErrorAsString(parsed.error);
    }
    /**
     * Use this that we want to do transformations after the value is valid and parsed.
     * A use case would be parsing a string, making sure it can be parsed to a number, and then convert to a number
     * @param fn
     * @param mappingName
     * @returns
     */
    map(fn, mappingName) {
        return new Parser(new mapped_parser_js_1.MappedAParser(this, fn, mappingName));
    }
    /**
     * Use this when you want to combine two parsers into one. This will make sure that both parsers will run against the same value.
     * @param otherParser
     * @returns
     */
    concat(otherParser) {
        // deno-lint-ignore no-explicit-any
        return new Parser(concat_parser_js_1.ConcatParsers.of(this, new Parser(otherParser)));
    }
    /**
     * Use this to combine parsers into one. This will make sure that one or the other parsers will run against the value.
     * @param otherParser
     * @returns
     */
    orParser(otherParser) {
        return new Parser(new or_parser_js_1.OrParsers(this, new Parser(otherParser)));
    }
    /**
     * When we want to make sure that we handle the null later on in a monoid fashion,
     * and this ensures we deal with the value
     * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
     */
    optional(_name) {
        return new Parser(new maybe_parser_js_1.MaybeParser(this));
    }
    /**
     * There are times that we would like to bring in a value that we know as null or undefined
     * and want it to go to a default value
     */
    defaultTo(defaultValue) {
        return new Parser(new default_parser_js_1.DefaultParser(new Parser(new maybe_parser_js_1.MaybeParser(this)), defaultValue));
    }
    /**
     * We want to test value with a test eg isEven
     */
    validate(isValid, otherName) {
        return new Parser(concat_parser_js_1.ConcatParsers.of(this, new Parser(new index_js_1.IsAParser(isValid, otherName))));
    }
    /**
     * We want to refine to a new type given an original type, like isEven, or casting to a more
     * specific type
     */
    refine(refinementTest, otherName = refinementTest.name) {
        return new Parser(concat_parser_js_1.ConcatParsers.of(this, new Parser(new index_js_1.IsAParser(refinementTest, otherName))));
    }
    /**
     * Use this when we want to give the parser a name, and we want to be able to use the name in the error messages.
     * @param nameString
     * @returns
     */
    name(nameString) {
        return (0, named_js_1.parserName)(nameString, this);
    }
    /**
     * This is another type of parsing that will return a value that is a discriminated union of the success and failure cases.
     * https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions
     * @param value
     * @returns
     */
    enumParsed(value) {
        // deno-lint-ignore no-explicit-any
        return this.parse(value, enumParsed);
    }
    /**
     * Return the unwrapped parser/ IParser
     * @returns
     */
    unwrappedParser() {
        // deno-lint-ignore no-this-alias no-explicit-any
        let answer = this;
        while (true) {
            const next = answer.parser;
            if (next instanceof Parser) {
                answer = next;
            }
            else {
                return next;
            }
        }
    }
}
exports.Parser = Parser;
/**
 * This is the line of code that could be over written if
 * One would like to have a custom error as any shape
 */
Object.defineProperty(Parser, "validatorErrorAsString", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (error) => {
        const { parser, value, keys } = error;
        const keysString = !keys.length ? "" : keys
            .map((x) => `[${x}]`)
            .reverse()
            .join("");
        return `${keysString}${Parser.parserAsString(parser)}(${(0, utils_js_1.saferStringify)(value)})`;
    }
});