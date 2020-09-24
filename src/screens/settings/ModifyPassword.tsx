import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { PageContainer, HxfButton, PopOverlay, SafeText } from '@src/components';
import { GQL, useApolloClient } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userStore } from '@src/store';

export default function ModifyPassword() {
    const client = useApolloClient();
    const [password, onPasswordChange] = useState('');
    const [againPassword, onAgainPasswordChange] = useState('');
    const [submitting, onSubmitting] = useState(false);
    const navigation = useNavigation();
    const me = { ...userStore.me };
    const { id } = me;
    const disabledSumbit = useMemo(() => {
        let count = 0;
        const values = Object.values([password, againPassword]);
        values.forEach((item) => {
            if (item) {
                count++;
            }
        });
        if (count === values.length) {
            return false;
        }
        return true;
    }, [password, againPassword]);
    return (
        <PageContainer white title="修改密码" submitting={submitting}>
            <View style={{ marginVertical: pixel(35), paddingHorizontal: pixel(25) }}>
                <SafeText style={{ fontSize: font(20), fontWeight: '600' }}>提交新密码</SafeText>
            </View>

            <View style={styles.inputWrap}>
                <TextInput
                    placeholder="请输入新密码,不少于6位"
                    style={styles.textInput}
                    onChangeText={(text) => onPasswordChange(text)}
                    value={password}
                    secureTextEntry={true}
                    maxLength={16}
                />
            </View>
            <View style={styles.inputWrap}>
                <TextInput
                    placeholder="请再次输入新密码,不少于6位"
                    style={styles.textInput}
                    onChangeText={(text) => {
                        onAgainPasswordChange(text);
                    }}
                    value={againPassword}
                    secureTextEntry={true}
                    maxLength={16}
                />
            </View>

            <HxfButton
                title="完成"
                onPress={() => {
                    if (password.indexOf(' ') >= 0) {
                        Toast.show({ content: '请勿输入空格' });
                    } else if (password == '') {
                        Toast.show({ content: '您还没有输入密码' });
                    } else {
                        if (password != againPassword) {
                            Toast.show({ content: '两次密码输入的不一致，请重新输入' });
                        } else {
                            onSubmitting(true);

                            // TODO: 调用更新数据接口
                            client
                                .mutate({
                                    mutation: GQL.updateUserIntroduction,
                                    variables: { id: id, input: { password: password } },
                                })
                                .then((result) => {
                                    console.log('更新用户数据后返回的用户信息: ', result);
                                    Toast.show({ content: '修改成功' });
                                    navigation.goBack();
                                })
                                .catch((error) => {
                                    console.log('更新用户数据接口错误  error : ', error);
                                    PopOverlay({
                                        content: '网络错误，绑定失败，请稍后重试',
                                        onConfirm: async () => {},
                                    });
                                });
                        }
                    }
                }}
                style={[styles.button, disabledSumbit > 0 && { backgroundColor: 'rgba(23, 171, 255, 0.3)' }]}
            />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(23, 171, 255, 1)',
        borderRadius: pixel(20),
        height: pixel(40),
        justifyContent: 'center',
        marginTop: pixel(50),
        width: pixel(230),
    },
    inputWrap: {
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        borderBottomWidth: pixel(0.5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: pixel(15),
        marginTop: pixel(25),
    },
    textInput: {
        padding: pixel(0),
    },
});
