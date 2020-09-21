import { Platform, PermissionsAndroid } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { QRCodeImage } from 'react-native-vod';
import { appStore } from '@src/store';
import { parseQuery } from '../helper';

export async function detectPhotos() {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: '需要访问您的相册',
            message: '为了更好的体验，需要您开启该权限',
        });
    }
    const result = await CameraRoll.getPhotos({
        first: 3,
        assetType: 'Photos',
    });
    const photos = result.edges;
    // const firstPhoto = photos[0]?.node.image.uri;

    return processQRCodePhotos(photos);

    async function processQRCodePhotos(photos: string[]) {
        for (let index = 0; index < photos.length; index++) {
            const photo = photos[index]?.node.image.uri;
            const result = await detectPhotoQRCode(photo);
            if (result) {
                return result;
            }
        }
    }

    function detectPhotoQRCode(photo) {
        return new Promise((resolve, reject) => {
            QRCodeImage.decode(photo, (res) => {
                const qrInfo = String(res);
                if (qrInfo.indexOf('http') !== -1 && !appStore.detectedQRCodeRecord.includes(qrInfo)) {
                    const params = parseQuery(qrInfo);
                    // https://yxsp.haxifang.cn/share/post/10394?post_id=2&user_id=1
                    // { post_id, user_id }
                    if (qrInfo.indexOf('/post/') !== -1 && params?.post_id) {
                        resolve({
                            type: 'post',
                            post_id: params?.post_id,
                            user_id: params?.user_id,
                            qrInfo,
                        });
                    } else if (qrInfo.indexOf('/user/') !== -1 && params?.user_id) {
                        resolve({
                            type: 'user',
                            user_id: user_id,
                            qrInfo,
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
