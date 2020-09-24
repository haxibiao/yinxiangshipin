// 登录页面
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PageContainer, SafeText } from '@src/components';

import UserAgreement from './components/UserAgreement';

import { appStore, Storage, userStore } from '@src/store';
import { GQL, useMutation } from '@src/apollo';

const MobileLogin = () => {
    const navigation = useNavigation();

    const [Account, setAccount] = React.useState('');
    const [Captcha, setCaptcha] = React.useState('');
    const [Passwd, setPasswd] = React.useState('');
    const [ConfirmPasswd, setConfirmPasswd] = React.useState('');

    // 页面个性提示框
    const toast = (smg: string) => {
        Toast.show({ content: smg, layout: 'top' });
    };

    // 获取验证码
    const [codeTiming, setCodeTiming] = React.useState(60);
    const getVerifyCode = () => {
        if (codeTiming >= 60 || codeTiming <= 0) {
            // 开始获取验证码，开始定时

            if (Account.length !== 11 || !/^1[3456789]\d{9}$/.test(Account)) {
                // 手机号输入错误
                toast('请检查你的手机号是否输入正确！');
                return;
            }

            // 调用获取验证码接口
            VerifyCode();
        }
    };

    const [VerifyCode] = useMutation(GQL.SendVerifyCodeMutation, {
        variables: {
            phone: Account,
            action: 'USER_LOGIN',
        },
        onCompleted: (data: any) => {
            let i = 60;
            let vCodeInterval = setInterval(() => {
                setCodeTiming(i--);
                if (i < 0) {
                    clearInterval(vCodeInterval);
                    vCodeInterval = null;
                }
            }, 1000);
        },
        onError: (error: any) => {
            toast(error.toString().replace('Error: GraphQL error: ', '') || '获取验证码错误！');
        },
    });

    // 验证码登陆
    const smsSign = () => {
        if (Account.length < 11 || Captcha.length < 1) {
            toast('请输入手机号和验证码');
        } else {
            // 开始请求登陆
            smsSignIn();
        }
    };
    const [smsSignIn] = useMutation(GQL.smsSignInMutation, {
        variables: {
            phone: Account,
            code: Captcha,
        },
        onCompleted: (result: any) => {
            // 登录成功,更新用户全局状态并退出登陆页面
            // console.log('登陆成功', result);
            userStore.signIn(result.smsSignIn);
            toast('登陆成功');
            navigation.goBack();
            navigation.goBack();
        },
        onError: (error: any) => {
            toast(error.toString().replace('Error: GraphQL error: ', '') || '服务器发生错误，请稍后重试！');
        },
    });

    return (
        <PageContainer title="手机号码登陆" white>
            {/* 页面内容 */}
            <View style={[styles.pageContent, { flex: 1 }]}>
                <View style={{ marginTop: 30 }}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(account) => setAccount(account)}
                        value={Account}
                        placeholder="请输入你的手机号"
                        numberOfLines={1}
                    />

                    <View style={[styles.textInput, { flexDirection: 'row' }]}>
                        <TextInput
                            style={{ flex: 1, padding: 0 }}
                            onChangeText={(text) => setCaptcha(text)}
                            value={Captcha}
                            placeholder="请输入验证码"
                            numberOfLines={1}
                        />
                        <TouchableOpacity style={[styles.textCenter]} onPress={() => getVerifyCode()}>
                            <SafeText
                                style={{
                                    fontWeight: 'bold',
                                    minWidth: pixel(80),
                                    color: codeTiming >= 60 || codeTiming <= 0 ? '#16FA' : '#16F4',
                                }}>
                                {codeTiming >= 60 || codeTiming <= 0 ? '获取验证码' : '重新发送(' + codeTiming + 's)'}
                            </SafeText>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 35 }}>
                    <TouchableOpacity style={[styles.textCenter, styles.borderButtom]} onPress={() => smsSign()}>
                        <SafeText style={styles.buttonText}>登陆账号</SafeText>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.headRow, styles.textCenter, { paddingBottom: 15 }]}>
                <Text style={{ color: '#0006' }}>登陆代表你已阅读并同意</Text>
                <TouchableOpacity onPress={() => navigation.navigate('UserProtocol')}>
                    <Text style={{}}>《用户协议》</Text>
                </TouchableOpacity>
                <Text style={{ color: '#0006' }}>和</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                    <Text style={{}}>《隐私策略》</Text>
                </TouchableOpacity>
            </View>
        </PageContainer>
    );
};

export default MobileLogin;

const styles = StyleSheet.create({
    aColor: {
        color: '#16FA',
    },
    borderButtom: {
        backgroundColor: Theme.secondaryColor,
        borderRadius: 50,
        paddingVertical: 13,
    },
    buttonText: {
        fontSize: pixel(16),
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        flex: 1,
    },
    headRow: {
        flexDirection: 'row',
    },
    icoImag: {
        height: 22,
        width: 22,
    },
    pageContent: {
        paddingHorizontal: 25,
    },
    pageTitle: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
    },
    pageTitleText: {
        color: '#000A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textCenter: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        marginTop: 30,
        padding: 0,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#9996',
    },
});
