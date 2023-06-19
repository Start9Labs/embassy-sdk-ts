import { Parser } from "./index.js";
import { _, IParser, OnParse } from "./interfaces.js";
export type DictionaryTuple<A> = A extends [
    Parser<unknown, infer Keys>,
    Parser<unknown, infer Values>
] ? Keys extends string | number ? {
    [key in Keys]: Values;
} : never : never;
export type DictionaryShaped<T> = T extends [] | readonly [] ? IParser<unknown, any> : T extends [infer A] | readonly [infer A] ? DictionaryTuple<A> : T extends [infer A, ...infer B] | readonly [infer A, ...infer B] ? DictionaryTuple<A> & DictionaryShaped<B> : never;
export declare class DictionaryParser<A extends object | {}, Parsers extends Array<[Parser<unknown, unknown>, Parser<unknown, unknown>]>> implements IParser<A, DictionaryShaped<Parsers>> {
    readonly parsers: Parsers;
    readonly description: {
        readonly name: "Dictionary";
        readonly children: IParser<unknown, unknown>[];
        readonly extras: readonly [];
    };
    constructor(parsers: Parsers, description?: {
        readonly name: "Dictionary";
        readonly children: IParser<unknown, unknown>[];
        readonly extras: readonly [];
    });
    parse<C, D>(a: A, onParse: OnParse<A, DictionaryShaped<Parsers>, C, D>): C | D;
}
export declare const dictionary: <ParserSets extends [Parser<unknown, unknown>, Parser<unknown, unknown>][]>(...parsers: ParserSets) => Parser<unknown, DictionaryShaped<[...ParserSets]>>;