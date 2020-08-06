/*
 * @flow
 * created by wyk made in 2019-01-14 11:44:03
 */

import VideoUploader from './VideoUploader';
import VodUploader from './VodUploader';

export const { cancelUpload } = VideoUploader;

export type UploadOption = {
    videoPath: string;
    onBeforeUpload?: Function;
    onStarted?: Function;
    onProcess?: Function;
    onCancelled?: Function;
    onCompleted?: Function;
    onError?: Function;
};

export function videoUpload(props: UploadOption) {
    const { videoPath, onBeforeUpload, onStarted, onProcess, onCancelled, onCompleted, onError } = props;

    fetch(Config.ServerRoot + '/api/signature/vod-' + Config.Name, { method: 'GET' })
        .then(response => {
            VodUploader.addListener('videoProgress', (data: any) => {
                const progerss = (data.upload_bytes / data.total_bytes) * 100;
                console.log('上传结束原生端信息 : ', data);
                onProcess && onProcess(progerss || 0);
            });
            VodUploader.addListener('resultVideo', (data: any) => {
                console.log('resultVideo', data);
                onCompleted && onCompleted(data);
            });
            return response.text();
        })
        .then(res => {
            // console.log('res', res);
            onStarted && onStarted('111111');
            VodUploader.startUpload(res, videoPath).then((publishCode: any) => {
                console.log('publish code 的值为 : ', publishCode);
                if (publishCode != 0) {
                    // vod上传失败
                    Toast.show({ content: '视频上传失败，请稍后重试' });
                }
            });
        })
        .catch(error => {
            console.log('提示', error);
        });
}
