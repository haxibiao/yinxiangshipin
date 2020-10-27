import React, { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Overlay } from 'teaset';
import { when } from 'mobx';
import { ad } from 'react-native-ad';
import { observer, appStore, adStore, userStore, Storage, Keys } from './store';
import { useRecallUserProfile } from './apollo';
import { authNavigate } from './router';
import { PopOverlay, BeginnerGuidance } from './components';
import NewUserTaskGuidance from './screens/guidance/NewUserTaskGuidance';
import {
    AutoCheckInModal,
    AppUserAgreementModal,
    DetectPhotoAlbumModal,
    ParseShareLinkModal,
} from './components/modal';

const fetchConfigTimeout = 4000;

// 监听新用户登录
when(
    () => adStore.enableWallet && userStore.login && appStore.guides.UserAgreementGuide,
    () => {
        // 新手指导
        BeginnerGuidance({
            guidanceKey: 'NewUserTask',
            GuidanceView: NewUserTaskGuidance,
        });
    },
);

export default observer(function Preparation() {
    // 恢复登录状态、监听MeMetaQuery更新MeStorage
    useRecallUserProfile();

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
                    // 启动开屏广告
                    // ad.startSplash({
                    //     appid: adStore.tt_appid,
                    //     codeid: adStore.codeid_splash,
                    // });
                }
            })
            .catch((err) => {
                adStore.setAdConfig();
                clearInterval(timer.current);
            });
    }, []);
    useEffect(() => {
        timer.current = setInterval(() => {
            responseTime.current += 100;
        }, 100);
        // 获取广告、钱包配置
        fetchConfig();
        // 除了华为外直接启动启动开屏广告
        if (String(Device.Brand).toLocaleUpperCase !== 'HUAWEI') {
            // ad.startSplash({
            //     appid: adStore.tt_appid,
            //     codeid: adStore.codeid_splash,
            // });
        }
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

    return (
        <>
            <AutoCheckInModal />
            <AppUserAgreementModal />
            <DetectPhotoAlbumModal />
            <ParseShareLinkModal />
        </>
    );
});

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
