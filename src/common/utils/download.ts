import { Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';
import Loading from '../../components/Popup/Loading';
import RNFetchBlob from 'rn-fetch-blob';

const { fs } = RNFetchBlob;
const { dirs } = fs;
const FILE_PATH = Platform.OS === 'android' ? dirs.DCIMDir : dirs.DocumentDir;

interface Props {
    url: string;
    title?: string;
    onSuccess?: (p?: any) => any;
    onFailed?: (p?: any) => any;
}

export function download({ url, title, onSuccess, onFailed }: Props) {
    title = String(title || new Date().getTime()).trim();
    return new Promise((resolve, reject) => {
        fs.exists(FILE_PATH + '/' + title + '.mp4')
            .then((exist) => {
                if (exist) {
                    Toast.show({
                        content: '视频已经存在',
                    });
                } else {
                    startDownload();
                }
            })
            .catch(() => {
                startDownload();
            });

        function startDownload() {
            Loading.show('正在下载...');
            RNFetchBlob.config({
                // useDownloadManager: true,
                fileCache: true,
                path: FILE_PATH + '/' + title + '.mp4',
            })
                .fetch('GET', url, {
                    'Content-Type': 'video/mp4',
                })
                .progress((received, total) => {
                    // (received / total) * 100
                })
                .then((res) => {
                    const filePath = res.path();
                    // console.log('The file saved to ', filePath);
                    if (Platform.OS === 'android') {
                        fs.scanFile([{ path: filePath, mime: 'video/mp4' }]);
                    }
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
        }
    });
}
