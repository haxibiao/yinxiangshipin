import React, { Component, useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';
import * as WeChat from 'react-native-wechat-lib';
import { checkUpdate } from '@src/common';
import { WechatAppId } from '@app/app.json';

import StoreContext, * as store from './store';
import { Toast } from './components';
import ApolloApp from './ApolloApp';

function App() {
    const { appStore } = store;
    const appLunch = useRef(true);
    if (appLunch.current) {
        Orientation.lockToPortrait();
        SplashScreen.hide();
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
                appStore.setAdConfig(result);
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
