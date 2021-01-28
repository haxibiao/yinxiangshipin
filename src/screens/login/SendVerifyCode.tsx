import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Iconfont, DebouncedPressable, NavBarHeader, Loading } from '@src/components';
import { exceptionCapture, WeChatAuth, useAuthCode } from '@src/common';
import { GQL, errorMessage, useMutation, useApolloClient } from '@src/apollo';
import { observer, userStore, appStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function index() {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState(0);
    const inputPhoneNumber = useCallback((val) => {
        const number = val?.replace(/[^0-9]/gi, '') || '';
        setPhoneNumber(number);
    }, []);

    const [loading, setLoading] = useState(false);
    const disabledSignIn = phoneNumber.length !== 11 || loading;
    const fetchAuthCode = useCallback(async (phone, action = 'USER_LOGIN') => {
        function otherLogin() {
            return appStore.client.mutate({
                mutation: GQL.sendVerifyCodeMutation,
                variables: {
                    phone,
                    action,
                },
            });
        }
        if (appStore.client) {
            setLoading(true);
            const [err, res] = await exceptionCapture(otherLogin);
            const code = res?.data?.sendVerifyCode?.code;
            if (code) {
                navigation.navigate('AuthCodeLogin', { phone, code });
            } else {
                Toast.show({ content: '获取验证码失败', layout: 'top' });
            }
            setLoading(false);
        } else {
            Toast.show({ content: '获取验证码失败', layout: 'top' });
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
                <View style={styles.pageTop}>
                    <Text style={styles.title}>手机号码登录</Text>
                    <View style={styles.protocol}>
                        <Text style={styles.grayText}>
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
                <View>
                    <View style={styles.inputBox}>
                        <View style={styles.inputLabel}>
                            <Iconfont name="iphone" color="#202020" size={font(20)} />
                            <View style={styles.labelBorder} />
                        </View>
                        <TextInput
                            style={styles.inputStyle}
                            value={phoneNumber}
                            onChangeText={inputPhoneNumber}
                            maxLength={11}
                            numberOfLines={1}
                            placeholder="请输入手机号"
                            keyboardType="numeric"
                        />
                        <DebouncedPressable
                            style={[styles.closeBtn, !phoneNumber && { opacity: 0 }]}
                            disabled={!phoneNumber}
                            onPress={() => inputPhoneNumber()}>
                            <Iconfont name="guanbi1" size={font(12)} color="#fff" />
                        </DebouncedPressable>
                    </View>
                    <Text style={styles.grayText}>未注册的手机号通过验证后将会自动注册</Text>
                    <DebouncedPressable
                        style={[styles.signInButton, !disabledSignIn && styles.numberBtn]}
                        disabled={disabledSignIn}
                        onPress={() => fetchAuthCode(phoneNumber)}>
                        {loading ? (
                            <ActivityIndicator size={'small'} color="#fff" />
                        ) : (
                            <Text style={styles.signInButtonText}>获取登录验证码</Text>
                        )}
                    </DebouncedPressable>
                    <View style={styles.other}>
                        <DebouncedPressable onPress={() => navigation.navigate('AccountLogin')}>
                            <Text style={styles.lightText}>密码登录</Text>
                        </DebouncedPressable>
                        <DebouncedPressable onPress={wxLogin}>
                            <Text style={styles.lightText}>微信登录</Text>
                        </DebouncedPressable>
                    </View>
                </View>
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
        paddingHorizontal: percent(7),
    },
    pageTop: {
        marginBottom: pixel(35),
    },
    title: {
        marginTop: pixel(20),
        fontSize: font(24),
        fontWeight: 'bold',
        color: '#202020',
    },
    protocol: {
        marginTop: pixel(10),
    },
    grayText: {
        fontSize: font(13),
        color: '#909090',
    },
    inputBox: {
        marginBottom: pixel(10),
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(44),
        paddingHorizontal: pixel(14),
        borderRadius: pixel(4),
        backgroundColor: '#f6f6f6',
    },
    inputLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        marginRight: pixel(10),
    },
    labelBorder: {
        width: Device.minimumPixel,
        height: pixel(10),
        marginLeft: pixel(10),
        backgroundColor: '#b2b2b2',
    },
    inputStyle: {
        flex: 1,
        alignSelf: 'stretch',
        paddingVertical: pixel(10),
    },
    closeBtn: {
        width: pixel(16),
        height: pixel(16),
        borderRadius: pixel(8),
        backgroundColor: '#b2b2b2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInButton: {
        marginTop: pixel(20),
        marginBottom: pixel(10),
        height: pixel(44),
        borderRadius: pixel(4),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e4e4e4',
    },
    numberBtn: {
        backgroundColor: '#FE2C54',
    },
    signInButtonText: {
        fontSize: font(16),
        fontWeight: 'bold',
        color: '#ffffff',
    },
    other: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    lightText: {
        paddingVertical: pixel(10),
        fontSize: font(13),
        color: Theme.link,
    },
});
