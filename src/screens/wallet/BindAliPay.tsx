import React, { useMemo, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { PageContainer, HxfButton, SafeText } from '@src/components';
import { GQL, useMutation } from '@src/apollo';
import { observer, userStore } from '@src/store';
import { useRoute } from '@react-navigation/native';

const Input = (props) => {
    const { placeholder, get, defaultValue, ...other } = props;
    const [, setValue] = useState();
    return (
        <TextInput
            style={{ height: 45 }}
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...other}
            onChangeText={(v) => {
                setValue(v);
                get(v);
            }}
        />
    );
};

export default observer((props) => {
    const { me } = userStore;
    const route = useRoute();
    const code = useRef(route.params?.code || '');
    const hasWallet = useMemo(() => me?.wallet?.platforms?.alipay, [me]);

    /*
     *  pay_account 为空  -> ''
     *  real_name
     *  code
     */
    const [formData, setFormData] = useState({
        real_name: me?.wallet?.real_name,
        pay_account: me?.wallet?.pay_account,
        code: null,
    });
    const [submitting, toggleSubmitting] = useState(false);

    const [setWalletPaymentInfo] = useMutation(GQL.setWalletPaymentInfoMutation, {
        variables: {
            input: {
                real_name: formData.real_name,
                pay_account: formData.pay_account,
            },
        },
        refetchQueries: (result) => [
            {
                query: GQL.meMetaQuery,
                fetchPolicy: 'network-only',
            },
        ],
    });

    const onSubmit = useCallback(async () => {
        if (code.current === formData.code) {
            toggleSubmitting(true);
            const [error, result] = await Helper.exceptionCapture(setWalletPaymentInfo);
            toggleSubmitting(false);
            if (error) {
                Toast.show({ content: error?.message || hasWallet ? '修改失败' : '绑定失败', layout: 'top' });
            } else {
                userStore.changeProfile({
                    wallet: {
                        ...me?.wallet,
                        real_name: formData.real_name,
                        pay_account: formData.pay_account,
                        platforms: { alipay: formData.pay_account },
                    },
                });
                Toast.show({ content: hasWallet ? '修改成功' : '绑定成功', layout: 'top' });
                props.navigation.pop(2);
            }
        } else {
            Toast.show({ content: '验证码错误', layout: 'top' });
        }
    }, [formData]);

    const disabledButton = useMemo(() => !(formData.real_name && formData.pay_account), [formData]);

    return (
        <PageContainer title={hasWallet ? '修改支付宝' : '绑定支付宝'} submitting={submitting}>
            <View style={styles.container}>
                <View style={{ paddingVertical: pixel(20) }}>
                    <SafeText
                        style={{
                            color: Theme.defaultTextColor,
                            fontSize: font(20),
                            fontWeight: '600',
                            paddingBottom: pixel(20),
                        }}>
                        支付宝信息
                    </SafeText>
                    <Text style={styles.tipsText}>
                        支付宝账号及真实姓名为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败
                    </Text>
                </View>
                <View style={styles.inputWrap}>
                    <Input
                        placeholder="请输入收到的验证码"
                        maxLength={6}
                        keyboardType="numeric"
                        defaultValue={formData.code}
                        get={(v) => {
                            setFormData({
                                ...formData,
                                code: v,
                            });
                        }}
                    />
                </View>
                <View style={styles.inputWrap}>
                    <Input
                        placeholder="请输入姓名"
                        maxLength={10}
                        defaultValue={formData.real_name}
                        get={(v) => {
                            setFormData({
                                ...formData,
                                real_name: v,
                            });
                        }}
                    />
                </View>
                <View style={styles.inputWrap}>
                    <Input
                        placeholder="请输入支付宝账号"
                        defaultValue={formData.pay_account}
                        get={(v) => {
                            setFormData({
                                ...formData,
                                pay_account: v,
                            });
                        }}
                    />
                </View>
                <HxfButton
                    title="保存"
                    gradient={true}
                    style={styles.button}
                    onPress={onSubmit}
                    disabled={disabledButton}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: pixel(20),
    },
    tipsText: {
        color: Theme.subTextColor,
        fontSize: font(13),
    },
    inputWrap: {
        borderBottomWidth: pixel(0.5),
        borderBottomColor: Theme.borderColor,
    },
    button: {
        height: pixel(40),
        borderRadius: pixel(5),
        marginTop: pixel(35),
    },
});
