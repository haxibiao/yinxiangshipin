import * as WeChat from 'react-native-wechat-lib';

interface Props {
    onSuccess?: (c: number) => void;
    onFailed?: () => void;
}

export const WeChatAuth = (props: Props) => {
    const { onSuccess, onFailed } = props;
    const scope = 'snsapi_userinfo';
    const state = 'skit_wx_login';
    WeChat.isWXAppInstalled()
        .then((isSupported: any) => {
            if (isSupported) {
                WeChat.sendAuthRequest(scope, state)
                    .then((responseCode: any) => {
                        onSuccess && onSuccess(responseCode.code);
                    })
                    .catch(() => {
                        Toast.show({ content: '微信身份信息获取失败，请检查微信是否登录' });
                    });
            } else {
                onFailed && onFailed(responseCode.code);
            }
        })
        .catch(() => {
            onFailed && onFailed(responseCode.code);
        });
};
