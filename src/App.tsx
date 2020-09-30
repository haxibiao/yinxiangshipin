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
    // 获取配置时间
    const responseTime = useRef(0);
    const timer = useRef();

    if (appLunch.current) {
        appLunch.current = false;
        Orientation.lockToPortrait();
        SplashScreen.hide();
        // 启动前，初始化Ad
        ad.init({
            appid: store.adStore.tt_appid,
            app: DisplayName,
        });
    }

    // 获取APP的开启配置(广告和钱包)
    const fetchConfig = useCallback(() => {
        fetch(Config.ServerRoot + '/api/app-config?os=' + Platform.OS + '&store=' + Config.AppStore)
            .then((response) => response.json())
            .then((result) => {
                clearInterval(timer.current);
                // 1.保存APP配置(含ad appId, codeId等)
                store.adStore.setAdConfig(result);
                // 广告打开，并且接口响应时间小于3000毫秒
                if (result?.ad === 'on' && responseTime.current <= 3000) {
                    // 启动个开屏广告
                    ad.startSplash({
                        appid: store.adStore.tt_appid,
                        codeid: store.adStore.codeid_splash,
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
        // 检查版本更新
        // checkUpdate('autoCheck');
        // WeChat注册
        WeChat.registerApp(WechatAppId, 'http://yxsp.haxifang.cn/');
        //清除定时器
        return () => {
            clearInterval(timer.current);
        };
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
