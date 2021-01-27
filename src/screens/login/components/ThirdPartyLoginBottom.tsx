import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SvgIcon, SvgPath } from '@src/components/SvgIcon';
import * as WeChat from 'react-native-wechat-lib';
import { Overlay } from 'teaset';
import { Row } from '@src/components';
import { GQL, useMutation, useApolloClient, errorMessage } from '@src/apollo';
import { observer, userStore } from '@src/store';
import { useNavigation } from '@react-navigation/native';

interface Props {
    rowStyle: any;
    SMSDisable: Boolean;
}

const ThirdPartyLoginBottom = (props: Props) => {
    const { rowStyle, SMSDisable } = props;
    console.log('SMSDisable', SMSDisable);
    const scope = 'snsapi_userinfo';
    const state = 'is_wx_login';
    const client = useApolloClient();
    const navigation = useNavigation();
    // 第三方登陆请求
    const otherSignIn = useCallback(async (code: string, type: 'WECHAT' | 'PHONE') => {
        client
            .mutate({
                mutation: GQL.otherSignInMutation,
                variables: {
                    code,
                    type,
                },
                errorPolicy: 'all',
            })
            .then((result: any) => {
                // console.log('微信登陆请求回调：', result);
                closeLoading(); // 关闭登陆加载中动画
                const meInfo = result?.data?.authSignIn;

                if (!result || !meInfo || !meInfo.token) {
                    Toast.show({ content: '登陆失败，请稍后重试！', layout: 'top' });
                    return;
                }

                userStore.signIn(meInfo);
                navigation.goBack(navigation.goBack());
            })
            .catch((err: any) => {
                closeLoading(); // 关闭登陆加载中动画
                Toast.show({ content: errorMessage(err), layout: 'top' });
            });
    }, []);

    const WX_Login = useCallback(() => {
        WeChat.isWXAppInstalled().then((login: boolean) => {
            if (login) {
                showLoading();
                console.log('login', login);
                WeChat.sendAuthRequest(scope, state).then((description: any) => {
                    console.log('description', description);
                    otherSignIn(description.code, 'WECHAT');
                });
            } else {
                closeLoading();
                console.log('123', 123);
                Alert.alert('没有安装微信', '是否安装微信？', [
                    { text: '取消' },
                    { text: '确定', onPress: () => this.installWechat() },
                ]);
            }
        });
    }, []);
    // 显示登陆中弹窗
    let popLoadingViewRef: any;
    const showLoading = () => {
        const overlayView = (
            <Overlay.PopView
                style={{ justifyContent: 'center' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={(ref: any) => (popLoadingViewRef = ref)}>
                <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <View
                        style={{
                            width: pixel(100),
                            height: pixel(100),
                            backgroundColor: '#FFF',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            style={{ width: pixel(92), height: pixel(92) }}
                            source={require('@app/assets/images/ic_loginpage_loading.gif')}
                        />
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    };

    // 关闭登陆中弹窗
    const closeLoading = () => {
        if (popLoadingViewRef) {
            popLoadingViewRef.close();
        }
    };
    // 短信验证登录环境事件处理
    const SMSHandle = useCallback(() => {
        switch (SMSDisable) {
            case true:
                Toast.show({ content: '已在此页面~' });
                break;

            default:
                navigation.navigate('LoginSwitch', { switchStatus: false });
                break;
        }
    }, [SMSDisable]);
    return (
        <View>
            <Row style={[styles.rowContainer, { ...rowStyle }]}>
                <TouchableOpacity
                    onPress={() => WX_Login()}
                    style={[styles.SvgBoxStyle, rowStyle?.width && { marginHorizontal: rowStyle?.width / 6 }]}>
                    <SvgIcon name={SvgPath.weChatLogin} color={'#19CAAD'} size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => SMSHandle()}
                    style={[styles.SvgBoxStyle, rowStyle?.width && { marginHorizontal: rowStyle?.width / 6 }]}>
                    <SvgIcon name={SvgPath.SMS} color={SMSDisable ? '#dddddd' : 'rgba(18,175,244,1)'} size={17} />
                </TouchableOpacity>
            </Row>
        </View>
    );
};

const itemHorizontal = (Device.width - 25 * 2) / 6;

const styles = StyleSheet.create({
    rowContainer: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: pixel(35),
        paddingHorizontal: 15,
    },
    SvgBoxStyle: {
        marginHorizontal: itemHorizontal,
        width: pixel(35),
        minHeight: pixel(25),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ThirdPartyLoginBottom;
