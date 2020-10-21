import React, { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Overlay } from 'teaset';
import { when } from 'mobx';
import { ad } from 'react-native-ad';
import { observer, appStore, adStore, userStore, Storage, Keys } from './store';
import { GQL, useQuery, useRecallUserProfile } from './apollo';
import { authNavigate } from './router';
import { useUserAgreement, detectPhotos } from './common';
import { useClipboardLink, VideoCaptureData } from './content';
import { PopOverlay, BeginnerGuidance } from './components';
import NewUserTaskGuidance from './screens/guidance/NewUserTaskGuidance';
import SharedPostOverlay from './components/share/SharedPostOverlay';

const UserAgreementGuide = 'UserAgreementGuide' + Config.Version;

const fetchConfigTimeout = fetchConfigTimeout;

// 监听新用户登录
when(
    () => adStore.enableAd && adStore.enableWallet && userStore?.me?.id && appStore.guides[UserAgreementGuide],
    () => {
        // 新手指导
        BeginnerGuidance({
            guidanceKey: 'NewUserTask',
            GuidanceView: NewUserTaskGuidance,
        });
    },
);

export default observer(function BusinessManager() {
    // 恢复登录状态、监听MeMetaQuery更新MeStorage
    useRecallUserProfile();
    // 显示用户协议
    useUserAgreement(UserAgreementGuide);
    // recalled userStore、UserAgreement
    const appIsReady = useMemo(() => userStore.launched && appStore.guides[UserAgreementGuide], [
        userStore.launched,
        appStore.guides[UserAgreementGuide],
    ]);

    // 获取APP的开启配置(广告和钱包)
    const timer = useRef(); // 防止获取配置超时
    const responseTime = useRef(0);
    const fetchConfig = useCallback(() => {
        fetch(Config.ServerRoot + '/api/app-config?os=' + Platform.OS + '&store=' + Config.AppStore)
            .then((response) => response.json())
            .then((result) => {
                clearInterval(timer.current);
                // 1.保存APP配置(含ad appId, codeId等)
                adStore.setAdConfig(result);
                // 华为手机，广告开启，并且接口响应超时
                if (
                    String(Device.Brand).toLocaleUpperCase === 'HUAWEI' &&
                    result?.ad === 'on' &&
                    responseTime.current <= fetchConfigTimeout
                ) {
                    // 启动个开屏广告
                    ad.startSplash({
                        appid: adStore.tt_appid,
                        codeid: adStore.codeid_splash,
                    });
                }
            })
            .catch((err) => {
                clearInterval(timer.current);
            });
    }, []);
    useEffect(() => {
        timer.current = setInterval(() => {
            responseTime.current += 100;
        }, 100);
        // 获取广告、钱包配置
        fetchConfig();
        // 除了华为外直接启动启动个开屏广告
        if (String(Device.Brand).toLocaleUpperCase !== 'HUAWEI') {
            ad.startSplash({
                appid: adStore.tt_appid,
                codeid: adStore.codeid_splash,
            });
        }
        //清除定时器
        return () => {
            clearInterval(timer.current);
        };
    }, []);

    // 获取分享图片二维码/视频vid信息，跳转详情页
    const [detected, setDetected] = useState(false); // detectPhotoAlbum是否执行完毕
    const detectPhotoAlbum = useCallback(async () => {
        let timer;
        const photoInfo = await detectPhotos();
        // 没有解析到被分享内容，直接设置状态
        if (!photoInfo) {
            setDetected(true);
        }
        // 查看/关闭分享内容都延迟设置解析状态
        function delaySetDetected() {
            timer = setTimeout(() => {
                setDetected(true);
            }, 5000);
        }
        function onPress() {
            delaySetDetected();
            appStore.detectedFileInfo.push(photoInfo?.url);
            appStore.setAppStorage('detectedFileInfo', appStore.detectedFileInfo);
            authNavigate('SharedPostDetail', { ...photoInfo });
        }
        function onClose() {
            delaySetDetected();
            appStore.detectedFileInfo.push(photoInfo?.url);
            appStore.setAppStorage('detectedFileInfo', appStore.detectedFileInfo);
        }
        if (photoInfo?.type == 'post' && (photoInfo?.post_id || photoInfo?.vid)) {
            SharedPostOverlay.show({ url: photoInfo?.url, type: photoInfo?.fileType, onPress, onClose });
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);
    useEffect(() => {
        let timer;
        // App初始化完成，用户同意协议
        if (appIsReady) {
            const unableShowNewUserTask = !userStore?.me?.id || !(adStore.enableAd && adStore.enableWallet);
            timer = setTimeout(() => {
                // 新人任务引导完成 / 假如用户未登录或者关闭了广告/钱包（为避免超时，所以延迟执行）
                if (appStore.guides.NewUserTask || unableShowNewUserTask) {
                    detectPhotoAlbum();
                } else {
                    setDetected(true);
                }
            }, fetchConfigTimeout);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [appIsReady, appStore.guides.NewUserTask]);

    // 粘贴板抖音采集
    const [shareContent] = useClipboardLink();
    const showShareContentModal = useMemo(() => {
        let overlayRef;
        let isShow = false;
        function onClose() {
            overlayRef?.close();
            isShow = false;
        }
        return (params) => {
            if (!isShow) {
                isShow = true;
                Overlay.show(
                    <Overlay.PopView
                        style={styles.overlay}
                        ref={(ref) => (overlayRef = ref)}
                        onDisappearCompleted={() => (isShow = false)}>
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
    // 采集模态框：解析是否有被分享内容、用户登录、有准备分享的内容、不能在发布页
    useEffect(() => {
        if (detected && userStore.login && shareContent && appStore.currentRouteName !== 'CreatePost') {
            showShareContentModal(shareContent);
        }
    }, [detected, shareContent]);

    // 绑定手机号提醒
    const goldsOrArticlesUpdateCount = useRef(0); //更新次数
    const me = useMemo(() => userStore.me, [userStore.me]);
    useEffect(() => {
        if (userStore?.login && !userStore?.me?.phone && me?.count_articles >= 10) {
            // (me?.gold >= me?.exchangeRate * 0.3 || me?.balance >= 0.3 || me?.count_articles >= 10)
            goldsOrArticlesUpdateCount.current++;
        }

        if (
            !userStore.bindAccountRemind &&
            !userStore.disabledBindAccountRemind &&
            goldsOrArticlesUpdateCount.current >= 2
        ) {
            Storage.setItem(Keys.bindAccountRemind + Config.Version, true);
            userStore.bindAccountRemind = true;
            PopOverlay({
                modal: true,
                content: '账号还未绑定手机号，退出登录可能会丢失数据！可在【设置】中绑定手机号。',
                leftContent: '不再提醒',
                rightContent: '前去绑定',
                leftConfirm: async () => {
                    Storage.setItem(Keys.disabledBindAccountRemind, true);
                    userStore.disabledBindAccountRemind = true;
                },
                onConfirm: async () => {
                    authNavigate('BindingAccount');
                },
            });
        }
        // me?.gold, me?.count_articles
    }, [me?.count_articles]);

    return null;
});

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
