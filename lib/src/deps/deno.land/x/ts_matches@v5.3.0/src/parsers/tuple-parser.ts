// deno-lint-ignore-file no-explicit-any
import { isArray, literal, Parser } from "./index.js";
import { saferStringify } from "../utils.js";
import { IParser, OnParse, ParserInto } from "./interfaces.js";

// prettier-ignore
// deno-fmt-ignores
export type TupleParserInto<T> = T extends [infer A] | readonly [infer A]
  ? [ParserInto<A>]
  : T extends [infer A, ...infer B] | readonly [infer A, ...infer B]
    ? [ParserInto<A>, ...TupleParserInto<B>]
  : never;

export class TupleParser<A extends Parser<unknown, unknown>[]>
  implements IParser<unknown, TupleParserInto<A>> {
  constructor(
    readonly parsers: A,
    readonly lengthMatcher = literal(parsers.length),
    readonly description = {
      name: "Tuple",
      children: parsers,
      extras: [],
    } as const,
  ) {}
  parse<C, D>(
    input: unknown,
    onParse: OnParse<unknown, TupleParserInto<A>, C, D>,
  ): C | D {
    const tupleError = isArray.enumParsed(input);
    if ("error" in tupleError) return onParse.invalid(tupleError.error);
    const values = input as unknown[];
    const stateCheck = this.lengthMatcher.enumParsed(values.length);
    if ("error" in stateCheck) {
      stateCheck.error.keys.push(saferStringify("length"));
      return onParse.invalid(stateCheck.error);
    }
    const answer = new Array(this.parsers.length);
    for (const key in this.parsers) {
      const parser = this.parsers[key];
      const value = values[key];
      const result = parser.enumParsed(value);
      if ("error" in result) {
        const { error } = result;
        error.keys.push(saferStringify(key));
        return onParse.invalid(error);
      }
      answer[key] = result.value;
    }
    return onParse.parsed(answer as any);
  }
}

export function tuple<A extends Parser<unknown, unknown>[]>(
  ...parsers: A
): Parser<unknown, TupleParserInto<A>> {
  return new Parser(new TupleParser(parsers));
}
