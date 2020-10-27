import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal, ScrollView, TextInput } from 'react-native';
import { observer, appStore, userStore, notificationStore } from '@src/store';
import { GQL, useApolloClient } from '@src/apollo';
import { useClipboardLink, useResolveVideo, useResolveContent } from '@src/content';
import { authNavigate } from '@src/router';
import { useNavigationListener } from '@src/common';
import { DebouncedPressable } from '../../../components/Basic/DebouncedPressable';
import Iconfont from '../../../components/Iconfont';
import KeyboardSpacer from '../../../components/Other/KeyboardSpacer';

const shareLinkCache = {};
const MODAL_WIDTH = Device.WIDTH * 0.8 > pixel(290) ? pixel(290) : Device.WIDTH * 0.8;

// 采集分享链接视频内容
export const ParseShareLinkModal = observer(() => {
    const shown = useRef(false);
    const [visible, setVisible] = useState(false);

    const client = useApolloClient();
    const [{ shareLink, shareBody }] = useClipboardLink();
    const [videoTitle, setVideoTitle] = useState();

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
        }
    }, []);

    const hideModal = useCallback((message) => {
        if (shown.current) {
            setVisible(false);
            shown.current = false;
        }
        if (typeof message === 'string') {
            Toast.show({ content: message });
        }
    }, []);

    useEffect(() => {
        // 用户已经登录、有分享链接、完成了内容解析业务、不能进行用户引导或者在发布页中
        if (
            shareLink &&
            shareBody &&
            userStore.login &&
            notificationStore.guides.UserAgreementGuide &&
            notificationStore.detectedSharedContent &&
            notificationStore.inGuidance !== true &&
            appStore.currentRouteName !== 'CreatePost' &&
            shareLinkCache[shareLink] == undefined
        ) {
            shareLinkCache[shareLink] = shareBody;
            setVideoTitle(shareBody?.title);
            showModal();
        }
    }, [shareLink, shareBody, userStore.login, notificationStore.guides.UserAgreementGuide]);

    // 采集成功
    const resolveContentSuccess = useCallback(
        async (video) => {
            notificationStore.toggleLoadingVisible('视频收藏中');
            const [error, res] = await exceptionCapture(() =>
                client.mutate({
                    mutation: GQL.createPostContent,
                    variables: {
                        body: videoTitle,
                        qcvod_fileid: video?.id,
                        share_link: shareLink,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.tasksQuery,
                            fetchPolicy: 'network-only',
                        },
                        {
                            query: GQL.MeMetaQuery,
                            fetchPolicy: 'network-only',
                        },
                    ],
                }),
            );
            notificationStore.toggleLoadingVisible();
            if (error) {
                hideModal(error?.message || '收藏失败');
            } else if (res) {
                hideModal('收藏成功');
            }
        },
        [videoTitle, shareLink],
    );

    // 服务端采集
    const resolveVideo = useResolveVideo({
        client,
        shareLink,
        content: videoTitle,
        onSuccess: hideModal,
        onFailed: hideModal,
    });

    // 客户端采集
    const resolveContent = useResolveContent({
        shareBody,
        onSuccess: resolveContentSuccess,
        onFailed: resolveVideo,
    });

    // 采集视频
    const collectVideo = useCallback(() => {
        if (appStore.isLocalSpiderVideo) {
            resolveContent();
        } else {
            resolveVideo();
        }
    }, [resolveVideo, resolveContent]);

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <ScrollView contentContainerStyle={styles.modalView}>
                <View style={styles.modalContainer}>
                    <View style={styles.videoCover}>
                        <Image
                            style={styles.coverImage}
                            source={{
                                uri: shareBody?.cover || 'http://cos.haxibiao.com/images/5f83d367ae609.jpeg',
                            }}
                        />
                        <View style={styles.videoMark}>
                            <Iconfont name="bofang1" size={font(20)} color={'#fff'} style={{ opacity: 0.8 }} />
                        </View>
                        <DebouncedPressable style={styles.closeBtn} onPress={hideModal}>
                            <Iconfont name="guanbi1" size={font(14)} color="#fff" />
                        </DebouncedPressable>
                    </View>
                    <View style={styles.videoContent}>
                        {/* <Text style={styles.title}>{shareBody?.title}</Text> */}
                        <TextInput
                            style={styles.inputContent}
                            onChangeText={(val) => setVideoTitle(val)}
                            value={videoTitle}
                            multiline={true}
                            maxLength={100}
                            textAlignVertical="center"
                            placeholder="把你想说的娓娓道来，分享给有趣的人"
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#b2b2b2"
                        />
                    </View>
                    <DebouncedPressable style={styles.shareBtn} onPress={collectVideo}>
                        <Text style={styles.shareBtnText}>收藏视频</Text>
                    </DebouncedPressable>
                    <Text style={styles.tips}>来自您复制的分享链接</Text>
                </View>
                <KeyboardSpacer />
            </ScrollView>
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
    videoCover: {
        overflow: 'hidden',
        height: MODAL_WIDTH,
        marginBottom: pixel(15),
    },
    coverImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        backgroundColor: '#f0f0f0',
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
