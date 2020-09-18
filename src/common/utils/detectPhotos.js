import { Platform, PermissionsAndroid } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import { QRCodeImage } from 'react-native-vod';
import { parseQuery } from '../helper';

export async function detectPhotos() {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: '需要访问您的相册',
            message: '为了更好的体验，需要您开启该权限',
        });
    }
    const result = await CameraRoll.getPhotos({
        first: 1,
        assetType: 'Photos',
    });
    const photos = result.edges;
    const firstPhoto = photos[0]?.node.image.uri;

    return new Promise((resolve, reject) => {
        QRCodeImage.decode(firstPhoto, (result) => {
            // https://yxsp.haxifang.cn/share/post/10394?post_id=2&user_id=1
            // post_id，user_id
            const params = parseQuery(String(result));
            console.log('====================================');
            console.log('params', params);
            console.log('====================================');
            if (result.indexOf('/post/') !== -1 && params?.post_id) {
                resolve({
                    type: 'post',
                    post_id: params?.post_id,
                    user_id: params?.user_id,
                });
            } else if (result.indexOf('/user/') !== -1 && params?.user_id) {
                resolve({
                    type: 'user',
                    user_id: user_id,
                });
            } else {
                resolve(null);
            }
        });
    });

    //  TODO: occurred error: int android.graphics.Bitmap.getWidth()
    // return new Promise((resolve, reject) => {
    //     QRreader(firstPhoto)
    //         .then((data) => {
    //             console.log('data', data);
    //             return resolve(data);
    //         })
    //         .catch((err) => {
    //             console.log('err', err);
    //             return resolve(null);
    //         });
    // });

    // for (var i = 0; i < photos.length; i++) {
    //     const path = photos[i]?.node.image.uri;
    //     let decodePromise = new Promise((resolve, reject) => {
    //         QRreader(path)
    //             .then((data) => {
    //                 console.log('识别成功');
    //                 return resolve(data);
    //             })
    //             .catch((err) => {
    //                 console.log('识别失败');
    //                 return resolve(false);
    //             });

    //         if (result) {
    //             if (result.indexOf('/video/') !== -1 || result.indexOf('/post/') !== -1) {
    //                 let post_id = result.replace(Config.ServerRoot, '').replace('/video/', '').replace('/post/', '');
    //                 console.log('视频post id:', post_id);
    //                 if (!isNaN(post_id)) {
    //                     let info = {
    //                         type: 'video',
    //                         id: post_id,
    //                     };
    //                     return resolve(info);
    //                 }
    //             }
    //             if (result.indexOf('/user/') !== -1) {
    //                 let user_id = result.replace(Config.ServerRoot, '').replace('/user/', '');
    //                 console.log('用户id:', user_id);
    //                 if (!isNaN(user_id)) {
    //                     let info = {
    //                         type: 'user',
    //                         id: user_id,
    //                     };
    //                     return resolve(info);
    //                 }
    //             }
    //         }
    //         return resolve(false);
    //     });
    //     return await decodePromise;
    // }
    // return null;
}
