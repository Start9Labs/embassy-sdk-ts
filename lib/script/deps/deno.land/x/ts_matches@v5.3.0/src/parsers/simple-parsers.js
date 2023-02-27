"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regex = exports.instanceOf = exports.string = exports.isArray = exports.object = exports.boolean = exports.isFunction = exports.natural = exports.isNill = exports.number = exports.unknown = exports.any = exports.guard = void 0;
const index_js_1 = require("./index.js");
const any_parser_js_1 = require("./any-parser.js");
const array_parser_js_1 = require("./array-parser.js");
const bool_parser_js_1 = require("./bool-parser.js");
const function_parser_js_1 = require("./function-parser.js");
const nill_parser_js_1 = require("./nill-parser.js");
const number_parser_js_1 = require("./number-parser.js");
const object_parser_js_1 = require("./object-parser.js");
const string_parser_js_1 = require("./string-parser.js");
const unknown_parser_js_1 = require("./unknown-parser.js");
/**
 * Create a custom type guard
 * @param test A function that will determine runtime if the value matches
 * @param testName A name for that function, useful when it fails
 */
function guard(test, testName) {
    return index_js_1.Parser.isA(test, testName || test.name);
}
exports.guard = guard;
exports.any = new index_js_1.Parser(new any_parser_js_1.AnyParser());
exports.unknown = new index_js_1.Parser(new unknown_parser_js_1.UnknownParser());
exports.number = new index_js_1.Parser(new number_parser_js_1.NumberParser());
exports.isNill = new index_js_1.Parser(new nill_parser_js_1.NilParser());
exports.natural = exports.number.refine((x) => x >= 0 && x === Math.floor(x));
exports.isFunction = new index_js_1.Parser(new function_parser_js_1.FunctionParser());
exports.boolean = new index_js_1.Parser(new bool_parser_js_1.BoolParser());
exports.object = new index_js_1.Parser(new object_parser_js_1.ObjectParser());
exports.isArray = new index_js_1.Parser(new array_parser_js_1.ArrayParser());
exports.string = new index_js_1.Parser(new string_parser_js_1.StringParser());
const instanceOf = (classCreator) => guard((x) => x instanceof classCreator, `is${classCreator.name}`);
exports.instanceOf = instanceOf;
const regex = (tester) => exports.string.refine(function (x) {
    return tester.test(x);
}, tester.toString());
exports.regex = regex;