import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { HxfButton, PageContainer } from '@src/components';
import { compose, graphql, GQL } from '@src/apollo';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/react-hooks';

const VerificationScreen = (props: any) => {
    const navigation = useNavigation();
    const [phone, setphone] = React.useState('');
    const [submitting, setsubmitting] = React.useState(false);

    const [SendVerifyCodeMutation] = useMutation(GQL.SendVerifyCodeMutation, {
        variables: {
            phone,
            action: 'RESET_PASSWORD',
        },
        onCompleted: (result: any) => {
            setsubmitting(false);
            navigation.navigate('RetrievePassword', {
                time: new Date().getTime(),
                phone,
            });
        },
        onError: (error: any) => {
            setsubmitting(false);
            Toast.show({ content: error });
        },
        errorPolicy: 'all',
    });

    const sendVerificationCode = async () => {
        if (phone) {
            setsubmitting(true);
            SendVerifyCodeMutation();
        } else {
            Toast.show({ content: '账号获取失败，请重新登录' });
        }
    };

    return (
        <PageContainer title="找回密码" white submitting={submitting}>
            <View style={styles.container}>
                <View style={{ marginTop: 50, paddingHorizontal: 25 }}>
                    <Text style={{ color: Theme.black, fontSize: 20, fontWeight: '600' }}>获取验证码</Text>
                </View>
                <View style={styles.textWrap}>
                    <TextInput
                        placeholder="请输入手机号"
                        selectionColor={Theme.primaryColor}
                        maxLength={48}
                        keyboardType="numeric"
                        style={styles.textInput}
                        onChangeText={(value) => setphone(value)}
                    />
                </View>

                <HxfButton title="获取验证码" gradient={true} style={styles.button} onPress={sendVerificationCode} />
            </View>
        </PageContainer>
    );
};

export default VerificationScreen;

const styles = StyleSheet.create({
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
