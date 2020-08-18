import { Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';
import Loading from '../../components/Popup/Loading';
import RNFetchBlob from 'rn-fetch-blob';

const { fs } = RNFetchBlob;
const { dirs } = fs;
const FILE_PATH = Platform.OS === 'android' ? dirs.DCIMDir : dirs.DocumentDir;

export function download({ url, title, onSuccess, onFailed }) {
    title = title || new Date().getTime();
    return new Promise((resolve, reject) => {
        Loading.show('正在下载...');
        RNFetchBlob.config({
            // useDownloadManager: true,
            path: FILE_PATH + '/' + title + '.mp4',
        })
            .fetch('GET', url, {
                'Content-Type': 'video/mp4',
            })
            // listen to download progress event
            .progress((received, total) => {
                // (received / total) * 100
            })
            .then((res) => {
                const filePath = res.path();
                console.log('The file saved to ', filePath);
                if (Platform.OS === 'android') {
                    fs.scanFile([{ path: filePath, mime: 'video/mp4' }]);
                }
                fs.exists(filePath)
                    .then((exist) => {
                        console.log(`file ${exist ? '' : 'not'} exists`);
                    })
                    .catch(() => {});

                Loading.hide();
                Toast.show({
                    content: '下载成功',
                });
                resolve(filePath);
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
