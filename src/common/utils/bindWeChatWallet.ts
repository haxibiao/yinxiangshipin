import React from 'react';
import { appStore, userStore, notificationStore } from '@src/store';
import { GQL, errorMessage } from '@src/apollo';
import * as WeChat from 'react-native-wechat-lib';

interface Props {
    onSuccess?: Function;
    onFailed?: Function;
}

export function bindWeChatWallet(props: Props) {
    const scope = 'snsapi_userinfo';
    const state = 'skit_wx_login';
    const { onSuccess, onFailed } = props;

    WeChat.isWXAppInstalled()
        .then((isInstalled: any) => {
            if (isInstalled) {
                WeChat.sendAuthRequest(scope, state)
                    .then((responseCode: any) => {
                        bindWallet(responseCode.code, props);
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

function bindWallet(code: any, props: Props) {
    const { onSuccess, onFailed } = props;
    notificationStore.toggleLoadingVisible();
    appStore.client
        .mutate({
            mutation: GQL.bindOAuth,
            variables: {
                input: {
                    code,
                    oauth_type: 'WECHAT',
                },
            },
            errorPolicy: 'all',
            refetchQueries: () => [
                {
                    query: GQL.meMetaQuery,
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
            notificationStore.toggleLoadingVisible();
            if (result.errors) {
                onFailed && onFailed(result.errors?.[0]?.message);
            } else {
                onSuccess && onSuccess(result?.data?.bindOAuth?.oauth_id);
            }
        })
        .catch((error: any) => {
            notificationStore.toggleLoadingVisible();
            onFailed && onFailed(errorMessage(error));
        });
}
