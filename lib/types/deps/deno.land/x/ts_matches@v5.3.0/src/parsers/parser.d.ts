import { IParser, ISimpleParsedError, NonNull, OnParse, Optional } from "./interfaces.js";
export type EnumType<A> = {
    error: ISimpleParsedError;
} | {
    value: A;
};
/**
 * A Parser is usually a function that takes a value and returns a Parsed value.
 * For this class we have that as our main reason but we want to be able to have other methods
 * including testing and showing text representations.
 *
 * The main function unsafeCast which will take in a value A (usually unknown) and will always return a B. If it cannot
 * it will throw an error.
 *
 * The parse function is the lower level function that will take in a value and a dictionary of what to do with success and failure.
 */
export declare class Parser<A, B> implements IParser<A, B> {
    readonly parser: IParser<A, B>;
    readonly description: {
        readonly name: "Wrapper";
        readonly children: readonly [IParser<A, B>];
        readonly extras: readonly [];
    };
    readonly _TYPE: B;
    constructor(parser: IParser<A, B>, description?: {
        readonly name: "Wrapper";
        readonly children: readonly [IParser<A, B>];
        readonly extras: readonly [];
    });
    /**
     * Use this when you want to decide what happens on the succes and failure cases of parsing
     * @param a
     * @param onParse
     * @returns
     */
    parse<C, D>(a: A, onParse: OnParse<A, B, C, D>): C | D;
    /**
     * This is a constructor helper that can use a predicate tester in the form of a guard function,
     * and will return a parser that will only parse if the predicate returns true.
     * https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
     * @param checkIsA
     * @param name
     * @returns
     */
    static isA<A, B extends A>(checkIsA: (value: A) => value is B, name: string): Parser<A, B>;
    /**
     * This is the line of code that could be over written if
     * One would like to have a custom error as any shape
     */
    static validatorErrorAsString: <A_1, B_1>(error: ISimpleParsedError) => string;
    /**
     * Trying to convert the parser into a string representation
     * @param parserComingIn
     * @returns
     */
    static parserAsString(parserComingIn: IParser<unknown, unknown>): string;
    /**
     * This is the most useful parser, it assumes the happy path and will throw an error if it fails.
     * @param value
     * @returns
     */
    unsafeCast(value: A): B;
    /**
     * This is the like the unsafe parser, it assumes the happy path and will throw and return a failed promise during failure.
     * @param value
     * @returns
     */
    castPromise(value: A): Promise<B>;
    /**
     * When we want to get the error message from the input, to know what is wrong
     * @param input
     * @returns Null if there is no error
     */
    errorMessage(input: A): void | string;
    /**
     * Use this that we want to do transformations after the value is valid and parsed.
     * A use case would be parsing a string, making sure it can be parsed to a number, and then convert to a number
     * @param fn
     * @param mappingName
     * @returns
     */
    map<C>(fn: (apply: B) => C, mappingName?: string): Parser<A, C>;
    /**
     * Use this when you want to combine two parsers into one. This will make sure that both parsers will run against the same value.
     * @param otherParser
     * @returns
     */
    concat<C>(otherParser: IParser<B, C>): Parser<A, C>;
    /**
     * Use this to combine parsers into one. This will make sure that one or the other parsers will run against the value.
     * @param otherParser
     * @returns
     */
    orParser<C>(otherParser: IParser<A, C>): Parser<A, B | C>;
    /**
     * Use this as a guard clause, useful for escaping during the error cases.
     * https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
     * @param value
     * @returns
     */
    test: (value: A) => value is A & B;
    /**
     * When we want to make sure that we handle the null later on in a monoid fashion,
     * and this ensures we deal with the value
     * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining
     */
    optional(_name?: string): Parser<Optional<A>, Optional<B>>;
    /**
     * There are times that we would like to bring in a value that we know as null or undefined
     * and want it to go to a default value
     */
    defaultTo<C>(defaultValue: C): Parser<Optional<A>, C | NonNull<B, C>>;
    /**
     * We want to test value with a test eg isEven
     */
    validate(isValid: (value: B) => boolean, otherName: string): Parser<A, B>;
    /**
     * We want to refine to a new type given an original type, like isEven, or casting to a more
     * specific type
     */
    refine<C = B>(refinementTest: (value: B) => value is B & C, otherName?: string): Parser<A, B & C>;
    /**
     * Use this when we want to give the parser a name, and we want to be able to use the name in the error messages.
     * @param nameString
     * @returns
     */
    name(nameString: string): Parser<A, B>;
    /**
     * This is another type of parsing that will return a value that is a discriminated union of the success and failure cases.
     * https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions
     * @param value
     * @returns
     */
    enumParsed(value: A): EnumType<B>;
    /**
     * Return the unwrapped parser/ IParser
     * @returns
     */
    unwrappedParser(): IParser<any, any>;
}