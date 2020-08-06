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

export function isObject(o: any) {
    return o !== null && (typeof o === 'object' || typeof o === 'function');
}

// const o1 = { a: 1, b: { c: 3, d: [1, 2, 3], e: { f: 4 } }, g: 5, h: 6 };
// const o2 = { a: 1, b: { c: 3, d: [1, 2, 3], e: { f: 5 } }, g: 6, i: 7 };
// mergeProperty(o1,o2) //output: { a: 1, b: { c: 3, d: [1, 2, 3, 4, 5, 6], e: { f: 5 } }, g: 6, h: 6, i: 7 }
export function mergeProperty(obj1: any, obj2: any) {
    if (!(isObject(obj1) || isObject(obj2))) {
        return obj1;
    }

    const copyObj1 = Array.isArray(obj1) ? [...obj1] : { ...obj1 };
    const copyObj2 = Array.isArray(obj2) ? [...obj2] : { ...obj2 };
    if (Array.isArray(copyObj1)) {
        copyObj1.push(...copyObj2);
    } else {
        for (const key of Object.keys(copyObj2)) {
            if (isObject(copyObj2[key])) {
                if (!copyObj1[key]) Object.assign(copyObj1, { [key]: Array.isArray(copyObj2[key]) ? [] : {} });
                copyObj1[key] = mergeProperty(copyObj1[key], copyObj2[key]);
            } else {
                copyObj1[key] = copyObj2[key];
            }
        }
    }

    return copyObj1;
}
