import ProgressOverlay from '@src/components/Popup/ProgressOverlay';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const handleDownload = () => {
    ProgressOverlay.show('正在下载懂得赚...');
    const android = RNFetchBlob.android;
    const dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
        path: dirs.DownloadDir + '/' + 'dongdezhuan' + '.apk',
        fileCache: true,
        appendExt: 'apk',
    })
        .fetch('GET', 'http://dongdezhuan-1254284941.cos.ap-guangzhou.myqcloud.com/dongdezhuan-release.apk')
        .progress((received, total) => {
            ProgressOverlay.progress((received / total) * 100);
        })
        .then(res => {
            if (Platform.OS === 'android') {
                RNFetchBlob.fs.scanFile([{ path: res.path(), mime: 'application/vnd.android.package-archive' }]);
            }
            console.log('The file saved to ', res.path());
            ProgressOverlay.hide();
            android.actionViewIntent(res.path(), 'application/vnd.android.package-archive');
        })
        .catch(() => {
            ProgressOverlay.hide();
            Toast.show({
                content: '下载失败',
            });
        });
};

export async function downloadApk() {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            handleDownload();
        } else {
            Toast.show({
                content: '安装失败，未获取下载安全权限，请重试',
                duration: 2000,
            });
        }
    } catch (err) {
        console.warn(err);
    }
}
