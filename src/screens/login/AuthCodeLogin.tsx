import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Iconfont, HxfButton, NavBarHeader, Loading, DebouncedPressable } from '@src/components';
import { exceptionCapture, WeChatAuth, useAuthCode } from '@src/common';
import { GQL, errorMessage, useMutation, useApolloClient } from '@src/apollo';
import { observer, userStore, appStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function index() {
    const route = useRoute();
    const phone = route?.params?.phone;
    const navigation = useNavigation();
    const [verifyCode, setVerifyCode] = useState('');
    const disabledSignIn = verifyCode.length < 4;
    const inputVerifyCode = useCallback((val) => {
        const number = val.replace(/[^0-9]/gi, '');
        setVerifyCode(number);
    }, []);

    const { fetchAuthCode, countDown, loading } = useAuthCode();

    const onSignIn = useCallback(async (phone: string, code: string) => {
        function smsLogin() {
            return appStore.client.mutate({
                mutation: GQL.smsSignInMutation,
                variables: {
                    phone,
                    code,
                },
            });
        }
        if (appStore.client) {
            Loading.show();
            const [err, res] = await exceptionCapture(smsLogin);
            Loading.hide();
            const userData = res?.data?.smsSignIn;
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
                        <Text style={styles.grayText}>验证码已经通过短信发送至{phone}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.inputStyle}
                            value={verifyCode}
                            onChangeText={inputVerifyCode}
                            maxLength={6}
                            numberOfLines={1}
                            placeholder="请输入验证码"
                            keyboardType="numeric"
                        />
                        <DebouncedPressable
                            style={styles.inputLabel}
                            disabled={loading || !!countDown}
                            onPress={() => fetchAuthCode(phone)}>
                            {loading ? (
                                <ActivityIndicator size={'small'} color={Theme.primaryColor} />
                            ) : (
                                <Text style={[styles.grayText, !countDown && { color: Theme.primaryColor }]}>
                                    {countDown || '重新发送'}
                                </Text>
                            )}
                        </DebouncedPressable>
                    </View>
                    <HxfButton
                        title="登录"
                        gradient={true}
                        style={styles.signInButton}
                        titleStyle={styles.signInButtonText}
                        disabled={disabledSignIn}
                        onPress={() => onSignIn(phone, verifyCode)}
                    />
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
    lightText: {
        fontSize: font(13),
        color: Theme.link,
    },
    inputBox: {
        marginBottom: pixel(10),
        flexDirection: 'row',
        height: pixel(44),
        paddingHorizontal: pixel(14),
        borderRadius: pixel(4),
        backgroundColor: '#f6f6f6',
    },
    inputLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    signInButton: {
        marginVertical: pixel(20),
        height: pixel(44),
        borderRadius: pixel(4),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e4e4e4',
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
});
