"use strict";
// Ported and adapted from js-yaml-js-types v1.0.0:
// https://github.com/nodeca/js-yaml-js-types/tree/ac537e7bbdd3c2cbbd9882ca3919c520c2dc022b
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.func = void 0;
const type_js_1 = require("../type.js");
// Note: original implementation used Esprima to handle functions
// To avoid dependencies, we'll just try to check if we can construct a function from given string
function reconstructFunction(code) {
    const func = new Function(`return ${code}`)();
    if (!(func instanceof Function)) {
        throw new TypeError(`Expected function but got ${typeof func}: ${code}`);
    }
    return func;
}
exports.func = new type_js_1.Type("tag:yaml.org,2002:js/function", {
    kind: "scalar",
    resolve(data) {
        if (data === null) {
            return false;
        }
        try {
            reconstructFunction(`${data}`);
            return true;
        }
        catch (_err) {
            return false;
        }
    },
    construct(data) {
        return reconstructFunction(data);
    },
    predicate(object) {
        return object instanceof Function;
    },
    represent(object) {
        return object.toString();
    },
});
