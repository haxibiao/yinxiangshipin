/*
 * created by wyk
 * vod 类后期可以添加vod更多能力...
 */
import VodUpload from 'react-native-vod';

type UploadEvent = 'resultVideo' | 'videoProgress';

type UploadOption = {
    videoPath: string;
    onBeforeUpload?: Function;
    onStarted?: Function;
    onProcess?: Function;
    onCompleted?: Function;
    onError?: Function;
};

function upload(props: UploadOption) {
    const { videoPath, onStarted, onProcess, onCompleted, onError } = props;

    fetch(Config.ServerRoot + '/api/signature/vod-' + Config.Name, { method: 'GET' })
        .then((response) => {
            if (response.status < 200 || response.status > 300) {
                throw new Error('签名获取失败');
            } else {
                return response.text();
            }
        })
        .then((res) => {
            if (onStarted instanceof Function) {
                onStarted(res);
            }
            VodUpload({
                signature: res,
                videoPath,
                onError: (error) => {
                    if (onError instanceof Function) {
                        onError(error);
                    }
                },
                onProcess: (progress: number) => {
                    if (onProcess instanceof Function) {
                        onProcess(progress);
                    }
                },
                onCompleted: (data: any) => {
                    if (onCompleted instanceof Function) {
                        onCompleted(data);
                    }
                },
            });
        })
        .catch((error) => {
            if (onError instanceof Function) {
                onError(error);
            }
        });
}

export default {
    upload,
};
