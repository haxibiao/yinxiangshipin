// keysChain：a property located deep within a chain of connected object
// obj: object
// obj: { key1: { key2: { keys3: null } } } => syncGetter('key1.key2.key3',obj)
export function syncGetter(keysChain: string, obj: any): any {
    if (obj === null || typeof obj !== 'object') return null;
    let result: any = { ...obj };
    const keys: string[] = keysChain.split('.');
    for (const key of keys) {
        if (result[key] !== undefined && result[key] !== null) {
            result = result[key];
        } else {
            return undefined;
        }
    }
    return result;
}
