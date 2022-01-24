export type UnwrapPromiseLike<T> = T extends PromiseLike<infer U> ? U : T;

export type AsyncReturnType<T> = T extends (...args: any[]) => infer R | PromiseLike<infer R>
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
