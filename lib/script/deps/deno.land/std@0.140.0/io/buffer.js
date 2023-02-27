"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Buffer_instances, _Buffer_buf, _Buffer_off, _Buffer_tryGrowByReslice, _Buffer_reslice, _Buffer_grow, _BufReader_buf, _BufReader_rd, _BufReader_r, _BufReader_w, _BufReader_eof, _BufReader_fill, _BufReader_reset, _BufWriter_writer, _BufWriterSync_writer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.readLines = exports.readStringDelim = exports.readDelim = exports.BufWriterSync = exports.BufWriter = exports.BufReader = exports.PartialReadError = exports.BufferFullError = exports.Buffer = void 0;
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
const dntShim = __importStar(require("../../../../_dnt.shims.js"));
const assert_js_1 = require("../_util/assert.js");
const bytes_list_js_1 = require("../bytes/bytes_list.js");
const mod_js_1 = require("../bytes/mod.js");
// MIN_READ is the minimum ArrayBuffer size passed to a read call by
// buffer.ReadFrom. As long as the Buffer has at least MIN_READ bytes beyond
// what is required to hold the contents of r, readFrom() will not grow the
// underlying buffer.
const MIN_READ = 32 * 1024;
const MAX_SIZE = 2 ** 32 - 2;
/** A variable-sized buffer of bytes with `read()` and `write()` methods.
 *
 * Buffer is almost always used with some I/O like files and sockets. It allows
 * one to buffer up a download from a socket. Buffer grows and shrinks as
 * necessary.
 *
 * Buffer is NOT the same thing as Node's Buffer. Node's Buffer was created in
 * 2009 before JavaScript had the concept of ArrayBuffers. It's simply a
 * non-standard ArrayBuffer.
 *
 * ArrayBuffer is a fixed memory allocation. Buffer is implemented on top of
 * ArrayBuffer.
 *
 * Based on [Go Buffer](https://golang.org/pkg/bytes/#Buffer). */
