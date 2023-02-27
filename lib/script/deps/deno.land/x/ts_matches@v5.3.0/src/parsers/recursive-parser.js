"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recursive = exports.RecursiveParser = void 0;
const parser_js_1 = require("./parser.js");
const simple_parsers_js_1 = require("./simple-parsers.js");
/**
 * This parser is used when trying to create parsers that
 * user their own definitions in their types, like interface Tree<Leaf> {
 *   [key: string]: Tree<Leaf> | Leaf;
 * }
 */
class RecursiveParser {
    static create(fn) {
        const parser = new RecursiveParser(fn);
        parser.parser = fn(new parser_js_1.Parser(parser));
        return parser;
    }
    constructor(recursive, description = {
        name: "Recursive",
        children: [],
        extras: [recursive],
    }) {
        Object.defineProperty(this, "recursive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: recursive
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: description
        });
        Object.defineProperty(this, "parser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    parse(a, onParse) {
        if (!this.parser) {
            return onParse.invalid({
                value: "Recursive Invalid State",
                keys: [],
                parser: this,
            });
        }
        return this.parser.parse(a, onParse);
    }
}
exports.RecursiveParser = RecursiveParser;
/**
 * Must pass the shape that we expect since typescript as of this point
 * can't infer with recursive functions like this.
 * @param fn This should be a function that takes a parser, basically the self in a type recursion, and
 * return a parser that is the combination of the recursion.
 * @returns
 */
function recursive(fn) {
    const value = fn(simple_parsers_js_1.any);
    const created = RecursiveParser
        .create(fn);
    return new parser_js_1.Parser(created);
}
exports.recursive = recursive;