import { Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';
import Loading from '../../components/Popup/Loading';
import RNFetchBlob from 'rn-fetch-blob';

export function download({ url, title, onSuccess, onFailed }) {
    return new Promise((resolve, reject) => {
        const dirs = RNFetchBlob.fs.dirs;
        Loading.show('正在下载...');
        RNFetchBlob.config({
            // useDownloadManager: true,
            path: dirs.DCIMDir + '/' + title + '.mp4',
            fileCache: true,
            appendExt: 'mp4',
        })
            .fetch('GET', url, {
                //headers
            })
            // listen to download progress event
            .progress((received, total) => {
                // (received / total) * 100
                Loading.hide();
            })
            .then((res) => {
                if (Platform.OS === 'android') {
                    RNFetchBlob.fs.scanFile([{ path: res.path(), mime: 'video/mp4' }]);
                }
                // the temp file path
                console.log('The file saved to ', res.path());
                Loading.hide();
                Toast.show({
                    content: '下载成功',
                });
                resolve(res.path());
            })
            .catch((error) => {
                Loading.hide();
                Toast.show({
                    content: '下载失败',
                });
                reject(error);
            });
    });
}
