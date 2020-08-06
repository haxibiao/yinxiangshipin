export function count(value: any) {
    const num: number = parseFloat(value);
    if (num >= 1000) {
        return Math.round(Number((num / 1000).toFixed(2)) * 10) / 10 + 'k';
    } else {
        return num || 0;
    }
}

// time Format
export function moment(second: any) {
    let h = 0,
        m = 0,
        s = parseInt(second, 10);
    if (s > 60) {
        h = parseInt(String(second / 3600), 10);
        m = parseInt(String((second % 3600) / 60), 10);
        s = parseInt(String(second % 60), 10);
    }
    // 补零
    const zero = function(v: number) {
        return v >> 0 < 10 ? '0' + v : v;
    };
    const arr = [zero(m), zero(s)];
    h > 0 && arr.unshift(zero(h));
    return arr.join(':');
}

export function goldExchange(gold: number, rate = 1000) {
    return (gold / rate).toFixed(2);
}
