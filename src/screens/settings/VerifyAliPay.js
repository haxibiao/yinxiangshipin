import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { PageContainer, TouchFeedback, HxfButton, CustomTextInput } from 'components';
import { useMutation, GQL, errorMessage } from '@src/apollo';
import { observer, userStore } from '@src/store';

export default observer(({ navigation }) => {
    const phone = userStore?.me?.phone;

    const [sendVerifyCodeMutation, { loading }] = useMutation(GQL.SendVerifyCodeMutation, {
        variables: {
            phone,
            action: 'USER_INFO_CHANGE',
        },
        errorPolicy: 'all',
    });

    const sendVerificationCode = useCallback(async () => {
        if (phone) {
            try {
                const result = await sendVerifyCodeMutation();
                navigation.navigate('BindAliPay', {
                    code: result.data.sendVerifyCode.code,
                });
            } catch (ex) {
                Toast.show({ content: errorMessage(ex, '发送验证码失败') });
            }
        } else {
            navigation.navigate('BindingAccount');
        }
    }, [sendVerifyCodeMutation]);

    return (
        <PageContainer title="安全验证" submitting={loading} white>
            <View style={styles.container}>
                <View style={{ marginTop: pixel(50), paddingHorizontal: pixel(25), paddingBottom: pixel(15) }}>
                    <Text
                        style={{
                            color: Theme.black,
                            fontSize: font(20),
                            fontWeight: '600',
                            paddingBottom: pixel(20),
                        }}>
                        验证账号
                    </Text>
                    <Text style={styles.tipsText}>绑定支付宝信息需要验证账号的安全性</Text>
                </View>
                <View style={styles.inputWrap}>
                    <TextInput
                        placeholder={phone ? '发送验证码至 ' + phone : '请先绑定手机号'}
                        style={{ height: pixel(48) }}
                        editable={false}
                    />
                </View>
                <HxfButton
                    title={phone ? '发送验证码' : '前往绑定手机号'}
                    style={styles.button}
                    onPress={sendVerificationCode}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white || '#FFF',
    },
    header: {
        paddingHorizontal: pixel(25),
        marginVertical: pixel(15),
    },
    tips: {
        fontWeight: '300',
        color: Theme.grey,
        lineHeight: font(20),
    },
    tipsText: {
        color: Theme.grey,
        fontSize: font(13),
    },
    inputWrap: {
        borderBottomWidth: pixel(0.5),
        borderBottomColor: Theme.borderColor,
        marginHorizontal: pixel(25),
        paddingHorizontal: 0,
    },
    button: {
        height: pixel(38),
        borderRadius: pixel(5),
        marginHorizontal: pixel(25),
        marginTop: pixel(35),
        backgroundColor: Theme.primaryColor,
    },
    footer: {
        fontSize: font(12),
        lineHeight: font(16),
        color: Theme.secondaryColor,
        paddingTop: pixel(15),
    },
});
