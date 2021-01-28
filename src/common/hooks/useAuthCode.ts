import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { GQL, exceptionCapture } from '@src/apollo';
import { appStore } from '@src/store';
import { useCountDown } from './useCountDown';

export function useAuthCode() {
    const [loading, setLoading] = useState(false);
    const [authCode, setAuthCode] = useState('');
    const [count, setCountDown] = useState(58000);
    const { seconds, isEnd } = useCountDown({ count });
    const fetchAuthCode = useCallback(async (phone, action = 'USER_LOGIN') => {
        function sendCode() {
            return appStore.client.mutate({
                mutation: GQL.sendVerifyCodeMutation,
                variables: {
                    phone,
                    action,
                },
            });
        }
        if (appStore.client) {
            setLoading(true);
            const [err, res] = await exceptionCapture(sendCode);
            setLoading(false);
            setCountDown(59000);
            const verifyCode = res?.data?.sendVerifyCode?.code;
            if (verifyCode) {
                setAuthCode(verifyCode);
            } else {
                Toast.show({ content: '获取验证码失败', layout: 'top' });
            }
        } else {
            Toast.show({ content: '获取验证码失败', layout: 'top' });
        }
    }, []);

    return { fetchAuthCode, authCode, loading, countDown: isEnd ? '' : seconds };
}
