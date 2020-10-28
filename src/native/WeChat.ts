/*
 * @Author: Gaoxuan
 * @Date:   2019-08-16 15:59:52
 * @Last Modified by:   Gaoxuan
 * @Last Modified time: 2019-08-16 15:59:52
 */
import { NativeModules, Alert, Platform } from 'react-native';
const ISIOS = Platform.OS === 'ios';
import * as WeChat from 'react-native-wechat-lib';
import { bindWeChat } from '@src/common';

const WXLogin = () => {
    const scope = 'snsapi_userinfo';
    const state = 'skit_wx_login';
    // const wechat = WeChat;
    // 判断微信是否安装
    WeChat.isWXAppInstalled().then((isInstalled) => {
        if (isInstalled) {
            // 发送授权请求
            WeChat.sendAuthRequest(scope, state)
                .then((responseCode) => {
                    // 返回code码，通过code获取access_token
                    // bindWeChat({ code: responseCode.code });
                    console.log('responseCode', responseCode);
                })
                .catch((err) => {
                    Alert.alert('登录授权发生错误：', err.message, [{ text: '确定' }]);
                });
        } else {
            ISIOS
                ? Alert.alert('没有安装微信', '是否安装微信？', [
                      { text: '取消' },
                      { text: '确定', onPress: () => this.installWechat() },
                  ])
                : Alert.alert('没有安装微信', '请先安装微信客户端在进行登录', [{ text: '确定' }]);
        }
    });
};

export default { WXLogin };
