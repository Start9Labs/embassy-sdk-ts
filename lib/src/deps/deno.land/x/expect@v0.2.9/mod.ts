import * as dntShim from "../../../../_dnt.test_shims.js";
import * as m from "./mock.js";
export const mock = m;

export * from "./expect.js";
export function it(name: string, fn: () => void | Promise<void>) {
  dntShim.Deno.test({
    name,
    fn,
  });
}