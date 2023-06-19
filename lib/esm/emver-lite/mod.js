import { matches } from "../dependencies.js";
const starSub = /((\d+\.)*\d+)\.\*/;
function incrementLastNumber(list) {
    const newList = [...list];
    newList[newList.length - 1]++;
    return newList;
}
/**
 * Will take in a range, like `>1.2` or `<1.2.3.4` or `=1.2` or `1.*`
 * and return a checker, that has the check function for checking that a version is in the valid
 * @param range
 * @returns
 */
export function rangeOf(range) {
    return Checker.parse(range);
}
/**
 * Used to create a checker that will `and` all the ranges passed in
 * @param ranges
 * @returns
 */
export function rangeAnd(...ranges) {
    if (ranges.length === 0) {
        throw new Error("No ranges given");
    }
    const [firstCheck, ...rest] = ranges;
    return Checker.parse(firstCheck).and(...rest);
}
/**
 * Used to create a checker that will `or` all the ranges passed in
 * @param ranges
 * @returns
 */
export function rangeOr(...ranges) {
    if (ranges.length === 0) {
        throw new Error("No ranges given");
    }
    const [firstCheck, ...rest] = ranges;
    return Checker.parse(firstCheck).or(...rest);
}
/**
 * This will negate the checker, so given a checker that checks for >= 1.0.0, it will check for < 1.0.0
 * @param range
 * @returns
 */
export function notRange(range) {
    return rangeOf(range).not();
}
/**
 * EmVer is a set of versioning of any pattern like 1 or 1.2 or 1.2.3 or 1.2.3.4 or ..
 */
export class EmVer {
    /**
     * Convert the range, should be 1.2.* or * into a emver
     * Or an already made emver
     * IsUnsafe
     */
    static from(range) {
        if (range instanceof EmVer) {
            return range;
        }
        return EmVer.parse(range);
    }
    /**
     * Convert the range, should be 1.2.* or * into a emver
     * IsUnsafe
     */
    static parse(range) {
        const values = range.split(".").map((x) => parseInt(x));
        for (const value of values) {
            if (isNaN(value)) {
                throw new Error(`Couldn't parse range: ${range}`);
            }
        }
        return new EmVer(values);
    }
    constructor(values) {
        Object.defineProperty(this, "values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: values
        });
    }
    /**
     * Used when we need a new emver that has the last number incremented, used in the 1.* like things
     */
    withLastIncremented() {
        return new EmVer(incrementLastNumber(this.values));
    }
    greaterThan(other) {
        for (const i in this.values) {
            if (other.values[i] == null) {
                return true;
            }
            if (this.values[i] > other.values[i]) {
                return true;
            }
            if (this.values[i] < other.values[i]) {
                return false;
            }
        }
        return false;
    }
    equals(other) {
        if (other.values.length !== this.values.length) {
            return false;
        }
        for (const i in this.values) {
            if (this.values[i] !== other.values[i]) {
                return false;
            }
        }
        return true;
    }
    greaterThanOrEqual(other) {
        return this.greaterThan(other) || this.equals(other);
    }
    lessThanOrEqual(other) {
        return !this.greaterThan(other);
    }
    lessThan(other) {
        return !this.greaterThanOrEqual(other);
    }
    /**
     * Return a enum string that describes (used for switching/iffs)
     * to know comparison
     * @param other
     * @returns
     */
    compare(other) {
        if (this.equals(other)) {
            return "equal";
        }
        else if (this.greaterThan(other)) {
            return "greater";
        }
        else {
            return "less";
        }
    }
    /**
     * Used when sorting emver's in a list using the sort method
     * @param other
     * @returns
     */
    compareForSort(other) {
        return matches.matches(this.compare(other))
            .when("equal", () => 0)
            .when("greater", () => 1)
            .when("less", () => -1)
            .unwrap();
    }
}
/**
 * A checker is a function that takes a version and returns true if the version matches the checker.
 * Used when we are doing range checking, like saying ">=1.0.0".check("1.2.3") will be true
 */
export class Checker {
    /**
     * Will take in a range, like `>1.2` or `<1.2.3.4` or `=1.2` or `1.*`
     * and return a checker, that has the check function for checking that a version is in the valid
     * @param range
     * @returns
     */
    static parse(range) {
        if (range instanceof Checker) {
            return range;
        }
        range = range.trim();
        if (range.indexOf("||") !== -1) {
            return rangeOr(...range.split("||").map((x) => Checker.parse(x)));
        }
        if (range.indexOf("&&") !== -1) {
            return rangeAnd(...range.split("&&").map((x) => Checker.parse(x)));
        }
        if (range === "*") {
            return new Checker((version) => {
                EmVer.from(version);
                return true;
            });
        }
        if (range.startsWith("!")) {
            return Checker.parse(range.substring(1)).not();
        }
        const starSubMatches = starSub.exec(range);
        if (starSubMatches != null) {
            const emVarLower = EmVer.parse(starSubMatches[1]);
            const emVarUpper = emVarLower.withLastIncremented();
            return new Checker((version) => {
                const v = EmVer.from(version);
                return (v.greaterThan(emVarLower) || v.equals(emVarLower)) &&
                    !v.greaterThan(emVarUpper) && !v.equals(emVarUpper);
            });
        }
        switch (range.substring(0, 2)) {
            case ">=": {
                const emVar = EmVer.parse(range.substring(2));
                return new Checker((version) => {
                    const v = EmVer.from(version);
                    return v.greaterThanOrEqual(emVar);
                });
            }
            case "<=": {
                const emVar = EmVer.parse(range.substring(2));
                return new Checker((version) => {
                    const v = EmVer.from(version);
                    return v.lessThanOrEqual(emVar);
                });
            }
        }
        switch (range.substring(0, 1)) {
            case ">": {
                console.log("greaterThan");
                const emVar = EmVer.parse(range.substring(1));
                return new Checker((version) => {
                    const v = EmVer.from(version);
                    return v.greaterThan(emVar);
                });
            }
            case "<": {
                const emVar = EmVer.parse(range.substring(1));
                return new Checker((version) => {
                    const v = EmVer.from(version);
                    return v.lessThan(emVar);
                });
            }
            case "=": {
                const emVar = EmVer.parse(range.substring(1));
                return new Checker((version) => {
                    const v = EmVer.from(version);
                    return v.equals(emVar);
                });
            }
        }
        throw new Error("Couldn't parse range: " + range);
    }
    constructor(
    /**
     * Check is the function that will be given a emver or unparsed emver and should give if it follows
     * a pattern
     */
    check) {
        Object.defineProperty(this, "check", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: check
        });
    }
    /**
     * Used when we want the `and` condition with another checker
     */
    and(...others) {
        return new Checker((value) => {
            if (!this.check(value)) {
                return false;
            }
            for (const other of others) {
                if (!Checker.parse(other).check(value)) {
                    return false;
                }
            }
            return true;
        });
    }
    /**
     * Used when we want the `or` condition with another checker
     */
    or(...others) {
        return new Checker((value) => {
            if (this.check(value)) {
                return true;
            }
            for (const other of others) {
                if (Checker.parse(other).check(value)) {
                    return true;
                }
            }
            return false;
        });
    }
    /**
     * A useful example is making sure we don't match an exact version, like !=1.2.3
     * @returns
     */
    not() {
        return new Checker((value) => !this.check(value));
    }
}