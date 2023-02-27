/**
 * Will take in a range, like `>1.2` or `<1.2.3.4` or `=1.2` or `1.*`
 * and return a checker, that has the check function for checking that a version is in the valid
 * @param range
 * @returns
 */
export declare function rangeOf(range: string | Checker): Checker;
/**
 * Used to create a checker that will `and` all the ranges passed in
 * @param ranges
 * @returns
 */
export declare function rangeAnd(...ranges: (string | Checker)[]): Checker;
/**
 * Used to create a checker that will `or` all the ranges passed in
 * @param ranges
 * @returns
 */
export declare function rangeOr(...ranges: (string | Checker)[]): Checker;
/**
 * This will negate the checker, so given a checker that checks for >= 1.0.0, it will check for < 1.0.0
 * @param range
 * @returns
 */
export declare function notRange(range: string | Checker): Checker;
/**
 * EmVer is a set of versioning of any pattern like 1 or 1.2 or 1.2.3 or 1.2.3.4 or ..
 */
export declare class EmVer {
    readonly values: number[];
    /**
     * Convert the range, should be 1.2.* or * into a emver
     * Or an already made emver
     * IsUnsafe
     */
    static from(range: string | EmVer): EmVer;
    /**
     * Convert the range, should be 1.2.* or * into a emver
     * IsUnsafe
     */
    static parse(range: string): EmVer;
    private constructor();
    /**
     * Used when we need a new emver that has the last number incremented, used in the 1.* like things
     */
    withLastIncremented(): EmVer;
    greaterThan(other: EmVer): boolean;
    equals(other: EmVer): boolean;
    greaterThanOrEqual(other: EmVer): boolean;
    lessThanOrEqual(other: EmVer): boolean;
    lessThan(other: EmVer): boolean;
    /**
     * Return a enum string that describes (used for switching/iffs)
     * to know comparison
     * @param other
     * @returns
     */
    compare(other: EmVer): "equal" | "greater" | "less";
    /**
     * Used when sorting emver's in a list using the sort method
     * @param other
     * @returns
     */
    compareForSort(other: EmVer): 0 | 1 | -1;
}
/**
 * A checker is a function that takes a version and returns true if the version matches the checker.
 * Used when we are doing range checking, like saying ">=1.0.0".check("1.2.3") will be true
 */
export declare class Checker {
    /**
     * Check is the function that will be given a emver or unparsed emver and should give if it follows
     * a pattern
     */
    readonly check: (value: string | EmVer) => boolean;
    /**
     * Will take in a range, like `>1.2` or `<1.2.3.4` or `=1.2` or `1.*`
     * and return a checker, that has the check function for checking that a version is in the valid
     * @param range
     * @returns
     */
    static parse(range: string | Checker): Checker;
    constructor(
    /**
     * Check is the function that will be given a emver or unparsed emver and should give if it follows
     * a pattern
     */
    check: (value: string | EmVer) => boolean);
    /**
     * Used when we want the `and` condition with another checker
     */
    and(...others: (Checker | string)[]): Checker;
    /**
     * Used when we want the `or` condition with another checker
     */
    or(...others: (Checker | string)[]): Checker;
    /**
     * A useful example is making sure we don't match an exact version, like !=1.2.3
     * @returns
     */
    not(): Checker;
}