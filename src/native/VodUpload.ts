/*
 * created by wyk
 */
import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from 'react-native';

const module = Platform.OS === 'android' ? NativeModules.VodVideoUploader : NativeModules.VodUploader;
const eventPrefix = 'VodUploader-';
const deviceEmitter = Platform.OS === 'android' ? DeviceEventEmitter : module ? new NativeEventEmitter(module) : null;

type UploadEvent = 'resultVideo' | 'videoProgress';

type UploadOption = {
    videoPath: string;
    onBeforeUpload?: Function;
    onStarted?: Function;
    onProcess?: Function;
    onCompleted?: Function;
    onError?: Function;
};

export const vodStartUpload = (signature: string, videoPath: string): Promise<string> =>
    module.beginUpload(signature, videoPath);

export const vodAddListener = (eventType: UploadEvent, listener: Function) => {
    if (!deviceEmitter) {
        throw new Error('上传失败');
    }
    return deviceEmitter.addListener(eventPrefix + eventType, (data: any) => {
        if (data) {
            listener(data);
        }
    });
};

export function videoUploadUtil(props: UploadOption) {
    const { videoPath, onStarted, onProcess, onCompleted, onError } = props;

    fetch(Config.ServerRoot + '/api/signature/vod-' + Config.Name, { method: 'GET' })
        .then((response) => {
            vodAddListener('videoProgress', (data: any) => {
                const progress = (data.upload_bytes / data.total_bytes) * 100;
                if (onProcess instanceof Function) {
                    onProcess(progress || 0);
                }
            });
            vodAddListener('resultVideo', (data: any) => {
                if (onCompleted instanceof Function) {
                    onCompleted(data);
                }
            });
            return response.text();
        })
        .then((res) => {
            if (onStarted instanceof Function) {
                onStarted(res);
            }
            vodStartUpload(res, videoPath).then((publishCode: any) => {
                if (publishCode != 0) {
                    // vod上传失败
                    if (onError instanceof Function) {
                        onError(publishCode);
                    }
                }
            });
        })
        .catch((error) => {
            if (onError instanceof Function) {
                onError(error);
            }
        });
}
