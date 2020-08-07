import React from 'react'
import VodUploader from 'react-native-vod';

export type UploadOption = {
    videoPath?: string;
    onBeforeUpload?: Function;
    onStarted?: (uploadId?: string) => void;
    onProcess?: (val: number) => void;
    onCancelled?: Function;
    onCompleted?: (val: any) => void;
    onError?: () => void;
};

export function videoUpload(props: UploadOption) {
    let { videoPath, onBeforeUpload, onStarted, onProcess, onCancelled, onCompleted, onError } = props;

    fetch(Config.ServerRoot + '/api/signature/vod-' + Config.Name, { method: 'GET' })
        .then(response => {
            console.log('response', response);
            if (response.status < 200 || response.status > 300) {
                onError && onError();
            } else {
                return response.text();
            }
        })
        .then(res => {
            if (!res) return;
            // console.log('res', res);
            onStarted && onStarted();
            onStarted = null;

            VodUploader({
                signature: res || '',
                videoPath,
                onError: () => {
                    onError && onError();
                    onError = null;
                },
                onProcess: (progerss: number) => {
                    // const progerss = (data.upload_bytes / data.total_bytes) * 100;
                    // console.log('上传进度原生端信息 : ', progerss);
                    onProcess && onProcess(progerss || 0);
                    if (progerss === 100) onProcess = null;
                },
                onCompleted: (data: any) => {
                    // console.log('resultVideo', data);
                    onCompleted && onCompleted(data);
                    onCompleted = null;
                }
            });
        })
        .catch(error => {
            onError && onError();
            onError = null;
            console.log('提示', error);
        });
}
