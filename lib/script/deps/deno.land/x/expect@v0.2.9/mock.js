"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calls = exports.fn = void 0;
const MOCK_SYMBOL = Symbol.for("@MOCK");
function fn(...stubs) {
    const calls = [];
    const f = (...args) => {
        const stub = stubs.length === 1
            ? // keep reusing the first
                stubs[0]
            : // pick the exact mock for the current call
                stubs[calls.length];
        try {
            const returned = stub ? stub(...args) : undefined;
            calls.push({
                args,
                returned,
                timestamp: Date.now(),
                returns: true,
                throws: false,
            });
            return returned;
        }
        catch (err) {
            calls.push({
                args,
                timestamp: Date.now(),
                returns: false,
                thrown: err,
                throws: true,
            });
            throw err;
        }
    };
    Object.defineProperty(f, MOCK_SYMBOL, {
        value: { calls },
        writable: false,
    });
    return f;
}
exports.fn = fn;
function calls(f) {
    const mockInfo = f[MOCK_SYMBOL];
    if (!mockInfo)
        throw new Error("callCount only available on mock functions");
    return [...mockInfo.calls];
}
exports.calls = calls;