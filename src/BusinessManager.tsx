import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Overlay } from 'teaset';
import { when } from 'mobx';
import { ad } from 'react-native-ad';
import { observer, appStore, adStore, userStore, Storage, Keys } from './store';
import { GQL, useQuery } from './apollo';
import { authNavigate } from './router';
import { useUserAgreement, detectPhotos } from './common';
import { useClipboardLink, VideoCaptureData } from './content';
import { PopOverlay, BeginnerGuidance } from './components';
import NewUserTaskGuidance from './screens/guidance/NewUserTaskGuidance';

// 监听新用户登录
when(
    () => adStore.enableAd && adStore.enableWallet && userStore?.me?.id && userStore.me.agreement,
    () => {
        // 新手指导
        BeginnerGuidance({
            guidanceKey: 'NewUserTask',
            GuidanceView: NewUserTaskGuidance,
        });
    },
);

export default observer(function BusinessManager() {
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
    // 显示采集模态框
    useEffect(() => {
        if (userStore.login && shareContent && appStore.currentRouteName !== 'CreatePost') {
            showShareContentModal(shareContent);
        }
    }, [shareContent]);

    // 获取分享图片二维码信息跳转详情页
    const detectSharePhoto = useCallback(async () => {
        const photoInfo = await detectPhotos();
        if (photoInfo?.type == 'post' && (photoInfo?.post_id || photoInfo?.vid)) {
            setTimeout(() => {
                PopOverlay({
                    content: '检测到被其他用户分享的动态，是否查看内容?',
                    rightContent: '查看详情',
                    onConfirm: async () => {
                        appStore.detectedQRCodeRecord.push(photoInfo?.qrInfo);
                        appStore.setAppStorage('detectedQRCodeRecord', appStore.detectedQRCodeRecord);
                        authNavigate('SharedPostDetail', { ...photoInfo });
                    },
                });
            }, 5000);
        }
    }, []);

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
                // 广告打开，并且接口响应时间小于3000毫秒
                if (result?.ad === 'on' && responseTime.current <= 3000) {
                    // 启动个开屏广告
                    // ad.startSplash({
                    //     appid: adStore.tt_appid,
                    //     codeid: adStore.codeid_splash,
                    // });
                }
            })
            .catch((err) => {
                clearInterval(timer.current);
            });
    }, []);

    // 显示用户协议
    useUserAgreement();

    useEffect(() => {
        timer.current = setInterval(() => {
            responseTime.current += 100;
        }, 100);
        // 获取广告、钱包配置
        fetchConfig();
        // 解析相册图片二维码
        detectSharePhoto();
        //清除定时器
        return () => {
            clearInterval(timer.current);
        };
    }, []);

    // 绑定手机号提醒
    const goldsOrArticlesUpdateCount = useRef(0); //更新次数
    const me = useMemo(() => userStore.me, [userStore.me]);
    useEffect(() => {
        if (userStore?.login && !userStore?.me?.phone && me?.count_articles >= 10) {
            // (me?.gold >= me?.exchangeRate * 0.3 || me?.balance >= 0.3 || me?.count_articles >= 10)
            goldsOrArticlesUpdateCount.current++;
        }
        // console.log(
        //     'remindQualification',
        //     userStore.bindAccountRemind,
        //     userStore.disabledBindAccount,
        //     goldsOrArticlesUpdateCount.current,
        // );
        if (!userStore.bindAccountRemind && !userStore.disabledBindAccount && goldsOrArticlesUpdateCount.current >= 2) {
            Storage.setItem(Keys.bindAccountRemind + Config.Version, true);
            userStore.bindAccountRemind = true;
            PopOverlay({
                modal: true,
                content: '账号还未绑定手机号，退出登录可能会丢失数据！可在【设置】中绑定手机号。',
                leftContent: '不再提醒',
                rightContent: '前去绑定',
                leftConfirm: async () => {
                    Storage.setItem(Keys.disabledBindAccount, true);
                    userStore.disabledBindAccount = true;
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
