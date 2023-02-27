import { Parser } from "./index.js";
import { IParser, OnParse, ParserInto } from "./interfaces.js";
export type TupleParserInto<T> = T extends [infer A] | readonly [infer A] ? [ParserInto<A>] : T extends [infer A, ...infer B] | readonly [infer A, ...infer B] ? [ParserInto<A>, ...TupleParserInto<B>] : never;
export declare class TupleParser<A extends Parser<unknown, unknown>[]> implements IParser<unknown, TupleParserInto<A>> {
    readonly parsers: A;
    readonly lengthMatcher: Parser<unknown, number>;
    readonly description: {
        readonly name: "Tuple";
        readonly children: A;
        readonly extras: readonly [];
    };
    constructor(parsers: A, lengthMatcher?: Parser<unknown, number>, description?: {
        readonly name: "Tuple";
        readonly children: A;
        readonly extras: readonly [];
    });
    parse<C, D>(input: unknown, onParse: OnParse<unknown, TupleParserInto<A>, C, D>): C | D;
}
export declare function tuple<A extends Parser<unknown, unknown>[]>(...parsers: A): Parser<unknown, TupleParserInto<A>>;
