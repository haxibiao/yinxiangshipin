import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { HxfButton, PageContainer } from 'components';
import { compose, graphql, GQL } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@apollo/react-hooks';

const RetrievePasswordScreen = (props: any) => {
    const { navigation } = props;
    const route = useRoute();
    const { phone } = route.params;

    const time = 59;
    let timer: any;
    let time_remaining = time ? time - 1 : 60;
    const [tips, settips] = React.useState(`${time_remaining}s后重新发送`);
    const [code, setcode] = React.useState('');
    const [password, setpassword] = React.useState('');
    const [submitting, setsubmitting] = React.useState(false);

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
            setsubmitting(false);
            Toast.show({ content: '新密码设置成功' });
            navigation.pop(2);
        },
        onError: (error: any) => {
            setsubmitting(false);
            Toast.show({ content: error });
        },
        errorPolicy: 'all',
    });

    const [SendVerifyCodeMutation] = useMutation(GQL.SendVerifyCodeMutation, {
        variables: {
            phone,
            action: 'RESET_PASSWORD',
        },
        onCompleted: (result: any) => {
            setsubmitting(false);
            countDown();
        },
        onError: (error: any) => {
            setsubmitting(false);
            Toast.show({ content: error });
        },
        errorPolicy: 'all',
    });

    const countDown = () => {
        timer = setInterval(() => {
            --time_remaining;
            if (time_remaining === 0) {
                time_remaining = 60;
                settips('重新获取验证码');
                return;
            }
            settips(time_remaining + 's后重新发送');
        }, 1000);
    };

    // 重新获取验证码
    const resendVerificationCode = async () => {
        setsubmitting(true);
        SendVerifyCodeMutation();
    };

    // 重置密码
    const resetPassword = () => {
        // console.log('verify code : ', code);
        setsubmitting(true);
        retrievePasswordMutation();
    };

    return (
        <PageContainer title="重置密码" white submitting={submitting}>
            <View style={styles.header}>
                <Text style={{ color: Theme.black, fontSize: 20, fontWeight: '600' }}>设置新密码</Text>
            </View>
            <View style={styles.textWrap}>
                <TextInput
                    placeholder="请输入验证码"
                    selectionColor={Theme.primaryColor}
                    maxLength={48}
                    style={styles.textInput}
                    onChangeText={(value) => setcode(value)}
                />
            </View>
            <View style={styles.textWrap}>
                <TextInput
                    placeholder="请输入新密码"
                    selectionColor={Theme.primaryColor}
                    maxLength={48}
                    style={styles.textInput}
                    onChangeText={(value) => setpassword(value)}
                />
            </View>
            <TouchableOpacity
                style={{ marginHorizontal: pixel(25), marginTop: pixel(15) }}
                onPress={resendVerificationCode}
                disabled={!(time_remaining === 60)}>
                <Text style={{ color: time_remaining === 60 ? Theme.primaryColor : Theme.grey, fontSize: 13 }}>
                    {tips}
                </Text>
            </TouchableOpacity>

            <HxfButton
                title="完成"
                onPress={() => resetPassword()}
                disabled={code && password ? false : true}
                style={{
                    height: pixel(38),
                    fontSize: font(16),
                    marginHorizontal: pixel(25),
                    marginTop: pixel(30),
                    backgroundColor: Theme.primaryColor,
                }}
            />
        </PageContainer>
    );
};

export default RetrievePasswordScreen;

const styles = StyleSheet.create({
    header: {
        marginBottom: pixel(40),
        marginTop: pixel(50),
        paddingHorizontal: pixel(25),
    },
    button: {
        borderRadius: pixel(5),
        height: pixel(40),
        marginHorizontal: pixel(15),
        marginTop: pixel(35),
    },
    container: {
        backgroundColor: Theme.white || '#FFF',
        flex: 1,
        paddingHorizontal: pixel(20),
    },
    textInput: {
        color: Theme.primaryFont,
        fontSize: font(16),
        height: pixel(50),
        padding: 0,
    },
    textWrap: {
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: pixel(0.5),
        marginHorizontal: pixel(25),
        marginTop: pixel(40),
        paddingHorizontal: 0,
    },
});
