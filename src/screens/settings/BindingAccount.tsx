import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PageContainer, HxfButton, HxfTextInput } from '@src/components';
import { observer, userStore } from '@src/store';
import { GQL, useMutation, errorMessage } from '@src/apollo';
import { useNavigation } from '@react-navigation/native';

export default observer(() => {
    const { me } = userStore;
    const navigation = useNavigation();
    const [phone, onChangeNumber] = useState(me?.phone);
    const [password, onPasswordChange] = useState('');

    const [updateUserInfoSecurity, { loading }] = useMutation(GQL.updateUserInfoSecurity, {
        variables: { id: me.id, phone, password },
        refetchQueries: () => [
            {
                query: GQL.MeMetaQuery,
                fetchPolicy: 'network-only',
            },
        ],
        onError: error => {
            Toast.show({ content: errorMessage(error, '手机号绑定失败') });
        },
        onCompleted: () => {
            Toast.show({
                content: '手机号绑定成功',
            });
            userStore.changeProfile({ phone });
            navigation.navigate('VerifyAliPay');
        },
    });

    return (
        <PageContainer title="手机号绑定" submitting={loading} white>
            <View style={styles.container}>
                <View style={styles.itemWrapper}>
                    <Text style={styles.title}>设置账号与密码</Text>
                </View>
                <View style={styles.inputWrapper}>
                    <HxfTextInput
                        style={styles.inputStyle}
                        placeholderTextColor={Theme.slateGray1}
                        value={phone}
                        onChangeText={onChangeNumber}
                        maxLength={11}
                        placeholder="请输入手机号"
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <HxfTextInput
                        style={styles.inputStyle}
                        placeholderTextColor={Theme.slateGray1}
                        onChangeText={onPasswordChange}
                        maxLength={16}
                        placeholder="请设置密码"
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.btnWrap}>
                    <HxfButton
                        title="提交"
                        gradient={true}
                        style={{ height: pixel(40) }}
                        disabled={!(password && phone)}
                        onPress={updateUserInfoSecurity}
                    />
                </View>
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    itemWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-start',
        height: 43,
        marginTop: 50,
        marginStart: 26,
        marginBottom: 28,
    },
    inputStyle: {
        fontSize: font(16),
        height: pixel(40),
        borderBottomWidth: Theme.minimumPixel,
        borderBottomColor: Theme.borderColor,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        color: Theme.defaultTextColor,
        fontSize: font(26),
        fontWeight: '400',
    },
    inputWrapper: {
        marginHorizontal: pixel(Theme.itemSpace * 2),
        marginBottom: pixel(Theme.itemSpace),
    },
    btnWrap: {
        marginTop: pixel(Theme.itemSpace),
        marginHorizontal: pixel(Theme.itemSpace * 2),
    },
});
