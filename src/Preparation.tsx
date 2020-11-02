import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { observer, userStore, appStore } from './store';
import { useRecallUserProfile, useAutoSignIn, usePreloadData } from './apollo';
import { useFetchAppConfig, useAccountRemind } from './common';
import {
    AppUserAgreementModal,
    NewUserRedEnvelopeModal,
    AutoCheckInModal,
    DetectPhotoAlbumModal,
    ParseShareLinkModal,
} from './components/modal';

const fetchConfigTimeout = 4000;

export default observer(function Preparation() {
    // 获取APP的开启配置(广告和钱包)
    useFetchAppConfig();
    // 自动登录
    useAutoSignIn({ isLogin: userStore.login, firstInstall: userStore.firstInstall });
    // 恢复登录状态、监听MeMetaQuery更新MeStorage
    useRecallUserProfile(userStore.login);
    // 绑定手机号提醒
    useAccountRemind({ gold: userStore.me.gold, articles: userStore.me.count_articles });
    // 提前加载某些数据
    usePreloadData();

    // 功能性弹窗
    return (
        <>
            <AppUserAgreementModal />
            <NewUserRedEnvelopeModal />
            <AutoCheckInModal />
            <DetectPhotoAlbumModal />
            <ParseShareLinkModal />
        </>
    );
});

const styles = StyleSheet.create({});
