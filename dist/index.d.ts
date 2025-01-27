import { Writable } from 'svelte/store';

interface Serializer<T> {
    parse(text: string): T;
    stringify(object: T): string;
}
interface Storage {
    valueOf: () => string;
    [key: string]: any;
}
type StorageType = 'local' | 'session' | Storage;
interface Options<T> {
    serializer?: Serializer<T>;
    storage?: StorageType;
    syncTabs?: boolean;
    onError?: (e: unknown) => void;
}
/** @deprecated `writable()` has been renamed to `persisted()` */
declare function writable<T>(key: string, initialValue: T, options?: Options<T>): Writable<T>;
declare function persisted<T>(key: string, initialValue: T, options?: Options<T>): Writable<T>;

export { Options, Serializer, Storage, StorageType, persisted, writable };
