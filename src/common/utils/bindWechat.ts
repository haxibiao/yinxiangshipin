import React, { useEffect, useState } from 'react';
import { appStore, userStore } from '@src/store';
import { GQL } from '@src/apollo';
import * as WeChat from 'react-native-wechat-lib';

interface Props {
    onSuccess?: Function;
    onFailed?: Function;
}

export function bindWechat(props: Props) {
    const scope = 'snsapi_userinfo';
    const state = 'skit_wx_login';
    const { onSuccess, onFailed } = props;

    WeChat.isWXAppInstalled()
        .then((isInstalled: any) => {
            if (isInstalled) {
                // 发送授权请求
                WeChat.sendAuthRequest(scope, state)
                    .then((responseCode: any) => {
                        // 返回code码，通过code获取access_token
                        bindWx(responseCode.code, props);
                        console.log('responseCode', responseCode);
                    })
                    .catch((err) => {
                        onFailed && onFailed();
                        Toast.show({ content: '登录授权发生错误' });
                    });
            } else {
                onFailed && onFailed();
                Toast.show({ content: '请先安装微信客户端在进行登录' });
            }
        })
        .catch((err) => {
            onFailed && onFailed();
            Toast.show({ content: '微信授权发生错误，请更新最新版本微信' });
        });
}

function bindWx(code: any, props: Props) {
    const { onSuccess, onFailed } = props;
    console.log(' appStore.client', appStore.client);
    appStore.client
        .mutate({
            mutation: GQL.BindOAuth,
            variables: {
                input: {
                    code,
                    oauth_type: 'WECHAT',
                },
            },
            errorPolicy: 'all',
            refetchQueries: () => [
                {
                    query: GQL.userProfileQuery,
                    variables: { id: userStore.me.id },
                    fetchPolicy: 'network-only',
                },
            ],
        })
        .then((result: any) => {
            console.log('result', result);
            if (result.errors) {
                onFailed && onFailed(result.errors[0].message);
                Toast.show({ content: result.errors[0].message });
            } else {
                onSuccess && onSuccess(result);
            }
        })
        .catch((error: any) => {
            console.log('error', error);
            onFailed && onFailed(error);
            Toast.show({ content: error.toString().replace(/Error: GraphQL error: /, '') });
        });
}
