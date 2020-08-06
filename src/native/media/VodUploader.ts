import { NativeModules, DeviceEventEmitter, NativeEventEmitter, Platform } from 'react-native';

export type UploadEvent = 'resultVideo' | 'videoProgress';

const module = Platform.OS === 'android' ? NativeModules.VodVideoUploader : NativeModules.VodUploader;
const eventPrefix = 'VodUploader-';
const deviceEmitter = Platform.OS === 'android' ? DeviceEventEmitter : module ? new NativeEventEmitter(module) : null;

export const startUpload = (signature: string, videoPath: string): Promise<string> =>
    module.beginUpload(signature, videoPath);

export const addListener = (eventType: UploadEvent, listener: Function) => {
    if (!deviceEmitter) {
        return Toast.show({ content: '上传失败' });
    }
    return deviceEmitter.addListener(eventPrefix + eventType, (data: any) => {
        // console.log(data);
        if (data) {
            listener(data);
        }
    });
};

export default {
    addListener,
    startUpload,
};
