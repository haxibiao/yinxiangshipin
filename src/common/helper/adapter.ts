export function syncGetter(str: string, data: any): any {
    if (data === null || data === undefined || typeof data !== 'object') return null;
    let result: any = { ...data };
    const keys: string[] = str.split('.');
    for (const key of keys) {
        if (result[key] !== undefined && result[key] !== null) {
            result = result[key];
        } else {
            return undefined;
        }
    }
    return result;
}
