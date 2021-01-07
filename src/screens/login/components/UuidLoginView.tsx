import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Iconfont } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { GQL, errorMessage } from '@src/apollo';

import { exceptionCapture } from '@src/common';
import { userStore } from '@src/store';

export default function UuidLoginView(props: { navigation: any; client: any; onClose?: () => void }) {
    const { onClose, navigation, client } = props;
    // 使用本机UUID进行静默登录
    const onSilentLogin = useCallback(async () => {
        if (Device.UUID) {
            client
                .mutate({
                    mutation: GQL.autoSignInMutation,
                    variables: {
                        UUID: Device.UUID,
                    },
                })
                .then((result: any) => {
                    const meInfo = Helper.syncGetter('data.autoSignIn', result);
                    userStore.signIn(meInfo);
                    onClose && onClose();
                    navigation.navigate('Main', null, navigation.navigate('Personage'));
                })
                .catch((err: any) => {
                    Toast.show({ content: errorMessage(err), layout: 'top' });
                });
        } else {
            Toast.show({ content: '一键登录失败，请手动登录', layout: 'top' });
        }
    }, []);

    return (
        <View style={{ backgroundColor: '#FFF', borderRadius: pixel(5) }}>
            <View style={{ flexDirection: 'row', paddingTop: pixel(15), paddingRight: pixel(15) }}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={{ padding: pixel(5) }} onPress={onClose}>
                    <Iconfont name="guanbi1" size={pixel(17)} color={'#0005'} />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: pixel(40),
                    paddingBottom: pixel(20),
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        marginBottom: pixel(30),
                    }}>
                    <Image
                        style={{ width: pixel(25), height: pixel(25) }}
                        source={require('@app/assets/images/dmg_logo_white.png')}
                    />
                    <Text style={{ color: '#000', fontSize: pixel(20), marginLeft: pixel(10) }}>{Config.AppName}</Text>
                </View>
                <Text style={{ color: '#000', fontSize: pixel(16) }}>
                    {Device.UUID?.replace(/(^.{4}).*(.{4}$)/, '$1****$2')}
                </Text>
                <Text style={{ color: '#0005', fontSize: pixel(12), marginVertical: pixel(10) }}>
                    哈希坊提供识别码认证服务
                </Text>
                <TouchableOpacity
                    style={{
                        width: '100%',
                        backgroundColor: Theme.primaryColor,
                        borderRadius: 100,
                        paddingVertical: pixel(13),
                        marginTop: pixel(15),
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={onSilentLogin}>
                    <Text style={{ color: '#FFF', fontSize: pixel(16) }}>一键登陆</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ padding: pixel(15) }}
                    onPress={() => {
                        onClose && onClose();
                        navigation.navigate('MobileLogin');
                    }}>
                    <Text>其他手机号码登陆</Text>
                </TouchableOpacity>
                <Text
                    style={{
                        color: '#0005',
                        fontSize: pixel(12),
                        marginTop: pixel(35),
                        marginHorizontal: pixel(15),
                        textAlign: 'center',
                    }}>
                    登陆即同意
                    <Text style={{ color: Theme.primaryColor }} onPress={() => {}}>
                        《哈希坊科技认证服务条款》
                    </Text>
                    并授权
                    {Config.AppName}获取手机信息
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({});
