import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal, ScrollView, TextInput } from 'react-native';
import { observer, appStore, adStore, userStore, notificationStore } from '@src/store';
import { GQL, useApolloClient } from '@src/apollo';
import { detectPhotos } from '@src/common';
import { authNavigate } from '@src/router';
import { DebouncedPressable } from '../../../components/Basic/DebouncedPressable';
import Iconfont from '../../../components/Iconfont';
import Video from 'react-native-video';

const MODAL_WIDTH = Device.WIDTH * 0.8 > pixel(290) ? pixel(290) : Device.WIDTH * 0.8;

interface Props {
    url: string;
    type: string;
    onPress: (p?: any) => any;
    onClose: (p?: any) => any;
}

const ContentCover = React.memo(({ url, type }) => {
    if (Platform.OS === 'ios') {
        return <Image style={styles.coverImage} source={{ uri: url }} resizeMode="cover" />;
    } else {
        return type === 'image' ? (
            <Image style={styles.coverImage} source={{ uri: url }} resizeMode="cover" />
        ) : (
            <Video
                source={{
                    uri: url,
                }}
                style={styles.coverVideo}
                muted={true}
                paused={false}
                resizeMode="cover"
            />
        );
    }
});

// 获取分享图片二维码/视频vid信息，跳转详情页
export const DetectPhotoAlbumModal = observer(() => {
    const shown = useRef(false);
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState({});

    function record() {
        appStore.detectedFileInfo.push(content?.url);
        appStore.setAppStorage('detectedFileInfo', appStore.detectedFileInfo);
    }

    function browse() {
        record();
        hideModal();
        authNavigate('SharedPostDetail', { ...content });
    }

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            shown.current = false;
            setVisible(false);
            record();
            userStore.startParseSharedLink = true;
        }
    }, [record]);

    const detectPhotoAlbum = useCallback(async () => {
        const photoInfo = await detectPhotos();
        if (photoInfo?.type == 'post' && (photoInfo?.post_id || photoInfo?.uuid)) {
            setContent(photoInfo);
            showModal();
        } else {
            userStore.startParseSharedLink = true;
        }
    }, []);

    // 进入App 尝试detectPhotoAlbum
    useEffect(() => {
        const appIsReady = notificationStore.guides.UserAgreementGuide && adStore.loadedConfig;
        if (appIsReady) {
            if ((userStore.startDetectPhotoAlbum || !adStore.enableWallet) && !notificationStore.hasModalShown) {
                if (!detectPhotoAlbum.called) {
                    detectPhotoAlbum.called = true;
                    detectPhotoAlbum();
                } else {
                    userStore.startParseSharedLink = true;
                }
            }
        }
    }, [notificationStore.guides.UserAgreementGuide, adStore.loadedConfig, userStore.startDetectPhotoAlbum]);

    return (
        <Modal
            animationType="fade"
            visible={visible}
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <View style={styles.modalContainer}>
                    <View style={styles.contentCover}>
                        <ContentCover url={content?.url} type={content?.fileType} />
                        <View style={styles.videoMark}>
                            <Iconfont name="bofang1" size={font(20)} color={'#fff'} style={{ opacity: 0.8 }} />
                        </View>
                        <DebouncedPressable style={styles.closeBtn} onPress={hideModal}>
                            <Iconfont name="guanbi1" size={font(14)} color="#fff" />
                        </DebouncedPressable>
                    </View>
                    <View style={styles.videoContent}>
                        <Text style={styles.title}>检测到有被分享的内容，是否打开</Text>
                    </View>
                    <DebouncedPressable style={styles.shareBtn} onPress={browse}>
                        <Text style={styles.shareBtnText}>打开看看</Text>
                    </DebouncedPressable>
                    <Text style={styles.tips}>来自印象视频的好友分享</Text>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
        width: MODAL_WIDTH,
        borderRadius: pixel(5),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    coverImage: {
        flex: 1,
        width: null,
        height: null,
        marginBottom: -(MODAL_WIDTH * ((1450 / 1040) * 0.6)),
    },
    coverVideo: {
        flex: 1,
        width: null,
        height: null,
    },
    contentCover: {
        overflow: 'hidden',
        height: MODAL_WIDTH,
        marginBottom: pixel(15),
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
    videoContent: {
        paddingHorizontal: pixel(20),
        marginBottom: pixel(15),
    },
    inputContent: {
        height: pixel(60),
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
        paddingTop: 0,
        padding: pixel(5),
        margin: 0,
        borderWidth: pixel(1),
        borderColor: '#f0f0f0',
        borderRadius: pixel(5),
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
        height: pixel(40),
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
