import { Platform, PermissionsAndroid, NativeModules } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
// import { QRreader } from 'react-native-qr-scanner';

export async function detectPhotos() {
    console.log('进入相册');
    let r = await CameraRoll.getPhotos({
        first: 1,
        assetType: 'Photos',
    });

    let photos = r.edges;
    console.log('相册图片top1:', { photos });

    for (var i = 0; i < photos.length; i++) {
        let photo = photos[i];
        console.log(photo);
        let path = photo.node.image.uri;

        //promise...
        let decodePromise = new Promise((resolve, reject) => {
            console.log('进入decodePromise了XXXXX', path);
            // QRreader(path)
            //     .then((data) => {
            //         console.log('识别成功');
            //         return resolve(data);
            //     })
            //     .catch((err) => {
            //         console.log('识别失败');
            //         return resolve(false);
            //     });
           
            //     if (result) {
            //         if (result.indexOf('/video/') !== -1 || result.indexOf('/post/') !== -1) {
            //             let post_id = result
            //                 .replace(Config.ServerRoot, '')
            //                 .replace('/video/', '')
            //                 .replace('/post/', '');
            //             console.log('视频post id:', post_id);
            //             if (!isNaN(post_id)) {
            //                 let info = {
            //                     type: 'video',
            //                     id: post_id,
            //                 };
            //                 return resolve(info);
            //             }
            //         }
            //         if (result.indexOf('/user/') !== -1) {
            //             let user_id = result.replace(Config.ServerRoot, '').replace('/user/', '');
            //             console.log('用户id:', user_id);
            //             if (!isNaN(user_id)) {
            //                 let info = {
            //                     type: 'user',
            //                     id: user_id,
            //                 };
            //                 return resolve(info);
            //             }
            //         }
            //     }
            //     return resolve(false);

        });
        return await decodePromise;
    }
    return null;
}
