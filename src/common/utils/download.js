import { Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';
import ProgressOverlay from '../../components/Popup/ProgressOverlay';
import RNFetchBlob from 'rn-fetch-blob';

export function download({ url, title, onSuccess, onFailed }) {
    return new Promise((resolve, reject) => {
        const dirs = RNFetchBlob.fs.dirs;
        ProgressOverlay.show('正在下载...');
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
                ProgressOverlay.progress((received / total) * 100);
            })
            .then(res => {
                if (Platform.OS === 'android') {
                    RNFetchBlob.fs.scanFile([{ path: res.path(), mime: 'video/mp4' }]);
                }
                // the temp file path
                console.log('The file saved to ', res.path());
                ProgressOverlay.hide();
                Toast.show({
                    content: '下载成功',
                });
                resolve(res.path());
            })
            .catch(error => {
                ProgressOverlay.hide();
                Toast.show({
                    content: '下载失败',
                });
                reject(error);
            });
    });
}
