import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { observer, appStore, userStore, notificationStore } from '@src/store';
import { GQL, useApolloClient } from '@src/apollo';
import { useClipboardLink, useResolveVideo } from '@src/content';
import { useNavigationListener } from '@src/common';
import { DebouncedPressable } from '../../../components/Basic/DebouncedPressable';
import Iconfont from '../../../components/Iconfont';
import KeyboardSpacer from '../../../components/Other/KeyboardSpacer';

const shareLinkCache = {};
const MODAL_WIDTH = Device.width * 0.8 > pixel(300) ? pixel(300) : Device.width * 0.8;

// 采集分享链接视频内容
export const ParseShareLinkModal = observer(() => {
    const shown = useRef(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

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
        // 用户已经登录、有分享链接、没有进行用户引导
        if (
            shareLink &&
            shareBody &&
            userStore.login &&
            !notificationStore.hasModalShown &&
            appStore.currentRouteName !== 'CreatePost' &&
            shareLinkCache[shareLink] == undefined
        ) {
            shareLinkCache[shareLink] = shareBody;
            setVideoTitle(shareBody?.title);
            showModal();
        }
    }, [shareLink, shareBody]);

    // 服务端采集
    const resolveVideo = useResolveVideo({
        client,
        shareLink,
        content: videoTitle,
        onSuccess: hideModal,
        onFailed: hideModal,
    });

    // 采集视频
    const collectVideo = useCallback(async () => {
        setLoading(true);
        try {
            await resolveVideo();
        } catch (error) {}
        setLoading(false);
    }, [resolveVideo]);

    return (
        <Modal
            animationType="fade"
            visible={visible}
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <ScrollView contentContainerStyle={styles.modalView} bounces={false}>
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
                            editable={!loading}
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
                    <DebouncedPressable style={styles.shareBtn} onPress={collectVideo} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size={'small'} color={'#fff'} />
                        ) : (
                            <Text style={styles.shareBtnText}>收藏视频</Text>
                        )}
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
        marginBottom: pixel(12),
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
        marginBottom: pixel(12),
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
        marginBottom: pixel(12),
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
        fontSize: font(12),
        color: '#b2b2b2',
        textAlign: 'center',
    },
});
