import { Dimensions, Platform, StatusBar, PixelRatio } from 'react-native';
import Loading from '../../components/Popup/Loading';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { fs } = RNFetchBlob;
const { dirs } = fs;
const FILE_PATH = Platform.OS === 'android' ? dirs.DCIMDir : dirs.DocumentDir;

interface VideoInfo {
    url: string;
    title?: string;
}

interface DownloadProps extends VideoInfo {
    onSuccess?: (p?: any) => any;
    onFailed?: (p?: any) => any;
}

// 外部储存读取权限
// PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE

export function download({ url, title, onSuccess, onFailed }: DownloadProps) {
    if (Platform.OS === 'android') {
        // 外部储存写入权限
        check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result: any) => {
            if (result === RESULTS.GRANTED) {
                downloadVideo({ url, title });
            } else {
                request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(() => {
                    download({ url, title, onSuccess, onFailed });
                });
            }
        });
    } else {
        downloadVideo({ url, title });
    }
}

// fs.exists(FILE_PATH + '/' + title + '.mp4')
//     .then((exist) => {
//         if (exist) {
//             Toast.show({
//                 content: '视频已经存在',
//             });
//         } else {
//             downloadVideo();
//         }
//     })
//     .catch(() => {
//         downloadVideo();
//     });

function downloadVideo({ url, title }: VideoInfo) {
    return new Promise((resolve, reject) => {
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
                } else {
                    CameraRoll.save(filePath, 'video');
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
    });
}
