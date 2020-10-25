import React, { Component, useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation';
import codePush from 'react-native-code-push';
import { ad } from 'react-native-ad';
// appContext
import { observer, appStore, adStore, userStore } from './store';
// apollo appRouter
import { ApolloProvider as ClassApolloProvider } from 'react-apollo';
import { ApolloProvider, useClientBuilder, GQL } from './apollo';
import AppRouter, { authNavigate } from './router';
// weChat lib
import * as WeChat from 'react-native-wechat-lib';
import { WechatAppId, DisplayName } from '../app.json';
// app component
import BusinessManager from './BusinessManager';
import { Toast, TaskNotificationModal, WalletNotificationModal, RewardNotificationModal } from './components';

//修复部分安卓手机中文字体丢失
const defaultFontFamily = {
    ...Platform.select({
        android: { fontFamily: '' },
    }),
};
const PreRender = Text.render;
Text.render = function (...args) {
    const origin = PreRender.call(this, ...args);
    return React.cloneElement(origin, {
        style: [defaultFontFamily, origin.props.style],
    });
};

const App = observer(() => {
    const client = useClientBuilder(userStore.me?.token);
    // 提前加载数据
    useEffect(() => {
        // 提现额度
        if (userStore.login && client?.query) {
            client.query({ query: GQL.getWithdrawAmountList });
        }
    }, [userStore.login, client]);

    // 自动登录
    const autoSignIn = useCallback(async () => {
        const uuid = Device.UUID;
        if (uuid && client?.mutate) {
            // 调用静默注册接口
            client
                .mutate({
                    mutation: GQL.autoSignInMutation,
                    variables: { UUID: uuid },
                })
                .then((res: any) => {
                    const userData = res?.data?.autoSignIn;
                    if (userData?.gold <= 0 && userData?.balance <= 0 && userData?.wallet?.total_withdraw_amount <= 0) {
                        userData.isNewUser = true;
                    }
                    userStore.signIn(userData);
                })
                .catch(() => {
                    // 静默登录失败，引导用户到手动登录页
                    authNavigate('Login');
                });
        } else {
            // 没有拿到uuid,引导用户到手动登录页
            authNavigate('Login');
        }
    }, [client]);
    useEffect(() => {
        // 该APP没有登录过，调用静默登录
        if (!userStore.login && userStore.firstInstall) {
            autoSignIn();
        }
    }, [userStore.login, userStore.firstInstall]);

    const appLunch = useRef(true);
    if (appLunch.current) {
        appLunch.current = false;
        Orientation.lockToPortrait();
        SplashScreen.hide();
        // 启动前，初始化Ad
        ad.init({
            appid: adStore.tt_appid,
            app: DisplayName,
        });
    }

    useEffect(() => {
        // WeChat注册（微信分享）
        WeChat.registerApp(WechatAppId, 'http://yxsp.haxifang.cn/');
    }, []);

    return (
        <View style={styles.container}>
            <ClassApolloProvider client={client}>
                <ApolloProvider client={client}>
                    <BusinessManager />
                    <AppRouter />
                    <TaskNotificationModal />
                    <WalletNotificationModal />
                    <RewardNotificationModal />
                </ApolloProvider>
            </ClassApolloProvider>
            <Toast ref={(ref) => (global.Toast = ref)} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};
// const HotUpdateApp = codePush(codePushOptions)(App);
// export default observer(() => <HotUpdateApp />);

export default App;
