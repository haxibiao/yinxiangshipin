import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { PageContainer } from 'components';
import { GQL } from '@src/apollo';
import { useMutation } from '@apollo/react-hooks';
import { observer } from 'mobx-react';
import { appStore, userStore } from '@src/store';
const PhoneModify = observer((props: any) => {
    const [formDate, setFormDate] = useState({ telPhone: '', verificationCode: '', newTelPhone: '' });
    const [codeTime, setCodeTime] = useState(0); // 验证码倒计时
    const user = props.route.params?.user;
    const codes = useRef(0);
    const changeTelPhone = useCallback(value => {
        setFormDate(data => {
            return {
                ...data,
                telPhone: value,
            };
        });
    }, []);
    const changeNewTelPhone = useCallback(value => {
        setFormDate(data => {
            return {
                ...data,
                newTelPhone: value,
            };
        });
    }, []);
    const changeVerificationCode = useCallback(value => {
        setFormDate(data => {
            return {
                ...data,
                verificationCode: value,
            };
        });
    }, []);
    const getVerificationCode = useCallback(() => {
        verificationMutation(); // 获取参数值
        setCodeTime(5); // 设置倒计时
        const timer = setInterval(() => {
            setCodeTime(c => {
                if (c <= 0) {
                    clearInterval(timer);
                } else {
                    return --c;
                }
            }); // c ——> 形式参数
        }, 1000); // setInterval 计时器
    }, []);
    const submit = useCallback(() => {
        if (formDate.verificationCode !== codes.current) {
            console.log('验证码错误');
        }
        appStore.isLoading = true;
        updateUserInfoSecurity();
    }, [updateUserInfoSecurity]);
    // 修改
    const disabledSumbit = useMemo(() => {
        let count = 0;
        const values = Object.values(formDate);
        values.forEach(item => {
            if (item) {
                count++;
            }
        });
        if (count === values.length) {
            return false;
        }
        return true;
    }, [formDate]);

    return (
        <PageContainer title="修改手机号" white>
            <View style={styles.container}>
                <View style={styles.comentStyle}>
                    <Text style={styles.textFont}>旧手机号:</Text>
                    <TextInput
                        placeholder="请输入原来的11位手机号码"
                        maxLength={11}
                        placeholderTextColor="rgba(0, 0, 0, 0.15)"
                        style={styles.textIn}
                        onChangeText={changeTelPhone}
                        value={formDate.telPhone}
                        keyboardType="numeric"
                        textAlign="right"
                    />
                </View>
                <View style={styles.comentStyle}>
                    <Text style={styles.textFont}>新手机号:</Text>
                    <TextInput
                        placeholder="请输入新的11位手机号码"
                        maxLength={11}
                        placeholderTextColor="rgba(0, 0, 0, 0.15)"
                        style={styles.textIn}
                        onChangeText={changeNewTelPhone}
                        keyboardType="numeric"
                        value={formDate.newTelPhone}
                        textAlign="right"
                    />
                </View>
                <View style={styles.comentStyle}>
                    <Text style={styles.textFont}>验证码:</Text>
                    <TextInput
                        placeholder="请输入6位短信验证码"
                        maxLength={6}
                        placeholderTextColor="rgba(0, 0, 0, 0.15)"
                        style={styles.textIn}
                        onChangeText={changeVerificationCode}
                        value={formDate.verificationCode}
                        keyboardType="numeric"
                        textAlign="right"
                    />
                    <TouchableOpacity
                        style={[styles.CodeTouch, codeTime > 0 && { backgroundColor: 'rgba(23, 171, 255, 0.3) ' }]}
                        onPress={getVerificationCode}>
                        <Text
                            style={[styles.CodeText, codeTime > 0 && { backgroundColor: 'rgba(23, 171, 255, 0.3) ' }]}>
                            {codeTime > 0 ? codeTime : '获取验证码'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={submit}
                    style={[styles.btModify, disabledSumbit > 0 && { backgroundColor: 'rgba(23, 171, 255, 0.3)' }]}
                    // disabled={!disabledSumbit}
                >
                    <Text style={styles.btText}>修改手机号</Text>
                </TouchableOpacity>
            </View>
        </PageContainer>
    );
});
const styles = StyleSheet.create({
    btText: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: font(16),
    },
    title: {
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 1)',
        fontSize: font(18),
    },
    btModify: {
        borderRadius: pixel(20),
        height: pixel(40),
        width: pixel(230),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(23, 171, 255, 1)',
        marginTop: pixel(30),
    },
    textIn: {
        padding: pixel(0),
    },
    CodeText: {
        color: 'rgba(23, 171, 255, 1)',
        fontSize: font(15),
        textDecorationLine: 'underline',
    },
    CodeTouch: {
        borderRadius: pixel(12),
        width: pixel(90),
        height: pixel(26),
        alignItems: 'center',
        justifyContent: 'center',
        bottom: pixel(5),
    },
    container: {
        marginHorizontal: pixel(15),
    },
    comentStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: pixel(0.5),
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        marginTop: pixel(30),
    },
    textFont: {
        color: 'rgba(0, 0, 0, 1)',
        fontSize: font(16),
        marginRight: pixel(5),
    },
});
export default PhoneModify;
