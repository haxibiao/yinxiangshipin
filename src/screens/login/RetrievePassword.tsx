import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { HxfButton, Iconfont, DebouncedPressable, NavBarHeader, Loading } from '@src/components';
import { exceptionCapture, WeChatAuth, useAuthCode } from '@src/common';
import { GQL, errorMessage, useMutation, useApolloClient } from '@src/apollo';
import { observer, userStore, appStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';

export default (props: any) => {
    const navigation = useNavigation();
    // 输入手机号
    const [phoneNumber, setPhoneNumber] = useState(0);
    const inputPhoneNumber = useCallback((val) => {
        const number = val?.replace(/[^0-9]/gi, '') || '';
        setPhoneNumber(number);
    }, []);

    const [loading, setLoading] = useState(false);
    // 获取验证码
    const getVerifyCode = async () => {
        function otherLogin() {
            return appStore.client.mutate({
                mutation: GQL.sendVerifyCodeMutation,
                variables: {
                    phone: phoneNumber,
                    action: 'RESET_PASSWORD',
                },
            });
        }
        if (appStore.client) {
            setLoading(true);
            const [err, res] = await exceptionCapture(otherLogin);
            const code = res?.data?.sendVerifyCode?.code;
            if (code) {
                navigation.navigate('ResetPassword', { phone: phoneNumber, code });
            } else {
                Toast.show({ content: '获取验证码失败', layout: 'top' });
            }
            setLoading(false);
        } else {
            Toast.show({ content: '获取验证码失败', layout: 'top' });
        }
    };

    const disabledBtn = phoneNumber.length !== 11 || loading;

    return (
        <View style={styles.container}>
            <NavBarHeader
                title="找回密码"
                rightComponent={
                    <DebouncedPressable style={styles.right} onPress={() => navigation.navigate('LoginHelp')}>
                        <Text style={styles.rightText}>帮助</Text>
                    </DebouncedPressable>
                }
            />
            <View style={styles.content}>
                <View style={styles.pageTop}>
                    <Text style={styles.title}>获取验证码</Text>
                    <View style={styles.protocol}>
                        <Text style={styles.grayText}>印象视频将会发送短信到该手机号</Text>
                    </View>
                </View>
                <View style={styles.inputBox}>
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
                <HxfButton
                    style={styles.mainBtn}
                    title="获取验证码"
                    gradient={true}
                    disabled={disabledBtn}
                    loading={loading}
                    onPress={getVerifyCode}
                />
            </View>
        </View>
    );
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
    closeBtn: {
        width: pixel(16),
        height: pixel(16),
        borderRadius: pixel(8),
        backgroundColor: '#b2b2b2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputStyle: {
        flex: 1,
        alignSelf: 'stretch',
        paddingVertical: pixel(10),
    },
    mainBtn: {
        marginTop: pixel(20),
        borderRadius: pixel(4),
        height: pixel(44),
    },
});
