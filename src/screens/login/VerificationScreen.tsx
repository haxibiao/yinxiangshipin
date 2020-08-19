import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { PageContainer, HxfButton, Loading } from '@src/components';
import { GQL, errorMessage } from '@src/apollo';
import { useMutation } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';

const VerificationScreen = (props: any) => {
    const navigation = useNavigation();
    const [phone, setPhoneNumber] = React.useState('');

    const [SendVerifyCodeMutation] = useMutation(GQL.SendVerifyCodeMutation, {
        variables: {
            phone,
            action: 'RESET_PASSWORD',
        },
        onCompleted: (result: any) => {
            Loading.hide();
            navigation.navigate('RetrievePassword', {
                phone,
                verifyCode: result?.sendVerifyCode?.code,
                time: new Date().getTime(),
            });
        },
        onError: (error: any) => {
            Loading.hide();
            Toast.show({ content: errorMessage(error) });
        },
        errorPolicy: 'all',
    });

    const sendVerificationCode = async () => {
        if (phone) {
            Loading.show('loading');
            SendVerifyCodeMutation();
        } else {
            Toast.show({ content: '账号获取失败，请重新登录' });
        }
    };

    return (
        <PageContainer title="找回密码" white>
            <View style={styles.container}>
                <Text style={styles.title}>获取验证码</Text>
                <View style={styles.textWrap}>
                    <TextInput
                        placeholder="请输入手机号"
                        selectionColor={Theme.primaryColor}
                        maxLength={48}
                        keyboardType="numeric"
                        style={styles.textInput}
                        onChangeText={(value) => setPhoneNumber(value)}
                    />
                </View>
                <HxfButton title="获取验证码" gradient={true} style={styles.button} onPress={sendVerificationCode} />
            </View>
        </PageContainer>
    );
};

export default VerificationScreen;

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
