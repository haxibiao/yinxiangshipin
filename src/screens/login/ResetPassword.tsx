import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { HxfButton, Iconfont, DebouncedPressable, NavBarHeader, Loading } from '@src/components';
import { exceptionCapture, WeChatAuth, useAuthCode } from '@src/common';
import { GQL, errorMessage, useMutation, useApolloClient } from '@src/apollo';
import { observer, userStore, appStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';

export default (props: any) => {
    const route = useRoute();
    const phone = route?.params?.phone;
    const navigation = useNavigation();
    //setVerifyCode
    const [verifyCode, setVerifyCode] = useState('');
    const disabledSignIn = verifyCode.length < 4;
    const inputVerifyCode = useCallback((val) => {
        const vd = val.replace(/[^0-9]/gi, '');
        setVerifyCode(vd);
    }, []);
    //setPassword
    const [password, setPassword] = useState('');
    const inputPassword = useCallback((val) => {
        const pw = val?.trim() || '';
        setPassword(pw);
    }, []);
    // 获取验证码
    const { fetchAuthCode, countDown, loading } = useAuthCode();
    // 重置密码
    const resetPassword = async () => {
        function mutation() {
            return appStore.client.mutate({
                mutation: GQL.retrievePasswordMutation,
                variables: {
                    phone,
                    newPassword: password,
                    code,
                },
            });
        }
        if (appStore.client) {
            Loading.show();
            const [err, res] = await exceptionCapture(mutation);
            Loading.hide();
            if (res?.data?.retrievePassword) {
                navigation.replace('AccountLogin');
            } else {
                Toast.show({ content: '重置密码失败', layout: 'top' });
            }
        } else {
            Toast.show({ content: '重置密码失败', layout: 'top' });
        }
    };

    const disabledBtn = verifyCode?.length < 4 || password?.length < 6;

    return (
        <View style={styles.container}>
            <NavBarHeader
                title="重置密码"
                rightComponent={
                    <DebouncedPressable style={styles.right} onPress={() => navigation.navigate('LoginHelp')}>
                        <Text style={styles.rightText}>帮助</Text>
                    </DebouncedPressable>
                }
            />
            <View style={styles.content}>
                <View style={styles.pageTop}>
                    <Text style={styles.title}>设置新密码</Text>
                    <View style={styles.protocol}>
                        <Text style={styles.grayText}>重新设置账号{phone}的登录密码</Text>
                    </View>
                </View>
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
                        onPress={() => fetchAuthCode(phone, 'RESET_PASSWORD')}>
                        {loading ? (
                            <ActivityIndicator size={'small'} color={Theme.primaryColor} />
                        ) : (
                            <Text style={[styles.grayText, !countDown && { color: Theme.primaryColor }]}>
                                {countDown || '重新发送'}
                            </Text>
                        )}
                    </DebouncedPressable>
                </View>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.inputStyle}
                        value={password}
                        onChangeText={inputPassword}
                        maxLength={16}
                        numberOfLines={1}
                        placeholder="设置新密码"
                    />
                    <DebouncedPressable
                        style={[styles.closeBtn, !password && { opacity: 0 }]}
                        disabled={!password}
                        onPress={() => inputPassword()}>
                        <Iconfont name="guanbi1" size={font(12)} color="#fff" />
                    </DebouncedPressable>
                </View>
                <HxfButton
                    style={styles.mainBtn}
                    title="重置密码"
                    gradient={true}
                    disabled={disabledBtn}
                    onPress={resetPassword}
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
