import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import * as WeChat from 'react-native-wechat-lib';
import * as Sentry from '@sentry/react-native';
import { toggleImmerseStatusBar } from 'react-native-realfullscreen';
import { WechatAppId, SentryDSN } from '../app.json';
import { observer, userStore, appStore } from './store';
import { usePreloadData } from './apollo';
import { useFetchAppConfig, useAutoSignIn, useRecallUserProfile } from './common';
import {
    AppUserAgreementModal,
    NewUserRedEnvelopeModal,
    AutoCheckInModal,
    DetectPhotoAlbumModal,
    ParseShareLinkModal,
} from './components/modal';
import Socket from './Socket';

const fetchConfigTimeout = 4000;

export default observer(function Preparation() {
    // 获取APP的开启配置(广告和钱包)
    useFetchAppConfig();
    // 自动登录
    useAutoSignIn({ isLogin: userStore.login, firstInstall: userStore.firstInstall });
    // 恢复登录状态、监听MeMetaQuery更新MeStorage
    useRecallUserProfile(userStore.login);
    // sdk registration
    useEffect(() => {
        // WeChat注册（微信分享）
        WeChat.registerApp(WechatAppId, 'http://yxsp.haxifang.cn/');
    }, []);
    useEffect(() => {
        // 捕获用户
        if (userStore.me.id) {
            Sentry.setUser({ id: userStore.me.id, username: userStore.me.name });
        }
    }, [userStore.me.id]);
    useEffect(() => {
        // 安卓横屏真全屏（避免挖孔屏顶不上去）
        toggleImmerseStatusBar();
        // 异常上报
        Sentry.init({
            dsn: SentryDSN,
        });
    }, []);
    // 提前加载某些数据
    usePreloadData();
    // App功能弹窗
    return (
        <>
            <AppUserAgreementModal />
            <NewUserRedEnvelopeModal />
            <AutoCheckInModal />
            <ParseShareLinkModal />
            <Socket />
        </>
    );
});

const styles = StyleSheet.create({});
