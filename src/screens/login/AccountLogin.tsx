// 登录页面
import React, { useCallback, version } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '@src/components';

import { exceptionCapture } from '@src/common';
import { appStore, Storage, userStore } from '@src/store';
import { GQL, useMutation } from '@src/apollo';

const AccountLogin = () => {
    const navigation = useNavigation();

    const [Account, setAccount] = React.useState('');
    const [Passwd, setPasswd] = React.useState('');

    const [toastMsg, setToastMsg] = React.useState('');
    const toast = (msg: string, isRepeat?: boolean) => {
        if (msg === toastMsg && isRepeat) return;
        setToastMsg(msg);
        Toast.show({ content: msg, layout: 'top', duration: 1000 });
    };

    const [signInMutation] = useMutation(GQL.signInMutation, {
        variables: {
            account: Account,
            password: Passwd,
            uuid: Device.UUID,
        },
    });

    // 登录
    const onLogin = useCallback(async () => {
        const [error, result] = await exceptionCapture(signInMutation);
        if (error) {
            toast(error?.message);
        } else if (result.data.signIn) {
            // 登录成功,更新用户全局状态并退出登陆页面
            toast('登陆成功');
            userStore.signIn(result.data.signIn);
            navigation.goBack();
            navigation.goBack();
        } else {
            toast('登录失败，请尝试其他方式登录');
        }
    }, []);

    return (
        <PageContainer title="账号密码登陆" white autoKeyboardInsets={false}>
            {/* 页面内容 */}
            <View style={[styles.pageContent, { flex: 1 }]}>
                <View style={{ marginTop: 30 }}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(account) => setAccount(account)}
                        value={Account}
                        placeholder="请输入账号/用户名/手机号"
                        numberOfLines={1}
                    />

                    <View style={[styles.textInput, { flexDirection: 'row' }]}>
                        <TextInput
                            style={{ flex: 1, padding: 0 }}
                            onChangeText={(passwd) => setPasswd(passwd)}
                            value={Passwd}
                            placeholder="请输入密码"
                            numberOfLines={1}
                            secureTextEntry={true}
                        />
                        <TouchableOpacity
                            style={styles.textCenter}
                            onPress={() => {
                                // TODO: 这里可实现判断用户有无输入账号，有的话将其带入找回密码的输入框提升用户体验
                                navigation.navigate('获取验证码');
                            }}>
                            <Text style={styles.aColor}>忘记密码？</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 35 }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (Account.length <= 0 || Passwd.length <= 0) {
                                toast('账号密码不得为空！');
                                return;
                            }
                            onLogin();
                        }}>
                        <View style={[styles.textCenter, styles.borderButtom]}>
                            <Text style={styles.buttonText} numberOfLines={1}>
                                立即登陆
                            </Text>
                        </View>
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

export default AccountLogin;

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
