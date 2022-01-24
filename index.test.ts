import test from "ava";
import {allAsync, applyAsync, sequenceAsync} from "./index";

test("allAsync", async t => {
    const a = Promise.resolve(1 as const);
    const b = Promise.resolve(2 as const);
    const c = Promise.resolve(3 as const);
    await allAsync([a, b, c] as const).then(([a, b, c]: readonly [1, 2, 3]) => {
        t.is(a, 1);
        t.is(b, 2);
        t.is(c, 3);
    });

    function* generate(): Iterable<Promise<number>> {
        yield Promise.resolve(1);
        yield Promise.resolve(2);
        yield Promise.resolve(3);
    }

    await allAsync(generate()).then(result => t.deepEqual(result, [1, 2, 3]));
});

test("sequenceAsync", async t => {
    let a: number[] = [];
    const b = async (): Promise<1> =>
        Promise.resolve()
            .then(() => a.push(1))
            .then(() => 1 as const);
    const c = async (): Promise<2> => {
        a.push(2);
        return 2 as const;
    };

    await sequenceAsync([b, c] as const).then(([b, c]: readonly [1, 2]) => {
        t.is(b, 1);
        t.is(c, 2);
    });

    t.deepEqual(a, [1, 2]);

    a = [];

    function* generate(): Iterable<() => Promise<number>> {
        yield b;
        yield c;
    }

    await sequenceAsync(generate()).then(([b, c]) => {
        t.is(b, 1);
        t.is(c, 2);
    });

    t.deepEqual(a, [1, 2]);
});

test("applyAsync", async t => {
    const f = Promise.resolve((a: number) => a + 1);
    t.is(await applyAsync(f)(2), 3);
});
