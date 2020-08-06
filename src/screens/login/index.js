import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { PageContainer } from '@src/components';
import { exceptionCapture } from '@src/common';
import { GQL, useMutation } from '@src/apollo';
import StoreContext, { observer } from '@src/store';

const thumbType = ['name', 'account', 'password'];

export default observer((props) => {
    const { navigation } = props;
    const store = useContext(StoreContext);
    const [submitting, toggleSubmitting] = useState(false);
    const [secure, setSecure] = useState(true);
    // const [thumb, setThumbType] = useState(false);
    const [signIn, toggleEntrance] = useState(true);
    const [formData, setFormData] = useState({ name: '', account: '', password: '' });
    const [signInMutation, { data: signInData }] = useMutation(GQL.signInMutation, {
        variables: {
            account: formData.account,
            password: formData.password,
            uuid: Device.UUID,
        },
    });
    const [signUpMutation, { data: signUpData }] = useMutation(GQL.signUpMutation, {
        variables: {
            name: formData.name,
            account: formData.account,
            password: formData.password,
            uuid: Device.UUID,
        },
    });
    const [autoSignInMutation, { data: autoSignInData }] = useMutation(GQL.autoSignInMutation, {
        variables: {
            UUID: Device.UUID,
        },
    });

    function resetForm() {
        setFormData({ name: '', account: '', password: '' });
    }

    function changeName(value) {
        setFormData({
            ...formData,
            name: value,
        });
    }

    function changeAccount(value) {
        setFormData({
            ...formData,
            account: value,
        });
    }

    function changePassword(value) {
        setFormData({
            ...formData,
            password: value,
        });
    }

    // 手动登录
    const onSignIn = useCallback(async () => {
        toggleSubmitting(true);
        const [error, result] = await exceptionCapture(signInMutation);
        toggleSubmitting(false);
        if (error) {
            Toast.show({ content: error.message || '登录失败', layout: 'top' });
        } else {
            store.userStore.signIn(Helper.syncGetter('data.signIn', result));
            navigation.goBack();
        }
    }, [signUpMutation]);

    // 手动注册
    const onSignUp = useCallback(async () => {
        toggleSubmitting(true);
        const [error, result] = await exceptionCapture(signUpMutation);
        toggleSubmitting(false);
        if (error) {
            Toast.show({ content: error.message || '注册失败', layout: 'top' });
        } else {
            store.userStore.signIn(Helper.syncGetter('data.signUp', result));
            navigation.goBack();
        }
    }, [signUpMutation]);

    // 使用本机UUID进行静默登录
    const onSilentLogin = useCallback(async () => {
        if (Device.UUID) {
            toggleSubmitting(true);
            const [error, result] = await exceptionCapture(autoSignInMutation);
            toggleSubmitting(false);
            if (error) {
                Toast.show({ content: error.message, layout: 'top' });
            } else {
                // 登录成功,更新用户全局状态
                const meInfo = Helper.syncGetter('data.autoSignIn', result);
                store.userStore.signIn(meInfo);
                navigation.goBack();
            }
        } else {
            Toast.show({ content: '一键登录失败，请手动登录', layout: 'top' });
        }
    }, []);

    useEffect(() => {
        resetForm();
    }, [signIn]);

    const disabled = !(formData.account && formData.password);

    return (
        <PageContainer autoKeyboardInsets={false} submitting={submitting} submitTips="loading" hiddenNavBar>
            <View style={styles.container}>
                {/* <View style={styles.registerCoverContainer}>
                    <Image source={require('@app/assets/images/login_cover.png')} style={styles.registerCover} />
                </View> */}
                <View>
                    <Text style={styles.logTitle}>欢迎来到印象视频</Text>
                    <View style={styles.register}>
                        <Text style={styles.noNumber}>{signIn ? '没印象视频账号?' : '绑定手机号登录更便捷'}</Text>

                        <TouchableOpacity onPress={() => toggleEntrance(!signIn)}>
                            <Text style={styles.touchRegister}>{signIn ? '立即注册' : '去登录'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View>
                    <View style={styles.alignImageText}>
                        <Image source={require('@app/assets/images/phone.png')} style={styles.phoneImage} />
                        <TextInput
                            placeholder="手机"
                            placeholderTextColor="rgba(0, 0, 0, 0.9)"
                            style={styles.textInput}
                            maxLength={11}
                            value={formData.account}
                            onChangeText={changeAccount}
                            keyboardType="numeric"
                        />
                    </View>
                    {!signIn && (
                        <View style={styles.alignImageText}>
                            <Image source={require('@app/assets/images/nickName.png')} style={styles.nickNameImage} />
                            <TextInput
                                placeholder="昵称"
                                placeholderTextColor="rgba(0, 0, 0, 0.9)"
                                style={styles.textInput}
                                maxLength={11}
                                value={formData.name}
                                onChangeText={changeName}
                            />
                        </View>
                    )}
                    <View style={styles.alignImageText}>
                        <Image source={require('@app/assets/images/pwd.png')} style={styles.pwdImage} />
                        <TextInput
                            placeholder="密码"
                            placeholderTextColor="rgba(0, 0, 0, 0.9)"
                            style={styles.textInput}
                            secureTextEntry={secure}
                            value={formData.password}
                            onChangeText={changePassword}
                            maxLength={16}
                        />
                    </View>

                    {signIn && (
                        <View style={styles.forgetPwdPage}>
                            <TouchableOpacity onPress={() => navigation.navigate('获取验证码')}>
                                <Text style={styles.forgetPwd}>忘记密码?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onSilentLogin}>
                                <Text style={styles.code}>一键登录</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.touchBtLogin, disabled && { backgroundColor: 'rgba(23, 171, 255, 0.3)' }]}
                        disabled={disabled}
                        onPress={signIn ? onSignIn : onSignUp}
                        gradient>
                        <Text style={styles.textLogin}>{signIn ? '登 录' : '注 册'}</Text>
                    </TouchableOpacity>
                    <View style={styles.font}>
                        <Text style={styles.smallBottomFont}> 登录即代表同意 </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('UserProtocol')}>
                                <Text style={styles.lastText}>《用户协议》</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                                <Text style={styles.lastText}>《隐私政策》</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    alignImageText: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: pixel(60),
    },
    code: {
        alignSelf: 'flex-end',
        color: 'rgba(23, 171, 255, 1)',
        fontSize: font(11),
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: pixel(28),
        marginVertical: pixel(60),
    },
    font: {
        alignItems: 'flex-end',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: pixel(8),
    },
    forgetPwd: {
        color: 'rgba(23, 171, 255, 1)',
        fontSize: font(11),
        paddingLeft: pixel(25),
    },
    forgetPwdPage: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: pixel(12),
    },
    lastText: {
        color: '#17ABFF',
        fontSize: font(11),
    },
    logTitle: {
        color: 'rgba(0, 0, 0, 1)',
        fontSize: font(24),
        fontWeight: 'bold',
        lineHeight: font(33.5),
    },
    nickNameImage: {
        height: pixel(13),
        width: pixel(13),
    },
    noNumber: {
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: font(12),
    },
    phoneImage: {
        height: pixel(13),
        width: pixel(12),
    },
    pwdImage: {
        height: pixel(14),
        width: pixel(13),
    },
    register: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        fontSize: font(12),
        marginTop: pixel(8),
    },
    smallBottomFont: {
        color: '#000',
        fontSize: font(11),
    },
    textInput: {
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: pixel(0.5),
        marginLeft: pixel(8),
        paddingVertical: pixel(4),
        width: pixel(270),
    },
    textLogin: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: font(20),
    },
    touchBtLogin: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(23, 171, 255, 1)',
        borderRadius: pixel(20),
        height: pixel(40),
        justifyContent: 'center',
        marginTop: pixel(30),
        width: pixel(270),
    },
    touchRegister: {
        color: 'rgba(27, 172, 255, 1)',
        fontSize: font(12),
        marginLeft: pixel(8),
    },
});
