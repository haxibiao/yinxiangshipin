import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TextInput } from 'react-native';
import { Iconfont, DebouncedPressable, NavBarHeader, Loading, HxfButton } from '@src/components';
import { exceptionCapture } from '@src/common';
import { GQL, errorMessage, useMutation, useApolloClient } from '@src/apollo';
import { observer, userStore, appStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function index() {
    const route = useRoute();
    const phone = route?.params?.phone;
    const navigation = useNavigation();
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const disabledSignIn = !(account?.length > 1 && password?.length > 1);
    const inputAccount = useCallback((val) => {
        const number = val?.replace(/[^0-9]/gi, '') || '';
        setAccount(number);
    }, []);
    const inputPassword = useCallback((val) => {
        const pw = val?.trim() || '';
        setPassword(pw);
    }, []);

    const onSignIn = async () => {
        function mutation() {
            return appStore.client.mutate({
                mutation: GQL.signInMutation,
                variables: {
                    account,
                    password,
                    uuid: Device.UUID,
                },
            });
        }
        if (appStore.client) {
            Loading.show();
            const [err, res] = await exceptionCapture(mutation);
            Loading.hide();
            const userData = res?.data?.signIn;
            if (userData) {
                userStore.signIn(userData);
                navigation.navigate('Main', null, navigation.navigate('Personage'));
            } else {
                Toast.show({ content: '登录出错！', layout: 'top' });
            }
        } else {
            Toast.show({ content: '登录出错！', layout: 'top' });
        }
    };

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
                    <Text style={styles.title}>账号密码登录</Text>
                    <View style={styles.protocol}>
                        <Text style={styles.grayText}>使用注册过的账号和密码登录</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.inputStyle}
                            value={account}
                            onChangeText={inputAccount}
                            maxLength={11}
                            numberOfLines={1}
                            placeholder="请输入账号"
                            keyboardType="numeric"
                        />
                        <DebouncedPressable
                            style={[styles.closeBtn, !account && { opacity: 0 }]}
                            disabled={!account}
                            onPress={() => inputAccount()}>
                            <Iconfont name="guanbi1" size={font(12)} color="#fff" />
                        </DebouncedPressable>
                    </View>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.inputStyle}
                            value={password}
                            onChangeText={inputPassword}
                            maxLength={16}
                            numberOfLines={1}
                            placeholder="请输入密码"
                        />
                        <DebouncedPressable
                            style={[styles.closeBtn, !password && { opacity: 0 }]}
                            disabled={!password}
                            onPress={() => inputPassword()}>
                            <Iconfont name="guanbi1" size={font(12)} color="#fff" />
                        </DebouncedPressable>
                    </View>
                    <HxfButton
                        title="登录"
                        gradient={true}
                        style={styles.signInButton}
                        titleStyle={styles.signInButtonText}
                        disabled={disabledSignIn}
                        onPress={onSignIn}
                    />
                </View>
                <View style={styles.tips}>
                    <DebouncedPressable onPress={() => navigation.navigate('RetrievePassword')}>
                        <Text style={styles.lightText}>忘记密码?</Text>
                    </DebouncedPressable>
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
    signInButton: {
        marginTop: pixel(20),
        marginBottom: pixel(10),
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
    tips: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    lightText: {
        paddingVertical: pixel(10),
        fontSize: font(13),
        color: Theme.link,
    },
});
