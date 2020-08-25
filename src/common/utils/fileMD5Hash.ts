import RNFetchBlob from 'rn-fetch-blob';
export function fileHash(filePath: string, callback: (err?: Error, p?: string) => any) {
    RNFetchBlob.fs
        .hash(filePath, 'md5')
        .then((hash) => {
            callback(undefined, hash);
        })
        .catch((err) => {
            callback(err, undefined);
        });
}

// const crypto = require('crypto');
// const fs = require('fs');

// export function fileHash(filePath: string, callback: (err?: Error, p?: string) => any) {
//     //从文件创建一个可读流
//     var stream = fs.createReadStream(filePath);
//     var fsHash = CryptoJS.createHash('md5');

//     stream.on('data', function data(d) {
//         fsHash.update(d);
//     });

//     stream.on('end', function end() {
//         var md5 = fsHash.digest('hex');
//         console.log('文件的MD5是：%s', md5);
//         callback(undefined, md5);
//     });

//     stream.on('error', function error(err) {
//         callback(err);
//     });
// }
