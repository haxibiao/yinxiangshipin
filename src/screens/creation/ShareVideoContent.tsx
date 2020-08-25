import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import { Iconfont, Loading } from '@src/components';
import { vod } from '@src/native';
import { getURLsFromString, fileHash } from '@src/common';
import { useResolveContent } from './useResolveContent';

const { fs } = RNFetchBlob;
const { dirs } = fs;
const FILE_PATH = Platform.OS === 'android' ? dirs.DCIMDir : dirs.DocumentDir;

interface Props {
    client: any;
    shareLink: string;
    content: any;
    onClose: (p?: any) => any;
}

function downloadVideo(url, title) {
    title = String(title || new Date().getTime()).trim();
    const path = FILE_PATH + '/' + title + '.mp4';

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

    function startDownload(resolve, reject) {
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
                const filePath = res.path();
                if (Platform.OS === 'android') {
                    fs.scanFile([{ path: filePath, mime: 'video/mp4' }]);
                }
                // console.log('filePath', filePath);
                resolve(filePath);
            })
            .catch((error) => {
                Loading.hide('下载失败');
                reject(error);
            });
    }
}

export default ({ client, shareLink, shareBody, onSuccess, onClose }: Props) => {
    const getFileMD5Hash = useCallback((videoPath) => {
        return new Promise((resolve, reject) => {
            fileHash(videoPath, (error, md5Hash) => {
                console.log('error', error, 'md5Hash', md5Hash);
                if (md5Hash) {
                    fetch(`http://media.haxibiao.com/api/video/hash/${md5Hash}`)
                        .then((response) => {
                            console.log('response', response);
                            if (response) {
                                resolve(response);
                            } else {
                                reject(error);
                            }
                        })
                        .catch((err) => {
                            console.log('err', err);
                            reject(err);
                        });
                } else {
                    reject(error);
                }
            });
        });
    }, []);

    const uploadVideo = useCallback(
        (videoPath) => {
            Loading.hide();
            vod.upload({
                videoPath,
                onStarted: () => Loading.show('视频正在上传'),
                onProcess: (progress: number) => {},
                onCompleted: (data: any) => {
                    console.log('onCompleted data', data);
                    if (data.video_id) {
                        Loading.hide('上传成功');
                        onSuccess({
                            id: data.video_id,
                            path: shareBody.url,
                            cover: shareBody.cover,
                        });
                    } else {
                        Loading.hide('上传失败');
                        onClose();
                    }
                },
                onError: (error: any) => {
                    Loading.hide('上传失败');
                    onClose();
                },
            });
        },
        [onSuccess],
    );

    const shareVideo = useCallback(() => {
        if (Platform.OS === 'android') {
            // 外部储存写入权限获取
            check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result: any) => {
                if (result === RESULTS.GRANTED) {
                    downloadVideo(shareBody?.url, shareBody?.title)
                        .then((path) => {
                            getFileMD5Hash(path)
                                .then((fileId) => {
                                    onSuccess({
                                        id: fileId,
                                        path: shareBody.url,
                                        cover: shareBody.cover,
                                    });
                                })
                                .catch((err) => {
                                    uploadVideo(path);
                                });
                        })
                        .catch((err) => {});
                } else {
                    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result: any) => {
                        shareVideo();
                    });
                }
            });
        } else {
            downloadVideo(shareBody?.url, shareBody?.title)
                .then((path) => {
                    getFileMD5Hash(path)
                        .then((fileId) => {
                            onSuccess({
                                id: fileId,
                                path: shareBody.url,
                                cover: shareBody.cover,
                            });
                        })
                        .catch((err) => {
                            uploadVideo(path);
                        });
                })
                .catch((err) => {});
        }
    }, [shareBody, onSuccess]);

    return (
        <View style={styles.card}>
            <View style={styles.cover}>
                <Image style={styles.coverImage} source={{ uri: shareBody?.cover }} />
                <View style={styles.videoMark}>
                    <Iconfont name="bofang1" size={font(20)} color={'#fff'} style={{ opacity: 0.8 }} />
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Iconfont name="guanbi1" size={font(14)} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>{shareBody?.title}</Text>
            </View>
            <TouchableOpacity style={styles.shareBtn} onPress={shareVideo}>
                <Text style={styles.shareBtnText}>上传视频</Text>
            </TouchableOpacity>
            <Text style={styles.tips}>来自您复制的分享链接</Text>
        </View>
    );
};

const CARD_WIDTH = percent(80) > pixel(280) ? pixel(280) : percent(80);

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: pixel(5),
        overflow: 'hidden',
    },
    cover: {
        height: CARD_WIDTH,
        marginBottom: pixel(15),
    },
    coverImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    videoMark: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: pixel(10),
        right: pixel(10),
        width: pixel(30),
        height: pixel(30),
        borderRadius: pixel(15),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    body: {
        paddingHorizontal: pixel(20),
        marginBottom: pixel(15),
    },
    title: {
        fontSize: font(15),
        lineHeight: font(22),
        color: '#2b2b2b',
        textAlign: 'center',
    },
    shareBtn: {
        marginHorizontal: pixel(20),
        marginBottom: pixel(15),
        height: pixel(42),
        borderRadius: pixel(4),
        backgroundColor: '#FE1966',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareBtnText: {
        fontSize: font(16),
        color: '#fff',
    },
    tips: {
        marginBottom: pixel(12),
        fontSize: font(13),
        color: '#b2b2b2',
        textAlign: 'center',
    },
});
