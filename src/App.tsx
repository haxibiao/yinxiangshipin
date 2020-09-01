import React, { Component, useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';
import * as WeChat from 'react-native-wechat-lib';
import { WechatAppId, DisplayName } from '@app/app.json';

import StoreContext, * as store from './store';
import { Toast } from './components';
import ApolloApp from './ApolloApp';
import { ad } from 'react-native-ad';

function App() {
    const appLunch = useRef(true);

    if (appLunch.current) {
        Orientation.lockToPortrait();
        SplashScreen.hide();
        // 启动前，初始化Ad
        ad.init({
            appid: store.adStore.tt_appid,
            app: DisplayName,
        });
        // 启动个开屏广告
        ad.startSplash({
            appid: store.adStore.tt_appid,
            codeid: store.adStore.codeid_splash,
        });
        appLunch.current = false;
    }

    // 获取APP的开启配置(广告和钱包)
    const fetchConfig = useCallback(() => {
        fetch(Config.ServerRoot + '/api/app-config?os=' + Platform.OS + '&store=' + Config.AppStore, {
            headers: {
                os: Platform.OS,
                store: Config.AppStore,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                // 1.保存APP配置(含ad appId, codeId等)
                // FIXME 需要重新写
                // store.adStore.setAdConfig(result);
                // 2.广告初始化
                //
                // 3.开屏
                SplashScreen.hide();
            })
            .catch((err) => {});
    }, []);

    useEffect(() => {
        fetchConfig();
        // 检查版本更新
        // checkUpdate('autoCheck');
        // WeChat lib注册
        WeChat.registerApp(WechatAppId, 'http://yxsp.haxifang.cn/');
    }, []);

    return (
        <View style={styles.container}>
            <StoreContext.Provider value={store}>
                <ApolloApp />
            </StoreContext.Provider>
            <Toast ref={(ref) => (global.Toast = ref)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export default codePush(codePushOptions)(App);
