import { any, arrayOf, boolean, deferred, dictionary, every, guard, instanceOf, isArray, isFunction, isNill, literal, literals, natural, number, object, Parser, partial, recursive, regex, shape, some, string, tuple, } from "./parsers/index.js";
import { parserName } from "./parsers/named.js";
import { unknown } from "./parsers/simple-parsers.js";
export { Parser as Validator };
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
                const parser = matches.some(...matchers.map((matcher) => 
                // deno-lint-ignore no-explicit-any
                matcher instanceof Parser ? matcher : literal(matcher)));
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
export const matches = Object.assign(function matchesFn(value) {
    return new MatchMore(value);
}, {
    array: isArray,
    arrayOf,
    some,
    tuple,
    regex,
    number,
    natural,
    isFunction,
    object,
    string,
    shape,
    partial,
    literal,
    every,
    guard,
    unknown,
    any,
    boolean,
    dictionary,
    literals,
    nill: isNill,
    instanceOf,
    Parse: Parser,
    parserName,
    recursive,
    deferred,
});
const array = isArray;
const nill = isNill;
const Parse = Parser;
const oneOf = some;
const anyOf = some;
const allOf = every;
export { allOf, any, anyOf, array, arrayOf, boolean, deferred, dictionary, every, guard, instanceOf, isFunction, literal, literals, natural, nill, number, object, oneOf, Parse, Parser, parserName, partial, recursive, regex, shape, some, string, tuple, unknown, };
export default matches;