import test from "ava";
import {allAsync} from "./index";

test("allAsync", async t => {
    const a = Promise.resolve(1 as const);
    const b = Promise.resolve(2 as const);
    const c = Promise.resolve(3 as const);
    return allAsync([a, b, c] as const).then(([a, b, c]: readonly [1, 2, 3]) => {
        t.is(a, 1);
        t.is(b, 2);
        t.is(c, 3);
    });
});
