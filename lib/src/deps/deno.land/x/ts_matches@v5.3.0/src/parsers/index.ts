import { _, ValidatorError } from "./interfaces.js";
import { isNumber } from "./utils.js";
import { GuardParser } from "./guard-parser.js";
import { Parser } from "./parser.js";
import {
  any,
  boolean,
  guard,
  instanceOf,
  isArray,
  isFunction,
  isNill,
  natural,
  number,
  object,
  regex,
  string,
} from "./simple-parsers.js";
import { some } from "./some-parser.js";
import { every } from "./every-parser.js";
import { dictionary } from "./dictionary-parser.js";
import { partial, shape } from "./shape-parser.js";
import { tuple } from "./tuple-parser.js";
import { arrayOf } from "./array-of-parser.js";
import { literal, literals } from "./literal-parser.js";
import { recursive } from "./recursive-parser.js";
import { deferred } from "./deferred-parser.js";
export type { ValidatorError };
export {
  any,
  arrayOf,
  boolean,
  deferred,
  dictionary,
  every,
  guard,
  GuardParser as IsAParser,
  instanceOf,
  isArray,
  isFunction,
  isNill,
  isNumber,
  literal,
  literals,
  natural,
  number,
  object,
  Parser,
  partial,
  recursive,
  regex,
  shape,
  some,
  string,
  tuple,
};