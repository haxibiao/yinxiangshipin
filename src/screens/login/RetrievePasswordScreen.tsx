import React, { useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { PageContainer, HxfButton, Loading } from 'components';
import { GQL, errorMessage } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@apollo/react-hooks';

const RetrievePasswordScreen = (props: any) => {
    const navigation = useNavigation();
    const route = useRoute();
    const phone = route?.params?.phone;
    const verifyCode = route?.params?.verifyCode;

    const time = 59;
    let timer: any;
    let time_remaining = time ? time - 1 : 60;
    const [content, setContent] = React.useState(`${time_remaining}s后重新发送`);
    const [code, setCode] = React.useState('');
    const [password, setPassword] = React.useState('');

    React.useEffect(() => {
        countDown();
        return () => {
            timer && clearInterval(timer);
        };
    }, []);

    React.useEffect(() => {
        if (time_remaining === 60) {
            timer && clearInterval(timer);
        }
    }, [time_remaining]);

    const [retrievePasswordMutation] = useMutation(GQL.retrievePasswordMutation, {
        variables: {
            phone,
            newPassword: password,
            code,
        },
        onCompleted: (result: any) => {
            Loading.hide();
            Toast.show({ content: '新密码设置成功' });
            navigation.pop(2);
        },
        onError: (error: any) => {
            Loading.hide();
            Toast.show({ content: errorMessage(error) });
        },
        errorPolicy: 'all',
    });

    const [SendVerifyCodeMutation] = useMutation(GQL.SendVerifyCodeMutation, {
        variables: {
            phone,
            action: 'RESET_PASSWORD',
        },
        onCompleted: (result: any) => {
            Loading.hide();
            countDown();
        },
        onError: (error: any) => {
            Loading.hide();
            Toast.show({ content: error });
        },
        errorPolicy: 'all',
    });

    const countDown = () => {
        timer = setInterval(() => {
            --time_remaining;
            if (time_remaining === 0) {
                time_remaining = 60;
                setContent('重新获取验证码');
                return;
            }
            setContent(time_remaining + 's后重新发送');
        }, 1000);
    };

    // 重新获取验证码
    const resendVerificationCode = useCallback(async () => {
        Loading.show('loading');
        SendVerifyCodeMutation();
    }, []);

    // 重置密码
    const resetPassword = useCallback(() => {
        if (verifyCode === code) {
            Loading.show('loading');
            retrievePasswordMutation();
        } else {
            Toast.show({ content: '验证码错误' });
        }
    }, [verifyCode, code]);

    return (
        <PageContainer title="重置密码" white>
            <View style={styles.container}>
                <Text style={styles.title}>设置新密码</Text>
                <View style={styles.textWrap}>
                    <TextInput
                        placeholder="请输入验证码"
                        selectionColor={'#2b2b2b'}
                        maxLength={6}
                        style={styles.textInput}
                        onChangeText={(value) => setCode(value)}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.textWrap}>
                    <TextInput
                        placeholder="请输入新密码"
                        selectionColor={'#2b2b2b'}
                        maxLength={16}
                        style={styles.textInput}
                        onChangeText={(value) => setPassword(value)}
                    />
                </View>
                <TouchableOpacity
                    style={{ marginTop: pixel(20) }}
                    onPress={resendVerificationCode}
                    disabled={!(time_remaining === 60)}>
                    <Text style={{ color: time_remaining === 60 ? '#2b2b2b' : '#b2b2b2', fontSize: font(13) }}>
                        {content}
                    </Text>
                </TouchableOpacity>
                <HxfButton
                    title="完成"
                    gradient={true}
                    onPress={resetPassword}
                    disabled={code?.length < 4 || password?.length < 4}
                    style={styles.button}
                />
            </View>
        </PageContainer>
    );
};

export default RetrievePasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: pixel(25),
        paddingTop: pixel(20),
    },
    title: {
        color: '#2b2b2b',
        fontSize: font(20),
        fontWeight: 'bold',
    },
    textWrap: {
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: pixel(1),
        marginTop: pixel(20),
    },
    textInput: {
        color: '#2b2b2b',
        fontSize: font(16),
        height: pixel(50),
        paddingTop: 0,
        paddingVertical: pixel(5),
    },
    button: {
        borderRadius: pixel(5),
        height: pixel(42),
        marginTop: pixel(25),
    },
});
