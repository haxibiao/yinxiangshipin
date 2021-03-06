export function count(value: any) {
    const num: number = parseFloat(value);
    if (num >= 10000) {
        return Number((num / 10000).toFixed(1)) + 'w';
    } else if (num > 0) {
        return num.toFixed(0);
    } else {
        return 0;
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
    const zero = function (v: number) {
        return v >> 0 < 10 ? '0' + v : v;
    };
    const arr = [zero(m), zero(s)];
    h > 0 && arr.unshift(zero(h));
    return arr.join(':');
}

export function goldExchange(gold: number, rate = 500) {
    return Number((gold / rate).toFixed(2));
}

export const numberConvertToUppercase = (function numberConvert() {
    return function (num: number) {
        num = Number(num);
        const upperCaseNumber = [
            '零',
            '一',
            '二',
            '三',
            '四',
            '五',
            '六',
            '七',
            '八',
            '九',
            '十',
            '百',
            '千',
            '万',
            '亿',
        ];
        const length = String(num).length;
        if (length == 1) {
            return upperCaseNumber[num];
        } else if (length == 2) {
            if (num == 10) {
                return upperCaseNumber[num];
            } else if (num > 10 && num < 20) {
                return '十' + upperCaseNumber[String(num).charAt(1)];
            } else {
                return (
                    upperCaseNumber[String(num).charAt(0)] +
                    '十' +
                    upperCaseNumber[String(num).charAt(1)].replace('零', '')
                );
            }
        }
    };
})();
