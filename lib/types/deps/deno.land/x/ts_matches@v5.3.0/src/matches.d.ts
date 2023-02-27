import { any, arrayOf, boolean, deferred, dictionary, every, guard, instanceOf, isFunction, literal, literals, natural, number, object, Parser, partial, recursive, regex, shape, some, string, tuple, ValidatorError } from "./parsers/index.js";
import { parserName } from "./parsers/named.js";
import { unknown } from "./parsers/simple-parsers.js";
export type { IParser, ParserNames } from "./parsers/interfaces.js";
export { Parser as Validator };
export type { ValidatorError };
export type Fn<A, B> = (a: A) => B;
export type ValueOrFunction<In, Out> = ((a: In) => Out) | Out;
export type ParserOrLiteral<A> = ExtendsSimple<A> | Parser<unknown, A>;
export type Primative = string | number | boolean | null | undefined;
export type ExtendsSimple<A> = A extends string | number | boolean | null | undefined ? A : never;
export type WhenArgsExclude<A> = A extends [ValueOrFunction<infer T, infer V>] ? (T extends unknown ? any : T) : A extends [...ParserOrLiteral<infer In>[], ValueOrFunction<infer In, infer Out>] ? In : never;
type _<A> = A;
type ExcludePrimative<A, B> = Exclude<A, Exclude<B, Exclude<A, B>>>;
export type WhenArgs<In, Out> = [ValueOrFunction<In, Out>] | [...ParserOrLiteral<In>[], ValueOrFunction<In, Out>];
interface _WhenFn<In, Out> {
    <A, B>(...args: WhenArgs<A, B>): _<ChainMatches<ExcludePrimative<In, A>, Out | B>>;
}
export type WhenFn<In, Out> = [In] extends [never] ? never : _WhenFn<In, Out>;
export type WhenArgsOutput<A> = A extends [ValueOrFunction<infer T, infer V>] ? V : A extends [...ParserOrLiteral<infer In>[], ValueOrFunction<infer In, infer Out>] ? Out : never;
export type UnwrapFn<In, OutcomeType> = [In] extends [never] ? () => OutcomeType : never;
export interface ChainMatches<In, OutcomeType = never> {
    when: WhenFn<In, OutcomeType>;
    defaultTo<B>(value: B): B | OutcomeType;
    defaultToLazy<B>(getValue: () => B): B | OutcomeType;
    unwrap: UnwrapFn<In, OutcomeType>;
}
declare class MatchMore<Ins, OutcomeType> implements ChainMatches<Ins, OutcomeType> {
    private a;
    constructor(a: unknown);
    when: WhenFn<Ins, OutcomeType>;
    defaultTo<B>(value: B): B;
    defaultToLazy<B>(getValue: () => B): B;
    unwrap: UnwrapFn<Ins, OutcomeType>;
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
export declare const matches: (<Ins extends unknown>(value: Ins) => MatchMore<Ins, never>) & {
    array: Parser<unknown, unknown[]>;
    arrayOf: typeof arrayOf;
    some: typeof some;
    tuple: typeof tuple;
    regex: (tester: RegExp) => Parser<unknown, string>;
    number: Parser<unknown, number>;
    natural: Parser<unknown, number>;
    isFunction: Parser<unknown, Function>;
    object: Parser<unknown, object>;
    string: Parser<unknown, string>;
    shape: typeof shape;
    partial: <A extends {}>(testShape: { [key in keyof A]: Parser<unknown, A[key]>; }) => Parser<unknown, Partial<A>>;
    literal: typeof literal;
    every: typeof every;
    guard: typeof guard;
    unknown: Parser<unknown, unknown>;
    any: Parser<unknown, any>;
    boolean: Parser<unknown, boolean>;
    dictionary: <ParserSets extends [Parser<unknown, unknown>, Parser<unknown, unknown>][]>(...parsers: ParserSets) => Parser<unknown, import("./parsers/dictionary-parser.js").DictionaryShaped<[...ParserSets]>>;
    literals: typeof literals;
    nill: Parser<unknown, null | undefined>;
    instanceOf: <C>(classCreator: new (...args: any[]) => C) => Parser<unknown, C>;
    Parse: typeof Parser;
    parserName: typeof parserName;
    recursive: typeof recursive;
    deferred: typeof deferred;
};
declare const array: Parser<unknown, unknown[]>;
declare const nill: Parser<unknown, null | undefined>;
declare const Parse: typeof Parser;
declare const oneOf: typeof some;
declare const anyOf: typeof some;
declare const allOf: typeof every;
export { allOf, any, anyOf, array, arrayOf, boolean, deferred, dictionary, every, guard, instanceOf, isFunction, literal, literals, natural, nill, number, object, oneOf, Parse, Parser, parserName, partial, recursive, regex, shape, some, string, tuple, unknown, };
export default matches;
