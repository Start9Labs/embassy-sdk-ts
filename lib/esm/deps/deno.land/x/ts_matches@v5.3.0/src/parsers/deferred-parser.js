import { Parser } from "./parser.js";
/**
 * This is needed when the typescript has a recursive, mutual types
 * type Things = string | [OtherThings]
 * type OtherThings = {type: 'other', value:Things }
 */
export class DeferredParser {
    static create() {
        return new DeferredParser();
    }
    constructor(description = {
        name: "Deferred",
        children: [],
        extras: [],
    }) {
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
    setParser(parser) {
        this.parser = new Parser(parser);
        return this;
    }
    parse(a, onParse) {
        if (!this.parser) {
            return onParse.invalid({
                value: "Not Set Up",
                keys: [],
                parser: this,
            });
        }
        return this.parser.parse(a, onParse);
    }
}
/**
 * Must pass the shape that we expect since typescript as of this point
 * can't infer with recursive like structures like this.
 * @returns [Parser, setParser] Use the setParser to set the parser later
 */
export function deferred() {
    const deferred = DeferredParser.create();
    function setParser(parser) {
        deferred.setParser(parser);
    }
    return [new Parser(deferred), setParser];
}