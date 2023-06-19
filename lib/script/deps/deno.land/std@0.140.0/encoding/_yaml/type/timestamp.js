"use strict";
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = void 0;
const type_js_1 = require("../type.js");
const YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])" + // [1] year
    "-([0-9][0-9])" + // [2] month
    "-([0-9][0-9])$");
const YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])" + // [1] year
    "-([0-9][0-9]?)" + // [2] month
    "-([0-9][0-9]?)" + // [3] day
    "(?:[Tt]|[ \\t]+)" + // ...
    "([0-9][0-9]?)" + // [4] hour
    ":([0-9][0-9])" + // [5] minute
    ":([0-9][0-9])" + // [6] second
    "(?:\\.([0-9]*))?" + // [7] fraction
    "(?:[ \\t]*(Z|([-+])([0-9][0-9]?)" + // [8] tz [9] tz_sign [10] tz_hour
    "(?::([0-9][0-9]))?))?$");
function resolveYamlTimestamp(data) {
    if (data === null)
        return false;
    if (YAML_DATE_REGEXP.exec(data) !== null)
        return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
        return true;
    return false;
}
function constructYamlTimestamp(data) {
    let match = YAML_DATE_REGEXP.exec(data);
    if (match === null)
        match = YAML_TIMESTAMP_REGEXP.exec(data);
    if (match === null)
        throw new Error("Date resolve error");
    // match: [1] year [2] month [3] day
    const year = +match[1];
    const month = +match[2] - 1; // JS month starts with 0
    const day = +match[3];
    if (!match[4]) {
        // no hour
        return new Date(Date.UTC(year, month, day));
    }
    // match: [4] hour [5] minute [6] second [7] fraction
    const hour = +match[4];
    const minute = +match[5];
    const second = +match[6];
    let fraction = 0;
    if (match[7]) {
        let partFraction = match[7].slice(0, 3);
        while (partFraction.length < 3) {
            // milli-seconds
            partFraction += "0";
        }
        fraction = +partFraction;
    }
    // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute
    let delta = null;
    if (match[9]) {
        const tzHour = +match[10];
        const tzMinute = +(match[11] || 0);
        delta = (tzHour * 60 + tzMinute) * 60000; // delta in milli-seconds
        if (match[9] === "-")
            delta = -delta;
    }
    const date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (delta)
        date.setTime(date.getTime() - delta);
    return date;
}
function representYamlTimestamp(date) {
    return date.toISOString();
}
exports.timestamp = new type_js_1.Type("tag:yaml.org,2002:timestamp", {
    construct: constructYamlTimestamp,
    instanceOf: Date,
    kind: "scalar",
    represent: representYamlTimestamp,
    resolve: resolveYamlTimestamp,
});