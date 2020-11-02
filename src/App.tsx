import React, { Component, useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import codePush from 'react-native-code-push';
// apollo && Router
import { ApolloProvider as ClassApolloProvider } from 'react-apollo';
import { ApolloProvider, useClientBuilder, GQL } from './apollo';
import AppRouter from './router';
// WeChat
import * as WeChat from 'react-native-wechat-lib';
import { WechatAppId } from '../app.json';
// appContext
import { observer, appStore, adStore, userStore } from './store';
// apNotification
import { LoadingModal, WithdrawalNotificationModal, RewardNotificationModal, AppRemindModal } from './components/modal';
import { Toast } from './components';
//appPreparation
import Preparation from './Preparation';

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

// launch app
const App = observer(() => {
    const client = useClientBuilder(userStore.me?.token);

    useEffect(() => {
        // WeChat注册（微信分享）
        WeChat.registerApp(WechatAppId, 'http://yxsp.haxifang.cn/');
    }, []);

    return (
        <View style={styles.container}>
            <ClassApolloProvider client={client}>
                <ApolloProvider client={client}>
                    <Preparation />
                    <AppRouter />
                    <AppRemindModal />
                    <WithdrawalNotificationModal />
                    <RewardNotificationModal />
                    <LoadingModal />
                </ApolloProvider>
            </ClassApolloProvider>
            <Toast ref={(ref) => (global.Toast = ref)} />
        </View>
    );
});

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};
// const HotUpdateApp = codePush(codePushOptions)(App);
// export default observer(() => <HotUpdateApp />);

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
