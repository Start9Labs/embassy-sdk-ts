import { Parser } from "./index.js";
/**
 * Create a custom type guard
 * @param test A function that will determine runtime if the value matches
 * @param testName A name for that function, useful when it fails
 */
export declare function guard<A, B extends A>(test: (value: A) => value is B, testName?: string): Parser<A, B>;
export declare const any: Parser<unknown, any>;
export declare const unknown: Parser<unknown, unknown>;
export declare const number: Parser<unknown, number>;
export declare const isNill: Parser<unknown, null | undefined>;
export declare const natural: Parser<unknown, number>;
export declare const isFunction: Parser<unknown, Function>;
export declare const boolean: Parser<unknown, boolean>;
export declare const object: Parser<unknown, object>;
export declare const isArray: Parser<unknown, unknown[]>;
export declare const string: Parser<unknown, string>;
export declare const instanceOf: <C>(classCreator: new (...args: any[]) => C) => Parser<unknown, C>;
export declare const regex: (tester: RegExp) => Parser<unknown, string>;
