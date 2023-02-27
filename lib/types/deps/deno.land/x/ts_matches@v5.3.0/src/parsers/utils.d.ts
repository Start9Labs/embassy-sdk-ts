import { OnParse } from "./interfaces.js";
export declare const isObject: (x: unknown) => x is object;
export declare const isFunctionTest: (x: unknown) => x is Function;
export declare const isNumber: (x: unknown) => x is number;
export declare const isString: (x: unknown) => x is string;
export declare const empty: any[];
export declare const booleanOnParse: OnParse<unknown, unknown, true, false>;
export type OneOf<T> = T extends [infer A] | readonly [infer A] ? A : T extends [infer A, ...infer B] | readonly [infer A, ...infer B] ? A | OneOf<B> : never;
