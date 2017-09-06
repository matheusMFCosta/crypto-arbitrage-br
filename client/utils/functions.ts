export abstract class Operation {
    abstract type: string;
    validate?: Function;
    process?: Function;
    Reduce?: Function;
    payload?: any;
}

type Partial<T> = { [P in keyof T]?: T[P] };

export function assign<T>(state: T, patch: Partial<T>): T {
    return Object.assign({}, state, patch);
}
