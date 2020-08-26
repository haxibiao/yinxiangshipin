import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import { vod } from '@src/native';
import { Loading } from '@src/components';
import { fileHash } from '@src/common';

const { fs } = RNFetchBlob;
const { dirs } = fs;
const FILE_PATH = Platform.OS === 'android' ? dirs.DCIMDir : dirs.DocumentDir;

interface Props {
    shareBody: {
        url: string;
        cover: string;
        title: string;
    };
    onSuccess: (p?: any) => any;
    onFailed: (p?: any) => any;
}

export const useResolveContent = ({ shareBody, onSuccess, onFailed }: Props) => {
    const uploadVideo = useCallback(
        (videoPath) => {
            Loading.show('视频上传中');
            vod.upload({
                videoPath,
                onStarted: () => null,
                onProcess: (progress: number) => {},
                onCompleted: (data: any) => {
                    // console.log('onCompleted data', data);
                    if (data.video_id) {
                        Loading.hide();
                        // console.log('====================================');
                        // console.log('uploadVideo onSuccess', shareBody?.url, data.video_id);
                        // console.log('====================================');
                        onSuccess({
                            id: data.video_id,
                            path: shareBody?.url,
                            cover: shareBody?.cover,
                        });
                    } else {
                        Loading.hide();
                        onFailed(data);
                    }
                },
                onError: (error: any) => {
                    Loading.hide();
                    onFailed(error);
                },
            });
        },
        [onSuccess, onFailed],
    );

    const shareVideo = useCallback(() => {
        if (Platform.OS === 'android') {
            // 外部储存写入权限获取
            check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result: any) => {
                if (result === RESULTS.GRANTED) {
                    downloadVideoGetFileId();
                } else {
                    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result: any) => {
                        shareVideo();
                    });
                }
            });
        } else {
            downloadVideoGetFileId();
        }

        function downloadVideoGetFileId() {
            downloadVideo(shareBody?.url, shareBody?.title)
                .then((path) => {
                    getQCVodFileId(path)
                        .then((fileId) => {
                            Loading.hide();
                            // console.log('====================================');
                            // console.log('getQCVodFileId onSuccess', shareBody?.url, data.video_id);
                            // console.log('====================================');
                            onSuccess({
                                id: fileId,
                                path: shareBody?.url,
                                cover: shareBody?.cover,
                                title: shareBody?.title,
                            });
                        })
                        .catch((err) => {
                            Loading.hide();
                            uploadVideo(path);
                        });
                })
                .catch((err) => {
                    Loading.hide();
                    onFailed(err);
                });
        }
    }, [shareBody, onSuccess, onFailed]);

    return shareVideo;
};
//
function getQCVodFileId(videoPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fileHash(videoPath, (error: any, md5Hash: string) => {
            if (md5Hash) {
                fetch(`http://yxsp.haxifang.cn/api/video/hash/${md5Hash}`)
                    .then((response) => response.text())
                    .then((res) => {
                        // console.log('md5Hash', md5Hash, res);
                        if (res) {
                            resolve(res);
                        } else {
                            reject(error);
                        }
                    })
                    .catch((err) => {
                        // console.log('err', err);
                        reject(err);
                    });
            } else {
                reject(error);
            }
        });
    });
}

function downloadVideo(url: string, title: string): Promise<string> {
    title = String(title || new Date().getTime()).trim();
    const path: string = FILE_PATH + '/' + title + '.mp4';

    return new Promise((resolve, reject) => {
        fs.exists(path)
            .then((exist) => {
                if (exist) {
                    resolve(path);
                } else {
                    startDownload(resolve, reject);
                }
            })
            .catch(() => {
                startDownload(resolve, reject);
            });
    });

    function startDownload(resolve: (p?: any) => any, reject: (p?: any) => any) {
        Loading.show('正在下载分享视频');
        RNFetchBlob.config({
            fileCache: true,
            path,
        })
            .fetch('GET', url, {
                'Content-Type': 'video/mp4',
            })
            .progress((received, total) => {})
            .then((res) => {
                const filePath: string = res.path();
                // console.log('filePath', filePath);
                if (Platform.OS === 'android') {
                    fs.scanFile([{ path: filePath, mime: 'video/mp4' }]);
                } else {
                    CameraRoll.save(filePath);
                }
                resolve(filePath);
            })
            .catch((error) => {
                reject(error);
            });
    }
}
