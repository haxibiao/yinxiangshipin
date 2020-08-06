export function debounce(fn: (p: any) => any, delay: number = 300) {
    let timer: ReturnType<typeof setTimeout>;
    return function debouncedFn(this: any, ...params: any[any]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, params);
        }, delay);
    };
}
