import React from 'react';
import { appStore, userStore } from '@src/store';
import { GQL, errorMessage } from '@src/apollo';
import * as WeChat from 'react-native-wechat-lib';

interface Props {
    onSuccess?: Function;
    onFailed?: Function;
}

export function bindWeChat(props: Props) {
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
                        bindingWeChatWallet(responseCode.code, props);
                    })
                    .catch((err) => {
                        onFailed && onFailed('登录授权发生错误');
                    });
            } else {
                onFailed && onFailed('请先安装微信客户端在进行登录');
            }
        })
        .catch((err) => {
            onFailed && onFailed('微信授权发生错误，请更新最新版本微信');
        });
}

function bindingWeChatWallet(code: any, props: Props) {
    const { onSuccess, onFailed } = props;
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
                    query: GQL.MeMetaQuery,
                    fetchPolicy: 'network-only',
                },
                {
                    query: GQL.userQuery,
                    variables: { id: userStore.me.id },
                    fetchPolicy: 'network-only',
                },
            ],
        })
        .then((result: any) => {
            if (result.errors) {
                onFailed && onFailed(result.errors?.[0]?.message);
            } else {
                onSuccess && onSuccess(result?.data?.bindOAuth?.oauth_id);
            }
        })
        .catch((error: any) => {
            onFailed && onFailed(errorMessage(error));
        });
}
