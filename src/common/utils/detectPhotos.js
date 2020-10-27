import { Platform, PermissionsAndroid } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { QRCodeImage, VideoMeta } from 'react-native-vod';
import { appStore } from '@src/store';
import { parseQuery } from '../helper';

function checkPermission() {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: '需要访问您的相册',
                message: '为了更好的体验，需要您开启该权限',
            }).then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // console.log('安卓 权限OK');\
                    resolve();
                } else {
                    // console.log('安卓 Photos permission denied');
                    reject();
                }
            });
        } else {
            resolve();
        }
    });
}

export async function detectPhotos() {
    try {
        await checkPermission();
    } catch (error) {
        return;
    }

    const result = await CameraRoll.getPhotos({
        first: 3,
        assetType: 'All',
    });
    const photos = result.edges;
    return processPhotos(photos);

    async function processPhotos(photos: string[]) {
        let result;
        for (let index = 0; index < photos.length; index++) {
            const mediaUrl = photos[index]?.node.image.uri;
            const type = String(photos[index]?.node.type).slice(0, 5);
            if (appStore.detectedFileInfo.includes(mediaUrl)) {
                continue;
            }
            if (type === 'image') {
                result = await detectPhotoQRCode(mediaUrl);
            } else if (type === 'video') {
                result = await detectVideoMeta(mediaUrl);
            }
            if (result) {
                break;
            }
        }
        return result;
    }

    function detectVideoMeta(videoUrl) {
        return new Promise((resolve, reject) => {
            return VideoMeta.fetchMeta(videoUrl?.replace('file://', ''), (res) => {
                if (res) {
                    resolve({
                        type: 'post',
                        uuid: String(res).slice(5),
                        url: videoUrl,
                        fileType: 'video',
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }

    function detectPhotoQRCode(photoUrl) {
        return new Promise((resolve, reject) => {
            QRCodeImage.decode(photoUrl, (res) => {
                const qrInfo = String(res);
                if (qrInfo.indexOf('http') !== -1) {
                    const params = parseQuery(qrInfo);
                    // https://yxsp.haxifang.cn/share/post/10394?post_id=2&user_id=1
                    // { post_id, user_id }
                    if (qrInfo.indexOf('/post/') !== -1 && params?.post_id) {
                        resolve({
                            type: 'post',
                            post_id: params?.post_id,
                            user_id: params?.user_id,
                            url: photoUrl,
                            fileType: 'image',
                        });
                    } else if (qrInfo.indexOf('/user/') !== -1 && params?.user_id) {
                        resolve({
                            type: 'user',
                            user_id: user_id,
                            url: photoUrl,
                            fileType: 'image',
                        });
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        });
    }
}
