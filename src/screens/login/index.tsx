import React, { Component, useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import { DebouncedPressable, Iconfont, NavBarHeader, Loading } from '@src/components';
import { exceptionCapture, WeChatAuth } from '@src/common';
import { GQL, errorMessage, useMutation, useApolloClient } from '@src/apollo';
import { observer, userStore, appStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BoxShadow } from 'react-native-shadow';
import UuidLoginView from './components/UuidLoginView';

export default function index() {
    const navigation = useNavigation();

    const autoSignIn = useCallback(async () => {
        function uuidLogin() {
            return appStore.client.mutate({
                mutation: GQL.autoSignInMutation,
                variables: { UUID: uuid },
            });
        }
        const uuid = Device.UUID;
        if (uuid && appStore.client) {
            Loading.show();
            const [err, res] = await exceptionCapture(uuidLogin);
            Loading.hide();
            const userData = res?.data?.autoSignIn;
            if (userData) {
                userStore.signIn(userData);
                navigation.navigate('Main', null, navigation.navigate('Personage'));
            } else {
                Toast.show({ content: '一键登录失败，请手动登录', layout: 'top' });
            }
        } else {
            Toast.show({ content: '一键登录失败，请手动登录', layout: 'top' });
        }
    }, []);

    const otherSignIn = useCallback(async (code: string, type: 'WECHAT' | 'PHONE') => {
        function otherLogin() {
            return appStore.client.mutate({
                mutation: GQL.otherSignInMutation,
                variables: {
                    code,
                    type,
                },
                errorPolicy: 'all',
            });
        }
        if (appStore.client) {
            Loading.show();
            const [err, res] = await exceptionCapture(otherLogin);
            Loading.hide();
            const userData = res?.data?.authSignIn;
            if (userData) {
                userStore.signIn(userData);
                navigation.navigate('Main', null, navigation.navigate('Personage'));
            } else {
                Toast.show({ content: '登录出错！', layout: 'top' });
            }
        } else {
            Toast.show({ content: '登录出错！', layout: 'top' });
        }
    }, []);

    const wxLogin = useCallback(() => {
        WeChatAuth({
            onSuccess: (code) => otherSignIn(code, 'WECHAT'),
            onFailed: () => Toast.show({ content: '微信登录出错！', layout: 'top' }),
        });
    }, []);

    return (
        <View style={styles.container}>
            <NavBarHeader
                rightComponent={
                    <DebouncedPressable style={styles.right} onPress={() => navigation.navigate('LoginHelp')}>
                        <Text style={styles.rightText}>帮助</Text>
                    </DebouncedPressable>
                }
            />
            <View style={styles.content}>
                <View style={styles.uuid}>
                    <BoxShadow setting={shadowSetting}>
                        <Image style={styles.appLogo} source={require('@app/assets/images/app_logo.png')} />
                    </BoxShadow>
                    <Text style={styles.uuidText}>{Device.UUID}</Text>
                    <Text style={styles.uuidDescText}>一键登录由本设备识别码关联账户</Text>
                </View>
                <View style={styles.signIn}>
                    <DebouncedPressable style={styles.signInButton} onPress={autoSignIn}>
                        <Text style={styles.signInButtonText}>本机一键登录</Text>
                    </DebouncedPressable>
                    <DebouncedPressable
                        style={[styles.signInButton, styles.numberBtn]}
                        onPress={() => navigation.navigate('SendVerifyCode')}>
                        <Text style={[styles.signInButtonText, { color: '#202020' }]}>手机号码登录</Text>
                    </DebouncedPressable>
                    <View style={styles.protocol}>
                        <Text style={styles.protocolText}>
                            登录代表您已同意
                            <Text style={{ color: Theme.link }} onPress={() => navigation.navigate('UserProtocol')}>
                                《用户协议》
                            </Text>
                            和
                            <Text style={{ color: Theme.link }} onPress={() => navigation.navigate('PrivacyPolicy')}>
                                《隐私政策》
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.other}>
                <DebouncedPressable style={styles.otherBtn} onPress={wxLogin}>
                    <Image style={styles.otherIcon} source={require('@app/assets/images/share/share_wx.png')} />
                </DebouncedPressable>
                <DebouncedPressable style={styles.otherBtn} onPress={() => navigation.navigate('AccountLogin')}>
                    <View style={styles.otherIcon}>
                        <Iconfont name="wode_xuanzhong" size={font(26)} color="#fff" />
                    </View>
                </DebouncedPressable>
            </View>
        </View>
    );
}

const shadowSetting = {
    width: pixel(66),
    height: pixel(66),
    color: '#FE2C54',
    border: pixel(3),
    radius: pixel(10),
    opacity: 0.6,
    x: 1,
    y: 2,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Device.bottomInset,
    },
    right: {
        paddingHorizontal: pixel(Theme.edgeDistance),
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightText: {
        color: '#202020',
        fontSize: font(16),
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    uuid: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    appLogo: {
        width: pixel(66),
        height: pixel(66),
    },
    uuidText: {
        marginTop: pixel(40),
        fontSize: font(24),
        fontWeight: 'bold',
        color: '#202020',
    },
    uuidDescText: {
        marginTop: pixel(10),
        fontSize: font(13),
        color: '#909090',
    },
    signIn: {
        paddingHorizontal: percent(7),
        marginVertical: pixel(60),
    },
    signInButton: {
        height: pixel(44),
        borderRadius: pixel(4),
        marginBottom: pixel(10),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FE2C54',
    },
    numberBtn: {
        borderWidth: pixel(1),
        borderColor: '#f0f0f0',
        backgroundColor: '#ffffff',
    },
    signInButtonText: {
        fontSize: font(16),
        fontWeight: 'bold',
        color: '#ffffff',
    },
    protocol: {
        marginTop: pixel(10),
    },
    protocolText: {
        textAlign: 'center',
        fontSize: font(13),
        color: '#909090',
        lineHeight: font(18),
    },
    other: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: pixel(20),
    },
    otherBtn: {
        paddingHorizontal: pixel(10),
    },
    otherIcon: {
        width: pixel(44),
        height: pixel(44),
        borderRadius: pixel(22),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3FA8FF',
    },
});
