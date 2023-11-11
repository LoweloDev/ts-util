export type Class<T> = new (...args: any[]) => T;
export type Callback<T> = (...args: any[]) => T;