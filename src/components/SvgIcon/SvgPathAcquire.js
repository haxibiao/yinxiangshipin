const svgXML = `<svg t="1609905216053" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4991" width="64" height="64"><path d="M329.525 173.41366667l56.285-58.261 393.996 392.021-393.996 392.021-56.285-58.261 331.786-333.761z" p-id="4992"></path></svg>`;

function getPath(str) {
    let prefix = '<path d="',
        plen = 9,
        suffix = '" p-id="',
        slen = 8;
    let strlen = str.length;
    let width_i = str.indexOf('width');
    str = str.substr(width_i, strlen - width_i - 1);
    //console.log("修剪后的str 为 : ",str);
    let out = [];
    let round = 1;
    while (true) {
        let strlen = str.length;
        let p = str.indexOf(prefix);
        if (p < 0) break; //遍历结束
        let s = str.indexOf(suffix);
        let sub = str.substr(p + plen, s - p - slen - 1); //目标子串
        //console.log("第"+round+"轮中获取到的路径数据: ",sub);
        out.push(sub);
        str = str.substr(s + 8, strlen - s);
        //console.log("第"+round+"轮结束后截取的剩余字符串为: ",str);
    }
    console.log(out);
}

// getPath(svgXML);
