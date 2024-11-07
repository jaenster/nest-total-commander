export type AsyncEventType<T> = {
    [P in keyof T]: T[P];
}