// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
export class YAMLError extends Error {
    constructor(message = "(unknown reason)", mark = "") {
        super(`${message} ${mark}`);
        Object.defineProperty(this, "mark", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: mark
        });
        this.name = this.constructor.name;
    }
    toString(_compact) {
        return `${this.name}: ${this.message} ${this.mark}`;
    }
}
