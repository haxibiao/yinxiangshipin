import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { observer, appStore, userStore, adStore } from '@src/store';
import { useClipboardLink, VideoCaptureData } from '@src/content';
import { useApolloClient } from '@apollo/react-hooks';
import { useBeginner, detectPhotos } from '@src/common';
import { NavBarHeader, ScrollTabBar, PopOverlay, BeginnerGuidance } from '@src/components';
import { Overlay } from 'teaset';
import { when } from 'mobx';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation } from '@react-navigation/native';
import RecommendVideos from './RecommendVideos';
import EnshrinedVideos from './EnshrinedVideos';
import FriendShipVideos from './FriendShipVideos';
import NewUserTaskGuidance from './components/NewUserTaskGuidance';
import { ad } from 'react-native-ad';

// 监听新用户登录
when(
    () => adStore.enableAd && adStore.enableWallet && userStore?.me?.id,
    () => {
        // 新手指导
        BeginnerGuidance({
            guidanceKey: 'NewUserTask',
            GuidanceView: NewUserTaskGuidance,
        });
    },
);

export default observer(({}) => {
    useBeginner();

    const [shareContent] = useClipboardLink();
    const isShow = useRef(false);
    const overlayRef = useRef();

    const showShareContentModal = useMemo(() => {
        function onClose() {
            overlayRef.current?.close();
            isShow.current = false;
        }
        return (params) => {
            if (!isShow.current) {
                isShow.current = true;
                Overlay.show(
                    <Overlay.PopView
                        style={styles.overlay}
                        ref={overlayRef}
                        onDisappearCompleted={() => (isShow.current = false)}>
                        <VideoCaptureData
                            client={appStore.client}
                            onSuccess={onClose}
                            onFailed={onClose}
                            onClose={onClose}
                            {...params}
                        />
                    </Overlay.PopView>,
                );
            }
        };
    }, []);

    useEffect(() => {
        if (userStore.login && shareContent && appStore.currentRouteName !== 'CreatePost') {
            showShareContentModal(shareContent);
        }
    }, [shareContent]);

    const navigation = useNavigation();
    const currentPage = useRef(1);
    const visibility = useRef(false);
    const onChangeTab = useCallback((e) => {
        currentPage.current = e.i;
        DeviceEventEmitter.emit('onChangeVideoTab', visibility.current ? currentPage.current : -1);
    }, []);

    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        appStore.viewportHeight = height;
    }, []);

    // 获取相册图片并检查图片中的二维码
    const detectSharePhoto = useCallback(async () => {
        const photoInfo = await detectPhotos();
        if (photoInfo?.type == 'post' && photoInfo?.post_id) {
            setTimeout(() => {
                PopOverlay({
                    content: '检测到有被其他用户分享的精彩内容，是否跳转页面查看内容详情?',
                    rightContent: '查看',
                    onConfirm: async () => {
                        appStore.detectedQRCodeRecord.push(photoInfo?.qrInfo);
                        appStore.setAppStorage('detectedQRCodeRecord', appStore.detectedQRCodeRecord);
                        navigation.navigate('SharedPostDetail', { ...photoInfo });
                    },
                });
            }, 5000);
        }
    }, []);

    // 视频播放事件处理
    useEffect(() => {
        // 尝试解析相册图片
        detectSharePhoto();
        // 监听视频分栏切换，暂停/播放视频
        const navWillFocusListener = navigation.addListener('focus', () => {
            visibility.current = true;
            DeviceEventEmitter.emit('onChangeVideoTab', currentPage.current);
        });
        const navWillBlurListener = navigation.addListener('blur', () => {
            visibility.current = false;
            DeviceEventEmitter.emit('onChangeVideoTab', -1);
        });
        return () => {
            navWillFocusListener();
            navWillBlurListener();
        };
    }, []);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <ScrollableTabView
                contentProps={{ keyboardShouldPersistTaps: 'always' }}
                tabBarPosition="overlayTop"
                initialPage={1}
                onChangeTab={onChangeTab}
                renderTabBar={(tabBarProps: any) => (
                    <ScrollTabBar
                        {...tabBarProps}
                        tabWidth={pixel(74)}
                        tabBarStyle={styles.tabBarStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <EnshrinedVideos tabLabel="收藏" page={0} />
                <RecommendVideos tabLabel="推荐" page={1} />
                <FriendShipVideos tabLabel="关注" page={2} />
            </ScrollableTabView>
            <NavBarHeader
                navBarStyle={styles.navBarStyle}
                hasGoBackButton={false}
                isTransparent={true}
                hasSearchButton={true}
                statusbarProperties={{ barStyle: 'light-content' }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: pixel(60),
    },
    tabBarStyle: {
        width: '100%',
        height: pixel(42),
        paddingHorizontal: pixel(42),
        marginTop: Theme.statusBarHeight,
        borderWidth: 0,
        justifyContent: 'center',
    },
    underlineStyle: {
        width: pixel(24),
        left: (Device.WIDTH - pixel(74) * 3) / 2 + pixel(25),
        marginBottom: pixel(4),
        backgroundColor: '#fff',
    },
    activeTextStyle: {
        color: '#ffffff',
        fontSize: font(19),
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    tintTextStyle: {
        color: '#ddd',
        fontSize: font(19),
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 1,
    },
});
