// 网络状态
export const getNetInfoStatus = (netInfo: any): Record<string, any> => {
    const { type } = netInfo;
    return {
        isConnect: type.toUpperCase() === 'WIFI' || type.toUpperCase() === 'CELLULAR',
        isWifi: type.toUpperCase() === 'WIFI',
        isCellular: type.toUpperCase() === 'CELLULAR',
    };
};

// 获取文本中的链接
export function getURLsFromString(str: string): string[] {
    var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?\w*)?)/gm;
    var m;
    var arr = [];
    while ((m = re.exec(str)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        arr.push(m[0]);
    }
    return arr;
}

// 获取url参数
export function parseQuery(url: string) {
    var queryObj: any = {};
    var reg = /[?&]([^=&#]+)=([^&#]*)/g;
    var queryParams = url.match(reg);
    if (queryParams) {
        for (var i in queryParams) {
            var query = queryParams[i].split('=');
            var key = query[0].substr(1),
                value = query[1];
            queryObj[key] ? (queryObj[key] = [].concat(queryObj[key], value)) : (queryObj[key] = value);
        }
    }
    return queryObj;
}
