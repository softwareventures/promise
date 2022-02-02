export type UnwrapPromiseLike<T> = T extends PromiseLike<infer U> ? U : T;

export type AsyncReturnType<T> = T extends (...args: unknown[]) => infer R | PromiseLike<infer R>
    ? R
    : never;

type AllAsync<T extends Iterable<unknown>> = T extends readonly unknown[]
    ? Promise<{[K in keyof T]: UnwrapPromiseLike<T[K]>}>
    : T extends Iterable<infer U | PromiseLike<infer U>>
    ? Promise<U[]>
    : never;

export function allAsync<T extends Iterable<unknown>>(values: T): AllAsync<T> {
    return Promise.all(values) as unknown as AllAsync<T>;
}

type SequenceAsync<T extends Iterable<() => unknown>> = T extends readonly unknown[]
    ? {[K in keyof T]: T[K] extends () => unknown ? AsyncReturnType<T[K]> : T[K]}
    : T extends Iterable<() => infer U | PromiseLike<infer U>>
    ? U[]
    : never;

export async function sequenceAsync<T extends Iterable<() => unknown>>(
    actions: T
): Promise<SequenceAsync<T>> {
    const result = [];
    for (const action of actions) {
        result.push(await action());
    }
    return result as SequenceAsync<T>;
}

export function applyAsync<TA, TResult>(
    promise: Promise<(a: TA) => TResult>
): (a: TA) => Promise<TResult> {
    return async a => promise.then(f => f(a));
}
