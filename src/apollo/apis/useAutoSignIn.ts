import React, { useCallback, useEffect, useRef } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { authNavigate } from '@src/router';
import { userStore } from '@src/store';
import { GQL } from '../gqls';

interface Props {
    isLogin: boolean;
    firstInstall: boolean;
}

export function useAutoSignIn({ isLogin, firstInstall }: Props) {
    const client = useApolloClient();
    const autoSignIn = useCallback(async () => {
        const uuid = Device.UUID;
        if (uuid && client?.mutate) {
            client
                .mutate({
                    mutation: GQL.autoSignInMutation,
                    variables: { UUID: uuid },
                })
                .then((res: any) => {
                    const userData = res?.data?.autoSignIn;
                    userStore.signIn(userData);
                })
                .catch(() => {
                    // 静默登录失败，引导用户到手动登录页
                    authNavigate('Login');
                });
        } else {
            // 没有拿到uuid,引导用户到手动登录页
            authNavigate('Login');
        }
    }, [client]);

    useEffect(() => {
        if (!isLogin && firstInstall) {
            autoSignIn();
        }
    }, [isLogin, firstInstall]);
}
