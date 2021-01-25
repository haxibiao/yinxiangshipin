import React, { Component, useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar, Platform, Alert } from 'react-native';
import {
    PageContainer,
    HxfTextInput,
    HxfButton,
    Row,
    Center,
    Iconfont,
    GradientView,
    SafeText,
    SvgIcon,
    SvgPath,
} from '@src/components';
import { exceptionCapture, useBounceAnimation } from '@src/common';
import { GQL, useMutation, useApolloClient, errorMessage } from '@src/apollo';
import { observer, userStore } from '@src/store';
import * as WeChat from 'react-native-wechat-lib';
// import Cmicsso from 'react-native-cmicsso';
import { Overlay } from 'teaset';
import UuidLoginView from './components/UuidLoginView';
import { appStore } from '@src/store';

const thumbType = ['name', 'account', 'password'];

export default observer((props: any) => {
    const { navigation } = props;
    const client = useApolloClient();
    const [submitting, toggleSubmitting] = useState(false);
    // const [signIn, toggleEntrance] = useState(true);
    //  const [isCmicssoSignIn, setIsCmicssoSignIn] = useState(false);
    const [formData, setFormData] = useState({ name: '', account: '', password: '' });
    const scope = 'snsapi_userinfo';
    const state = 'is_wx_login';

    // 第三方登陆请求
    const otherSignIn = useCallback(async (code: string, type: 'WECHAT' | 'PHONE') => {
        client
            .mutate({
                mutation: GQL.otherSignInMutation,
                variables: {
                    code,
                    type,
                },
                errorPolicy: 'all',
            })
            .then((result: any) => {
                // console.log('微信登陆请求回调：', result);
                closeLoading(); // 关闭登陆加载中动画
                const meInfo = result?.data?.authSignIn;

                if (!result || !meInfo || !meInfo.token) {
                    Toast.show({ content: '登陆失败，请稍后重试！', layout: 'top' });
                    return;
                }

                userStore.signIn(meInfo);
                navigation.goBack();
            })
            .catch((err: any) => {
                closeLoading(); // 关闭登陆加载中动画
                Toast.show({ content: errorMessage(err), layout: 'top' });
            });
    }, []);

    const WX_Login = useCallback(() => {
        WeChat.isWXAppInstalled().then((login: boolean) => {
            console.log('login', login);
            if (login) {
                showLoading();
                WeChat.sendAuthRequest(scope, state).then((description: any) => {
                    console.log('description', description);
                    otherSignIn(description.code, 'WECHAT');
                });
            } else {
                closeLoading();
                console.log('123', 123);
                Alert.alert('没有安装微信', '是否安装微信？', [
                    { text: '取消' },
                    { text: '确定', onPress: () => this.installWechat() },
                ]);
            }
        });
    }, []);

    // 手机号码一键登陆
    // const onCmicssoLogin = () => {
    //     showLoading(); // 显示登陆加载中动画

    //     if (Device.IOS) {
    //         // By: 目前 IOS 移动认证服务还未对接，所以判断是 IOS 设备或者没有连接移动网络将会跳转到 UUID 登陆逻辑
    //         // onSilentLogin();
    //         closeLoading(); // 关闭登陆加载中动画

    //         showUuidLoginWidows();
    //         return;
    //     }

    //     Cmicsso.loginAuth().then((data: any) => {
    //         const info = JSON.parse(data);
    //         const code = Helper.syncGetter('token', info);
    //         // console.log('一键登陆回调', info.resultCode, code, info);
    //         closeLoading(); // 关闭登陆加载中动画

    //         if (info.resultCode === '200027') {
    //             // 移动认证一键登陆失败，调用 UUID 登陆弹窗
    //             showUuidLoginWidows();
    //             return;
    //         }

    //         if (!code) {
    //             if (info?.resultCode !== '200020')
    //                 Toast.show({ content: info?.resultDesc || '登陆失败，请稍后重试！', layout: 'bottom' });

    //             return;
    //         }

    //         otherSignIn(code, 'PHONE');
    //     });
    // };

    // UUID 登陆弹窗
    const showUuidLoginWidows = () => {
        let popViewRef: any;
        if (Device.UUID) {
            // UUID 获取成功，进入 UUID 一键登陆逻辑
            const overlayView = (
                <Overlay.PopView
                    style={{ justifyContent: 'center' }}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    animated={true}
                    ref={(ref: any) => (popViewRef = ref)}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <UuidLoginView navigation={navigation} client={client} onClose={() => popViewRef?.close()} />
                    </View>
                </Overlay.PopView>
            );
            Overlay.show(overlayView);
        } else {
            // UUID 获取失败进入手机号获取验证码登陆逻辑
            Toast.show({ content: '一键登录失败，请手动登录', layout: 'top' });
        }
    };

    // 显示登陆中弹窗
    let popLoadingViewRef: any;
    const showLoading = () => {
        const overlayView = (
            <Overlay.PopView
                style={{ justifyContent: 'center' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={(ref: any) => (popLoadingViewRef = ref)}>
                <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <View
                        style={{
                            width: pixel(100),
                            height: pixel(100),
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            style={{ width: pixel(92), height: pixel(92) }}
                            source={require('@app/assets/images/ic_loginpage_loading.gif')}
                        />
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    };

    // 关闭登陆中弹窗
    const closeLoading = () => {
        if (popLoadingViewRef) {
            popLoadingViewRef.close();
        }
    };

    useEffect(() => {
        StatusBar.setBarStyle('dark-content');
    }, []);

    return (
        <PageContainer
            autoKeyboardInsets={false}
            submitting={submitting}
            style={{ flex: 1, backgroundColor: '#FFF' }}
            submitTips={'loading'}
            hiddenNavBar={true}>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Center>
                        <Image source={require('@app/assets/images/app_logo.png')} style={styles.logo} />
                    </Center>
                    <Center>
                        <Text style={{ marginBottom: 80, fontSize: font(18), fontWeight: 'bold' }}>{Device.UUID}</Text>
                    </Center>

                    {/* <View style={styles.groupFooter}>
                        <TouchableOpacity onPress={() => navigation.navigate('获取验证码')}>
                            <Text style={styles.grayText}>找回密码？</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                <View style={styles.header}>
                    <TouchableOpacity style={{ padding: pixel(5) }} onPress={() => navigation.pop()}>
                        <Iconfont name="guanbi1" size={pixel(20)} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: pixel(5) }} onPress={() => navigation.navigate('LoginHelp')}>
                        <Text style={styles.linkText}>{'遇到问题'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, backgroundColor: '#FFF' }} />

                <View style={{ marginHorizontal: pixel(Theme.itemSpace * 2), marginBottom: pixel(35) }}>
                    <TouchableOpacity onPress={showUuidLoginWidows}>
                        <Row
                            style={[
                                styles.buttonStyle,
                                {
                                    // Theme.secondaryColor
                                    backgroundColor: 'rgba(255,70,0,1)',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: pixel(80),
                                },
                            ]}>
                            {/* <Iconfont name="iphone" size={pixel(23)} /> */}
                            <SvgIcon name={SvgPath.phoneLogin} color={'#fff'} size={pixel(28)} />
                            <Text style={[styles.grayText, { color: '#fff' }]}>本机一键登录</Text>
                        </Row>
                    </TouchableOpacity>

                    <Row style={{ justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={[
                                styles.buttonStyle,
                                {
                                    flexDirection: 'row',
                                    backgroundColor: 'rgba(41,191,35,1)',
                                    // marginRight: pixel(25),
                                },
                            ]}
                            // navigation.navigate('MobileLogin')
                            onPress={() => WX_Login()}>
                            {/* <Image
                            style={{ width: pixel(20), height: pixel(20), marginRight: pixel(5) }}
                            source={require('@app/assets/images/ic_login_weichat.png')}
                        /> */}
                            <Row style={{ marginHorizontal: pixel(30) }}>
                                <SvgIcon size={23} color={'#fff'} name={SvgPath.weChatLogin} />
                                <SafeText style={[styles.buttonText, { marginLeft: pixel(5) }]}>微信登陆</SafeText>
                            </Row>

                            {/* ${Config.AppName || ''} */}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.buttonStyle,
                                {
                                    flexDirection: 'row',
                                    // backgroundColor: Theme.secondaryColor,
                                    backgroundColor: 'rgba(56,158,255,1)',
                                    // marginLeft: pixel(25),
                                },
                            ]}
                            onPress={() => navigation.navigate('LoginSwitch')}>
                            {/* <Image
                            style={{ width: pixel(20), height: pixel(20), marginRight: pixel(5) }}
                            source={require('@app/assets/images/ic_login_weichat.png')}
                        /> */}
                            <Row style={{ marginHorizontal: pixel(30) }}>
                                <SvgIcon name={SvgPath.SMS} color={'#fff'} size={18} />
                                <SafeText style={[styles.buttonText, { marginLeft: pixel(5) }]}>{`短信登陆`}</SafeText>
                            </Row>
                        </TouchableOpacity>
                    </Row>

                    <TouchableOpacity
                        // borderColor: '#0003', borderWidth: 0.5
                        style={[styles.buttonStyle, { flexDirection: 'row' }]}
                        onPress={() => {
                            navigation.navigate('LoginSwitch', { switchStatus: true });
                        }}>
                        <SafeText style={[styles.buttonText, { color: '#000' }]}>{`账号密码登陆`}</SafeText>
                    </TouchableOpacity>
                    <Row style={styles.protocol}>
                        <Text style={styles.bottomInfoText}>登录代表您已同意</Text>
                        <Row>
                            <TouchableOpacity onPress={() => navigation.navigate('UserProtocol')}>
                                <Text style={[styles.bottomInfoText, { color: Theme.secondaryColor }]}>
                                    《用户协议》
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.bottomInfoText}>和</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                                <Text style={[styles.bottomInfoText, { color: Theme.secondaryColor }]}>
                                    《隐私政策》
                                </Text>
                            </TouchableOpacity>
                        </Row>
                    </Row>
                </View>
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: appStore.viewportHeight + Theme.HOME_INDICATOR_HEIGHT,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    registerCoverContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    registerCover: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#6661',
    },
    header: {
        position: 'absolute',
        top: pixel(Theme.statusBarHeight + Theme.itemSpace),
        left: pixel(Theme.itemSpace),
        right: pixel(Theme.itemSpace),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: '#FFF',
        paddingTop: pixel(Theme.statusBarHeight + Theme.itemSpace + 80),
        paddingHorizontal: pixel(Theme.itemSpace * 2),
    },
    logo: {
        marginBottom: pixel(35),
        width: pixel(71),
        height: pixel(71),
        resizeMode: 'contain',
    },
    fieldGroup: {
        marginBottom: pixel(8),
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: pixel(4),
        paddingRight: pixel(10),
        borderColor: '#0003',
        borderWidth: 0.5,
    },
    inputStyle: {
        flex: 1,
        height: pixel(42),
        fontSize: pixel(13),
        paddingBottom: pixel(10),
        paddingTop: pixel(10),
        padding: pixel(10),
    },
    countdown: {
        padding: pixel(5),
    },
    countdownText: {
        fontSize: pixel(13),
        color: Theme.subTextColor,
    },
    buttonStyle: {
        marginTop: pixel(Theme.itemSpace),
        height: pixel(44),
        borderRadius: pixel(4),
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: pixel(16),
        fontWeight: 'bold',
        color: '#FFF',
    },
    boldText: {
        fontSize: pixel(16),
        fontWeight: 'bold',
    },
    grayText: {
        fontSize: pixel(18),
    },
    linkText: {
        fontSize: pixel(18),
    },
    groupFooter: {
        marginTop: pixel(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomInfoText: {
        fontSize: pixel(13),
    },
    protocol: {
        backgroundColor: '#FFF',
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + pixel(Theme.itemSpace),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pixel(Theme.itemSpace),
    },
});
