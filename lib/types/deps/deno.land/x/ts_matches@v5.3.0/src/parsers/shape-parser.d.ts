import { Parser } from "./index.js";
import { IParser, OnParse } from "./interfaces.js";
type _<T> = T;
export type MergeAll<T> = T extends ReadonlyArray<infer U> ? ReadonlyArray<MergeAll<U>> : T extends object ? T extends null | undefined | never ? T : _<{
    [k in keyof T]: MergeAll<T[k]>;
}> : T;
/**
 * Given an object, we want to make sure the key exists and that the value on
 * the key matches the parser
 */
export declare class ShapeParser<A extends unknown, Key extends string | number | symbol, B> implements IParser<A, B> {
    readonly parserMap: {
        [key in keyof B]: Parser<unknown, B[key]>;
    };
    readonly isPartial: boolean;
    readonly parserKeys: (string & keyof B)[];
    readonly description: {
        readonly name: "Partial" | "Shape";
        readonly children: { [key in keyof B]: Parser<unknown, B[key]>; }[string & keyof B][];
        readonly extras: (string & keyof B)[];
    };
    constructor(parserMap: {
        [key in keyof B]: Parser<unknown, B[key]>;
    }, isPartial: boolean, parserKeys?: (string & keyof B)[], description?: {
        readonly name: "Partial" | "Shape";
        readonly children: { [key in keyof B]: Parser<unknown, B[key]>; }[string & keyof B][];
        readonly extras: (string & keyof B)[];
    });
    parse<C, D>(a: A, onParse: OnParse<A, B, C, D>): C | D;
}
export declare const isPartial: <A extends {}>(testShape: { [key in keyof A]: Parser<unknown, A[key]>; }) => Parser<unknown, Partial<A>>;
/**
 * Good for duck typing an object, with optional values
 * @param testShape Shape of validators, to ensure we match the shape
 */
export declare const partial: <A extends {}>(testShape: { [key in keyof A]: Parser<unknown, A[key]>; }) => Parser<unknown, Partial<A>>;
/**
 * Good for duck typing an object
 * @param testShape Shape of validators, to ensure we match the shape
 */
export declare const isShape: <A extends {}>(testShape: { [key in keyof A]: Parser<unknown, A[key]>; }) => Parser<unknown, A>;
export declare function shape<A extends {}, Overwrites extends keyof A>(testShape: {
    [key in keyof A]: Parser<unknown, A[key]>;
}, optionals: Overwrites[]): Parser<unknown, MergeAll<{
    [K in keyof Omit<A, Overwrites>]: A[K];
} & {
    [K in keyof Pick<A, Overwrites>]?: A[K];
}>>;
export declare function shape<A extends {}, Overwrites extends keyof A, Defaults extends {
    [K in Overwrites]?: A[K];
}>(testShape: {
    [key in keyof A]: Parser<unknown, A[key]>;
}, optionals: Overwrites[], defaults: Defaults): Parser<unknown, MergeAll<{
    [K in keyof Omit<A, Overwrites>]: A[K];
} & {
    [K in keyof Omit<Pick<A, Overwrites>, keyof Defaults>]?: A[K];
} & {
    [K in keyof Pick<Pick<A, Overwrites>, keyof Defaults & Overwrites>]: A[K];
}>>;
export declare function shape<A extends {}>(testShape: {
    [key in keyof A]: Parser<unknown, A[key]>;
}): Parser<unknown, A>;
export {};