class Buffer {
    constructor(ab) {
        _Buffer_instances.add(this);
        _Buffer_buf.set(this, void 0); // contents are the bytes buf[off : len(buf)]
        _Buffer_off.set(this, 0); // read at buf[off], write at buf[buf.byteLength]
        __classPrivateFieldSet(this, _Buffer_buf, ab === undefined ? new Uint8Array(0) : new Uint8Array(ab), "f");
    }
    /** Returns a slice holding the unread portion of the buffer.
     *
     * The slice is valid for use only until the next buffer modification (that
     * is, only until the next call to a method like `read()`, `write()`,
     * `reset()`, or `truncate()`). If `options.copy` is false the slice aliases the buffer content at
     * least until the next buffer modification, so immediate changes to the
     * slice will affect the result of future reads.
     * @param options Defaults to `{ copy: true }`
     */
    bytes(options = { copy: true }) {
        if (options.copy === false)
            return __classPrivateFieldGet(this, _Buffer_buf, "f").subarray(__classPrivateFieldGet(this, _Buffer_off, "f"));
        return __classPrivateFieldGet(this, _Buffer_buf, "f").slice(__classPrivateFieldGet(this, _Buffer_off, "f"));
    }
    /** Returns whether the unread portion of the buffer is empty. */
    empty() {
        return __classPrivateFieldGet(this, _Buffer_buf, "f").byteLength <= __classPrivateFieldGet(this, _Buffer_off, "f");
    }
    /** A read only number of bytes of the unread portion of the buffer. */
    get length() {
        return __classPrivateFieldGet(this, _Buffer_buf, "f").byteLength - __classPrivateFieldGet(this, _Buffer_off, "f");
    }
    /** The read only capacity of the buffer's underlying byte slice, that is,
     * the total space allocated for the buffer's data. */
    get capacity() {
        return __classPrivateFieldGet(this, _Buffer_buf, "f").buffer.byteLength;
    }
    /** Discards all but the first `n` unread bytes from the buffer but
     * continues to use the same allocated storage. It throws if `n` is
     * negative or greater than the length of the buffer. */
    truncate(n) {
        if (n === 0) {
            this.reset();
            return;
        }
        if (n < 0 || n > this.length) {
            throw Error("bytes.Buffer: truncation out of range");
        }
        __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_reslice).call(this, __classPrivateFieldGet(this, _Buffer_off, "f") + n);
    }
    reset() {
        __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_reslice).call(this, 0);
        __classPrivateFieldSet(this, _Buffer_off, 0, "f");
    }
    /** Reads the next `p.length` bytes from the buffer or until the buffer is
     * drained. Returns the number of bytes read. If the buffer has no data to
     * return, the return is EOF (`null`). */
    readSync(p) {
        if (this.empty()) {
            // Buffer is empty, reset to recover space.
            this.reset();
            if (p.byteLength === 0) {
                // this edge case is tested in 'bufferReadEmptyAtEOF' test
                return 0;
            }
            return null;
        }
        const nread = (0, mod_js_1.copy)(__classPrivateFieldGet(this, _Buffer_buf, "f").subarray(__classPrivateFieldGet(this, _Buffer_off, "f")), p);
        __classPrivateFieldSet(this, _Buffer_off, __classPrivateFieldGet(this, _Buffer_off, "f") + nread, "f");
        return nread;
    }
    /** Reads the next `p.length` bytes from the buffer or until the buffer is
     * drained. Resolves to the number of bytes read. If the buffer has no
     * data to return, resolves to EOF (`null`).
     *
     * NOTE: This methods reads bytes synchronously; it's provided for
     * compatibility with `Reader` interfaces.
     */
    read(p) {
        const rr = this.readSync(p);
        return Promise.resolve(rr);
    }
    writeSync(p) {
        const m = __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_grow).call(this, p.byteLength);
        return (0, mod_js_1.copy)(p, __classPrivateFieldGet(this, _Buffer_buf, "f"), m);
    }
    /** NOTE: This methods writes bytes synchronously; it's provided for
     * compatibility with `Writer` interface. */
    write(p) {
        const n = this.writeSync(p);
        return Promise.resolve(n);
    }
    /** Grows the buffer's capacity, if necessary, to guarantee space for
     * another `n` bytes. After `.grow(n)`, at least `n` bytes can be written to
     * the buffer without another allocation. If `n` is negative, `.grow()` will
     * throw. If the buffer can't grow it will throw an error.
     *
     * Based on Go Lang's
     * [Buffer.Grow](https://golang.org/pkg/bytes/#Buffer.Grow). */
    grow(n) {
        if (n < 0) {
            throw Error("Buffer.grow: negative count");
        }
        const m = __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_grow).call(this, n);
        __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_reslice).call(this, m);
    }
    /** Reads data from `r` until EOF (`null`) and appends it to the buffer,
     * growing the buffer as needed. It resolves to the number of bytes read.
     * If the buffer becomes too large, `.readFrom()` will reject with an error.
     *
     * Based on Go Lang's
     * [Buffer.ReadFrom](https://golang.org/pkg/bytes/#Buffer.ReadFrom). */
    async readFrom(r) {
        let n = 0;
        const tmp = new Uint8Array(MIN_READ);
        while (true) {
            const shouldGrow = this.capacity - this.length < MIN_READ;
            // read into tmp buffer if there's not enough room
            // otherwise read directly into the internal buffer
            const buf = shouldGrow
                ? tmp
                : new Uint8Array(__classPrivateFieldGet(this, _Buffer_buf, "f").buffer, this.length);
            const nread = await r.read(buf);
            if (nread === null) {
                return n;
            }
            // write will grow if needed
            if (shouldGrow)
                this.writeSync(buf.subarray(0, nread));
            else
                __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_reslice).call(this, this.length + nread);
            n += nread;
        }
    }
    /** Reads data from `r` until EOF (`null`) and appends it to the buffer,
     * growing the buffer as needed. It returns the number of bytes read. If the
     * buffer becomes too large, `.readFromSync()` will throw an error.
     *
     * Based on Go Lang's
     * [Buffer.ReadFrom](https://golang.org/pkg/bytes/#Buffer.ReadFrom). */
    readFromSync(r) {
        let n = 0;
        const tmp = new Uint8Array(MIN_READ);
        while (true) {
            const shouldGrow = this.capacity - this.length < MIN_READ;
            // read into tmp buffer if there's not enough room
            // otherwise read directly into the internal buffer
            const buf = shouldGrow
                ? tmp
                : new Uint8Array(__classPrivateFieldGet(this, _Buffer_buf, "f").buffer, this.length);
            const nread = r.readSync(buf);
            if (nread === null) {
                return n;
            }
            // write will grow if needed
            if (shouldGrow)
                this.writeSync(buf.subarray(0, nread));
            else
                __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_reslice).call(this, this.length + nread);
            n += nread;
        }
    }
}
exports.Buffer = Buffer;
_Buffer_buf = new WeakMap(), _Buffer_off = new WeakMap(), _Buffer_instances = new WeakSet(), _Buffer_tryGrowByReslice = function _Buffer_tryGrowByReslice(n) {
    const l = __classPrivateFieldGet(this, _Buffer_buf, "f").byteLength;
    if (n <= this.capacity - l) {
        __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_reslice).call(this, l + n);
        return l;
    }
    return -1;
}, _Buffer_reslice = function _Buffer_reslice(len) {
    (0, assert_js_1.assert)(len <= __classPrivateFieldGet(this, _Buffer_buf, "f").buffer.byteLength);
    __classPrivateFieldSet(this, _Buffer_buf, new Uint8Array(__classPrivateFieldGet(this, _Buffer_buf, "f").buffer, 0, len), "f");
}, _Buffer_grow = function _Buffer_grow(n) {
    const m = this.length;
    // If buffer is empty, reset to recover space.
    if (m === 0 && __classPrivateFieldGet(this, _Buffer_off, "f") !== 0) {
        this.reset();
    }
    // Fast: Try to grow by means of a reslice.
    const i = __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_tryGrowByReslice).call(this, n);
    if (i >= 0) {
        return i;
    }
    const c = this.capacity;
    if (n <= Math.floor(c / 2) - m) {
        // We can slide things down instead of allocating a new
        // ArrayBuffer. We only need m+n <= c to slide, but
        // we instead let capacity get twice as large so we
        // don't spend all our time copying.
        (0, mod_js_1.copy)(__classPrivateFieldGet(this, _Buffer_buf, "f").subarray(__classPrivateFieldGet(this, _Buffer_off, "f")), __classPrivateFieldGet(this, _Buffer_buf, "f"));
    }
    else if (c + n > MAX_SIZE) {
        throw new Error("The buffer cannot be grown beyond the maximum size.");
    }
    else {
        // Not enough space anywhere, we need to allocate.
        const buf = new Uint8Array(Math.min(2 * c + n, MAX_SIZE));
        (0, mod_js_1.copy)(__classPrivateFieldGet(this, _Buffer_buf, "f").subarray(__classPrivateFieldGet(this, _Buffer_off, "f")), buf);
        __classPrivateFieldSet(this, _Buffer_buf, buf, "f");
    }
    // Restore this.#off and len(this.#buf).
    __classPrivateFieldSet(this, _Buffer_off, 0, "f");
    __classPrivateFieldGet(this, _Buffer_instances, "m", _Buffer_reslice).call(this, Math.min(m + n, MAX_SIZE));
    return m;
};
const DEFAULT_BUF_SIZE = 4096;
const MIN_BUF_SIZE = 16;
const MAX_CONSECUTIVE_EMPTY_READS = 100;
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
class BufferFullError extends Error {
    constructor(partial) {
        super("Buffer full");
        Object.defineProperty(this, "partial", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: partial
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "BufferFullError"
        });
    }
}
exports.BufferFullError = BufferFullError;
class PartialReadError extends Error {
    constructor() {
        super("Encountered UnexpectedEof, data only partially read");
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "PartialReadError"
        });
        Object.defineProperty(this, "partial", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
}
exports.PartialReadError = PartialReadError;
/** BufReader implements buffering for a Reader object. */
class BufReader {
    // private lastByte: number;
    // private lastCharSize: number;
    /** return new BufReader unless r is BufReader */
    static create(r, size = DEFAULT_BUF_SIZE) {
        return r instanceof BufReader ? r : new BufReader(r, size);
    }
    constructor(rd, size = DEFAULT_BUF_SIZE) {
        _BufReader_buf.set(this, void 0);
        _BufReader_rd.set(this, void 0); // Reader provided by caller.
        _BufReader_r.set(this, 0); // buf read position.
        _BufReader_w.set(this, 0); // buf write position.
        _BufReader_eof.set(this, false);
        // Reads a new chunk into the buffer.
        _BufReader_fill.set(this, async () => {
            // Slide existing data to beginning.
            if (__classPrivateFieldGet(this, _BufReader_r, "f") > 0) {
                __classPrivateFieldGet(this, _BufReader_buf, "f").copyWithin(0, __classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_w, "f"));
                __classPrivateFieldSet(this, _BufReader_w, __classPrivateFieldGet(this, _BufReader_w, "f") - __classPrivateFieldGet(this, _BufReader_r, "f"), "f");
                __classPrivateFieldSet(this, _BufReader_r, 0, "f");
            }
            if (__classPrivateFieldGet(this, _BufReader_w, "f") >= __classPrivateFieldGet(this, _BufReader_buf, "f").byteLength) {
                throw Error("bufio: tried to fill full buffer");
            }
            // Read new data: try a limited number of times.
            for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
                const rr = await __classPrivateFieldGet(this, _BufReader_rd, "f").read(__classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_w, "f")));
                if (rr === null) {
                    __classPrivateFieldSet(this, _BufReader_eof, true, "f");
                    return;
                }
                (0, assert_js_1.assert)(rr >= 0, "negative read");
                __classPrivateFieldSet(this, _BufReader_w, __classPrivateFieldGet(this, _BufReader_w, "f") + rr, "f");
                if (rr > 0) {
                    return;
                }
            }
            throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
        });
        _BufReader_reset.set(this, (buf, rd) => {
            __classPrivateFieldSet(this, _BufReader_buf, buf, "f");
            __classPrivateFieldSet(this, _BufReader_rd, rd, "f");
            __classPrivateFieldSet(this, _BufReader_eof, false, "f");
            // this.lastByte = -1;
            // this.lastCharSize = -1;
        });
        if (size < MIN_BUF_SIZE) {
            size = MIN_BUF_SIZE;
        }
        __classPrivateFieldGet(this, _BufReader_reset, "f").call(this, new Uint8Array(size), rd);
    }
    /** Returns the size of the underlying buffer in bytes. */
    size() {
        return __classPrivateFieldGet(this, _BufReader_buf, "f").byteLength;
    }
    buffered() {
        return __classPrivateFieldGet(this, _BufReader_w, "f") - __classPrivateFieldGet(this, _BufReader_r, "f");
    }
    /** Discards any buffered data, resets all state, and switches
     * the buffered reader to read from r.
     */
    reset(r) {
        __classPrivateFieldGet(this, _BufReader_reset, "f").call(this, __classPrivateFieldGet(this, _BufReader_buf, "f"), r);
    }
    /** reads data into p.
     * It returns the number of bytes read into p.
     * The bytes are taken from at most one Read on the underlying Reader,
     * hence n may be less than len(p).
     * To read exactly len(p) bytes, use io.ReadFull(b, p).
     */
    async read(p) {
        let rr = p.byteLength;
        if (p.byteLength === 0)
            return rr;
        if (__classPrivateFieldGet(this, _BufReader_r, "f") === __classPrivateFieldGet(this, _BufReader_w, "f")) {
            if (p.byteLength >= __classPrivateFieldGet(this, _BufReader_buf, "f").byteLength) {
                // Large read, empty buffer.
                // Read directly into p to avoid copy.
                const rr = await __classPrivateFieldGet(this, _BufReader_rd, "f").read(p);
                const nread = rr ?? 0;
                (0, assert_js_1.assert)(nread >= 0, "negative read");
                // if (rr.nread > 0) {
                //   this.lastByte = p[rr.nread - 1];
                //   this.lastCharSize = -1;
                // }
                return rr;
            }
            // One read.
            // Do not use this.fill, which will loop.
            __classPrivateFieldSet(this, _BufReader_r, 0, "f");
            __classPrivateFieldSet(this, _BufReader_w, 0, "f");
            rr = await __classPrivateFieldGet(this, _BufReader_rd, "f").read(__classPrivateFieldGet(this, _BufReader_buf, "f"));
            if (rr === 0 || rr === null)
                return rr;
            (0, assert_js_1.assert)(rr >= 0, "negative read");
            __classPrivateFieldSet(this, _BufReader_w, __classPrivateFieldGet(this, _BufReader_w, "f") + rr, "f");
        }
        // copy as much as we can
        const copied = (0, mod_js_1.copy)(__classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_w, "f")), p, 0);
        __classPrivateFieldSet(this, _BufReader_r, __classPrivateFieldGet(this, _BufReader_r, "f") + copied, "f");
        // this.lastByte = this.buf[this.r - 1];
        // this.lastCharSize = -1;
        return copied;
    }
    /** reads exactly `p.length` bytes into `p`.
     *
     * If successful, `p` is returned.
     *
     * If the end of the underlying stream has been reached, and there are no more
     * bytes available in the buffer, `readFull()` returns `null` instead.
     *
     * An error is thrown if some bytes could be read, but not enough to fill `p`
     * entirely before the underlying stream reported an error or EOF. Any error
     * thrown will have a `partial` property that indicates the slice of the
     * buffer that has been successfully filled with data.
     *
     * Ported from https://golang.org/pkg/io/#ReadFull
     */
    async readFull(p) {
        let bytesRead = 0;
        while (bytesRead < p.length) {
            try {
                const rr = await this.read(p.subarray(bytesRead));
                if (rr === null) {
                    if (bytesRead === 0) {
                        return null;
                    }
                    else {
                        throw new PartialReadError();
                    }
                }
                bytesRead += rr;
            }
            catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = p.subarray(0, bytesRead);
                }
                else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = p.subarray(0, bytesRead);
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return p;
    }
    /** Returns the next byte [0, 255] or `null`. */
    async readByte() {
        var _a;
        while (__classPrivateFieldGet(this, _BufReader_r, "f") === __classPrivateFieldGet(this, _BufReader_w, "f")) {
            if (__classPrivateFieldGet(this, _BufReader_eof, "f"))
                return null;
            await __classPrivateFieldGet(this, _BufReader_fill, "f").call(this); // buffer is empty.
        }
        const c = __classPrivateFieldGet(this, _BufReader_buf, "f")[__classPrivateFieldGet(this, _BufReader_r, "f")];
        __classPrivateFieldSet(this, _BufReader_r, (_a = __classPrivateFieldGet(this, _BufReader_r, "f"), _a++, _a), "f");
        // this.lastByte = c;
        return c;
    }
    /** readString() reads until the first occurrence of delim in the input,
     * returning a string containing the data up to and including the delimiter.
     * If ReadString encounters an error before finding a delimiter,
     * it returns the data read before the error and the error itself
     * (often `null`).
     * ReadString returns err != nil if and only if the returned data does not end
     * in delim.
     * For simple uses, a Scanner may be more convenient.
     */
    async readString(delim) {
        if (delim.length !== 1) {
            throw new Error("Delimiter should be a single character");
        }
        const buffer = await this.readSlice(delim.charCodeAt(0));
        if (buffer === null)
            return null;
        return new TextDecoder().decode(buffer);
    }
    /** `readLine()` is a low-level line-reading primitive. Most callers should
     * use `readString('\n')` instead or use a Scanner.
     *
     * `readLine()` tries to return a single line, not including the end-of-line
     * bytes. If the line was too long for the buffer then `more` is set and the
     * beginning of the line is returned. The rest of the line will be returned
     * from future calls. `more` will be false when returning the last fragment
     * of the line. The returned buffer is only valid until the next call to
     * `readLine()`.
     *
     * The text returned from ReadLine does not include the line end ("\r\n" or
     * "\n").
     *
     * When the end of the underlying stream is reached, the final bytes in the
     * stream are returned. No indication or error is given if the input ends
     * without a final line end. When there are no more trailing bytes to read,
     * `readLine()` returns `null`.
     *
     * Calling `unreadByte()` after `readLine()` will always unread the last byte
     * read (possibly a character belonging to the line end) even if that byte is
     * not part of the line returned by `readLine()`.
     */
    async readLine() {
        var _a;
        let line = null;
        try {
            line = await this.readSlice(LF);
        }
        catch (err) {
            if (err instanceof dntShim.Deno.errors.BadResource) {
                throw err;
            }
            let partial;
            if (err instanceof PartialReadError) {
                partial = err.partial;
                (0, assert_js_1.assert)(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            }
            // Don't throw if `readSlice()` failed with `BufferFullError`, instead we
            // just return whatever is available and set the `more` flag.
            if (!(err instanceof BufferFullError)) {
                throw err;
            }
            partial = err.partial;
            // Handle the case where "\r\n" straddles the buffer.
            if (!__classPrivateFieldGet(this, _BufReader_eof, "f") && partial &&
                partial.byteLength > 0 &&
                partial[partial.byteLength - 1] === CR) {
                // Put the '\r' back on buf and drop it from line.
                // Let the next call to ReadLine check for "\r\n".
                (0, assert_js_1.assert)(__classPrivateFieldGet(this, _BufReader_r, "f") > 0, "bufio: tried to rewind past start of buffer");
                __classPrivateFieldSet(this, _BufReader_r, (_a = __classPrivateFieldGet(this, _BufReader_r, "f"), _a--, _a), "f");
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            if (partial) {
                return { line: partial, more: !__classPrivateFieldGet(this, _BufReader_eof, "f") };
            }
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return { line, more: false };
        }
        if (line[line.byteLength - 1] == LF) {
            let drop = 1;
            if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                drop = 2;
            }
            line = line.subarray(0, line.byteLength - drop);
        }
        return { line, more: false };
    }
    /** `readSlice()` reads until the first occurrence of `delim` in the input,
     * returning a slice pointing at the bytes in the buffer. The bytes stop
     * being valid at the next read.
     *
     * If `readSlice()` encounters an error before finding a delimiter, or the
     * buffer fills without finding a delimiter, it throws an error with a
     * `partial` property that contains the entire buffer.
     *
     * If `readSlice()` encounters the end of the underlying stream and there are
     * any bytes left in the buffer, the rest of the buffer is returned. In other
     * words, EOF is always treated as a delimiter. Once the buffer is empty,
     * it returns `null`.
     *
     * Because the data returned from `readSlice()` will be overwritten by the
     * next I/O operation, most clients should use `readString()` instead.
     */
    async readSlice(delim) {
        let s = 0; // search start index
        let slice;
        while (true) {
            // Search buffer.
            let i = __classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f") + s, __classPrivateFieldGet(this, _BufReader_w, "f")).indexOf(delim);
            if (i >= 0) {
                i += s;
                slice = __classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_r, "f") + i + 1);
                __classPrivateFieldSet(this, _BufReader_r, __classPrivateFieldGet(this, _BufReader_r, "f") + (i + 1), "f");
                break;
            }
            // EOF?
            if (__classPrivateFieldGet(this, _BufReader_eof, "f")) {
                if (__classPrivateFieldGet(this, _BufReader_r, "f") === __classPrivateFieldGet(this, _BufReader_w, "f")) {
                    return null;
                }
                slice = __classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_w, "f"));
                __classPrivateFieldSet(this, _BufReader_r, __classPrivateFieldGet(this, _BufReader_w, "f"), "f");
                break;
            }
            // Buffer full?
            if (this.buffered() >= __classPrivateFieldGet(this, _BufReader_buf, "f").byteLength) {
                __classPrivateFieldSet(this, _BufReader_r, __classPrivateFieldGet(this, _BufReader_w, "f"), "f");
                // #4521 The internal buffer should not be reused across reads because it causes corruption of data.
                const oldbuf = __classPrivateFieldGet(this, _BufReader_buf, "f");
                const newbuf = __classPrivateFieldGet(this, _BufReader_buf, "f").slice(0);
                __classPrivateFieldSet(this, _BufReader_buf, newbuf, "f");
                throw new BufferFullError(oldbuf);
            }
            s = __classPrivateFieldGet(this, _BufReader_w, "f") - __classPrivateFieldGet(this, _BufReader_r, "f"); // do not rescan area we scanned before
            // Buffer is not full.
            try {
                await __classPrivateFieldGet(this, _BufReader_fill, "f").call(this);
            }
            catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = slice;
                }
                else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = slice;
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        // Handle last byte, if any.
        // const i = slice.byteLength - 1;
        // if (i >= 0) {
        //   this.lastByte = slice[i];
        //   this.lastCharSize = -1
        // }
        return slice;
    }
    /** `peek()` returns the next `n` bytes without advancing the reader. The
     * bytes stop being valid at the next read call.
     *
     * When the end of the underlying stream is reached, but there are unread
     * bytes left in the buffer, those bytes are returned. If there are no bytes
     * left in the buffer, it returns `null`.
     *
     * If an error is encountered before `n` bytes are available, `peek()` throws
     * an error with the `partial` property set to a slice of the buffer that
     * contains the bytes that were available before the error occurred.
     */
    async peek(n) {
        if (n < 0) {
            throw Error("negative count");
        }
        let avail = __classPrivateFieldGet(this, _BufReader_w, "f") - __classPrivateFieldGet(this, _BufReader_r, "f");
        while (avail < n && avail < __classPrivateFieldGet(this, _BufReader_buf, "f").byteLength && !__classPrivateFieldGet(this, _BufReader_eof, "f")) {
            try {
                await __classPrivateFieldGet(this, _BufReader_fill, "f").call(this);
            }
            catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = __classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_w, "f"));
                }
                else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = __classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_w, "f"));
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
            avail = __classPrivateFieldGet(this, _BufReader_w, "f") - __classPrivateFieldGet(this, _BufReader_r, "f");
        }
        if (avail === 0 && __classPrivateFieldGet(this, _BufReader_eof, "f")) {
            return null;
        }
        else if (avail < n && __classPrivateFieldGet(this, _BufReader_eof, "f")) {
            return __classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_r, "f") + avail);
        }
        else if (avail < n) {
            throw new BufferFullError(__classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_w, "f")));
        }
        return __classPrivateFieldGet(this, _BufReader_buf, "f").subarray(__classPrivateFieldGet(this, _BufReader_r, "f"), __classPrivateFieldGet(this, _BufReader_r, "f") + n);
    }
}
exports.BufReader = BufReader;
_BufReader_buf = new WeakMap(), _BufReader_rd = new WeakMap(), _BufReader_r = new WeakMap(), _BufReader_w = new WeakMap(), _BufReader_eof = new WeakMap(), _BufReader_fill = new WeakMap(), _BufReader_reset = new WeakMap();
class AbstractBufBase {
    constructor(buf) {
        Object.defineProperty(this, "buf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "usedBufferBytes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "err", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.buf = buf;
    }
    /** Size returns the size of the underlying buffer in bytes. */
    size() {
        return this.buf.byteLength;
    }
    /** Returns how many bytes are unused in the buffer. */
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    /** buffered returns the number of bytes that have been written into the
     * current buffer.
     */
    buffered() {
        return this.usedBufferBytes;
    }
}
/** BufWriter implements buffering for an deno.Writer object.
 * If an error occurs writing to a Writer, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.Writer.
 */
class BufWriter extends AbstractBufBase {
    /** return new BufWriter unless writer is BufWriter */
    static create(writer, size = DEFAULT_BUF_SIZE) {
        return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
    }
    constructor(writer, size = DEFAULT_BUF_SIZE) {
        super(new Uint8Array(size <= 0 ? DEFAULT_BUF_SIZE : size));
        _BufWriter_writer.set(this, void 0);
        __classPrivateFieldSet(this, _BufWriter_writer, writer, "f");
    }
    /** Discards any unflushed buffered data, clears any error, and
     * resets buffer to write its output to w.
     */
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        __classPrivateFieldSet(this, _BufWriter_writer, w, "f");
    }
    /** Flush writes any buffered data to the underlying io.Writer. */
    async flush() {
        if (this.err !== null)
            throw this.err;
        if (this.usedBufferBytes === 0)
            return;
        try {
            const p = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while (nwritten < p.length) {
                nwritten += await __classPrivateFieldGet(this, _BufWriter_writer, "f").write(p.subarray(nwritten));
            }
        }
        catch (e) {
            if (e instanceof Error) {
                this.err = e;
            }
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    /** Writes the contents of `data` into the buffer.  If the contents won't fully
     * fit into the buffer, those bytes that can are copied into the buffer, the
     * buffer is the flushed to the writer and the remaining bytes are copied into
     * the now empty buffer.
     *
     * @return the number of bytes written to the buffer.
     */
    async write(data) {
        if (this.err !== null)
            throw this.err;
        if (data.length === 0)
            return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while (data.byteLength > this.available()) {
            if (this.buffered() === 0) {
                // Large write, empty buffer.
                // Write directly from data to avoid copy.
                try {
                    numBytesWritten = await __classPrivateFieldGet(this, _BufWriter_writer, "f").write(data);
                }
                catch (e) {
                    if (e instanceof Error) {
                        this.err = e;
                    }
                    throw e;
                }
            }
            else {
                numBytesWritten = (0, mod_js_1.copy)(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = (0, mod_js_1.copy)(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
exports.BufWriter = BufWriter;
_BufWriter_writer = new WeakMap();
/** BufWriterSync implements buffering for a deno.WriterSync object.
 * If an error occurs writing to a WriterSync, no more data will be
 * accepted and all subsequent writes, and flush(), will return the error.
 * After all data has been written, the client should call the
 * flush() method to guarantee all data has been forwarded to
 * the underlying deno.WriterSync.
 */
class BufWriterSync extends AbstractBufBase {
    /** return new BufWriterSync unless writer is BufWriterSync */
    static create(writer, size = DEFAULT_BUF_SIZE) {
        return writer instanceof BufWriterSync
            ? writer
            : new BufWriterSync(writer, size);
    }
    constructor(writer, size = DEFAULT_BUF_SIZE) {
        super(new Uint8Array(size <= 0 ? DEFAULT_BUF_SIZE : size));
        _BufWriterSync_writer.set(this, void 0);
        __classPrivateFieldSet(this, _BufWriterSync_writer, writer, "f");
    }
    /** Discards any unflushed buffered data, clears any error, and
     * resets buffer to write its output to w.
     */
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        __classPrivateFieldSet(this, _BufWriterSync_writer, w, "f");
    }
    /** Flush writes any buffered data to the underlying io.WriterSync. */
    flush() {
        if (this.err !== null)
            throw this.err;
        if (this.usedBufferBytes === 0)
            return;
        try {
            const p = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while (nwritten < p.length) {
                nwritten += __classPrivateFieldGet(this, _BufWriterSync_writer, "f").writeSync(p.subarray(nwritten));
            }
        }
        catch (e) {
            if (e instanceof Error) {
                this.err = e;
            }
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    /** Writes the contents of `data` into the buffer.  If the contents won't fully
     * fit into the buffer, those bytes that can are copied into the buffer, the
     * buffer is the flushed to the writer and the remaining bytes are copied into
     * the now empty buffer.
     *
     * @return the number of bytes written to the buffer.
     */
    writeSync(data) {
        if (this.err !== null)
            throw this.err;
        if (data.length === 0)
            return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while (data.byteLength > this.available()) {
            if (this.buffered() === 0) {
                // Large write, empty buffer.
                // Write directly from data to avoid copy.
                try {
                    numBytesWritten = __classPrivateFieldGet(this, _BufWriterSync_writer, "f").writeSync(data);
                }
                catch (e) {
                    if (e instanceof Error) {
                        this.err = e;
                    }
                    throw e;
                }
            }
            else {
                numBytesWritten = (0, mod_js_1.copy)(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = (0, mod_js_1.copy)(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
exports.BufWriterSync = BufWriterSync;
_BufWriterSync_writer = new WeakMap();
/** Generate longest proper prefix which is also suffix array. */
function createLPS(pat) {
    const lps = new Uint8Array(pat.length);
    lps[0] = 0;
    let prefixEnd = 0;
    let i = 1;
    while (i < lps.length) {
        if (pat[i] == pat[prefixEnd]) {
            prefixEnd++;
            lps[i] = prefixEnd;
            i++;
        }
        else if (prefixEnd === 0) {
            lps[i] = 0;
            i++;
        }
        else {
            prefixEnd = lps[prefixEnd - 1];
        }
    }
    return lps;
}
/** Read delimited bytes from a Reader. */
async function* readDelim(reader, delim) {
    // Avoid unicode problems
    const delimLen = delim.length;
    const delimLPS = createLPS(delim);
    const chunks = new bytes_list_js_1.BytesList();
    const bufSize = Math.max(1024, delimLen + 1);
    // Modified KMP
    let inspectIndex = 0;
    let matchIndex = 0;
    while (true) {
        const inspectArr = new Uint8Array(bufSize);
        const result = await reader.read(inspectArr);
        if (result === null) {
            // Yield last chunk.
            yield chunks.concat();
            return;
        }
        else if (result < 0) {
            // Discard all remaining and silently fail.
            return;
        }
        chunks.add(inspectArr, 0, result);
        let localIndex = 0;
        while (inspectIndex < chunks.size()) {
            if (inspectArr[localIndex] === delim[matchIndex]) {
                inspectIndex++;
                localIndex++;
                matchIndex++;
                if (matchIndex === delimLen) {
                    // Full match
                    const matchEnd = inspectIndex - delimLen;
                    const readyBytes = chunks.slice(0, matchEnd);
                    yield readyBytes;
                    // Reset match, different from KMP.
                    chunks.shift(inspectIndex);
                    inspectIndex = 0;
                    matchIndex = 0;
                }
            }
            else {
                if (matchIndex === 0) {
                    inspectIndex++;
                    localIndex++;
                }
                else {
                    matchIndex = delimLPS[matchIndex - 1];
                }
            }
        }
    }
}
exports.readDelim = readDelim;
/** Read delimited strings from a Reader. */
async function* readStringDelim(reader, delim, decoderOpts) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder(decoderOpts?.encoding, decoderOpts);
    for await (const chunk of readDelim(reader, encoder.encode(delim))) {
        yield decoder.decode(chunk);
    }
}
exports.readStringDelim = readStringDelim;
/** Read strings line-by-line from a Reader. */
async function* readLines(reader, decoderOpts) {
    const bufReader = new BufReader(reader);
    let chunks = [];
    const decoder = new TextDecoder(decoderOpts?.encoding, decoderOpts);
    while (true) {
        const res = await bufReader.readLine();
        if (!res) {
            if (chunks.length > 0) {
                yield decoder.decode((0, mod_js_1.concat)(...chunks));
            }
            break;
        }
        chunks.push(res.line);
        if (!res.more) {
            yield decoder.decode((0, mod_js_1.concat)(...chunks));
            chunks = [];
        }
    }
}
exports.readLines = readLines;
