let str = `<svg t="1606125490232" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3412" width="150" height="150"><path d="M885.333333 512a372.864 372.864 0 0 0-165.290666-310.037333 32 32 0 1 1 35.712-53.12A436.864 436.864 0 0 1 949.333333 512c0 241.536-195.797333 437.333333-437.333333 437.333333-28.501333 0-42.794667-34.474667-22.613333-54.613333l75.989333-76.010667a32 32 0 0 1 45.248 45.248l-11.029333 11.050667C763.52 835.584 885.333333 688 885.333333 512z m-746.666666 0a372.906667 372.906667 0 0 0 167.466666 311.509333 32 32 0 0 1-35.328 53.333334A436.885333 436.885333 0 0 1 74.666667 512C74.666667 270.464 270.464 74.666667 512 74.666667c28.501333 0 42.794667 34.474667 22.613333 54.613333l-75.989333 76.010667a32 32 0 0 1-45.248-45.248l11.029333-11.050667C260.48 188.416 138.666667 336 138.666667 512z" fill="#000000" p-id="3413"></path></svg>`;

function getPath() {
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

getPath();
