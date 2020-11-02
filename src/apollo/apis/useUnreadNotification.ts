import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useQuery } from '@apollo/react-hooks';
import { appStore, notificationStore } from '@src/store';
import { GQL } from '../gqls';

const unreadNotifyTypes = {
    unread_comments: 0,
    unread_likes: 0,
    unread_follows: 0,
    unread_others: 0,
    unread_chat: 0,
};

type NotifyTypes = keyof typeof unreadNotifyTypes;

export const useUnreadNotification = (isLogin: boolean) => {
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const isFocused = useIsFocused();
    const { data, refetch } = useQuery(GQL.unreadsQuery, {
        fetchPolicy: 'network-only',
        skip: !isLogin,
    });
    useEffect(() => {
        let count = 0;
        const unreadNotify = data?.me;
        if (unreadNotify !== null && typeof unreadNotify === 'object' && isLogin) {
            for (const key in unreadNotifyTypes) {
                if (Object.prototype.hasOwnProperty.call(unreadNotify, key)) {
                    count += Number(unreadNotify[key]);
                    notificationStore.unreadNotify[key] = unreadNotify[key];
                }
            }
        } else {
            notificationStore.unreadNotify = {} as NotifyTypes;
        }
        notificationStore.unreadMessages = count;
    }, [data, isLogin]);

    useEffect(() => {
        if (isFocused && isLogin && refetch instanceof Function) {
            timer.current = setInterval(() => {
                refetch();
            }, 10000);
        }
        return () => {
            if (timer.current) {
                clearInterval(timer.current);
            }
        };
    }, [isFocused, isLogin, refetch]);

    useFocusEffect(
        useCallback(() => {
            if (isLogin) {
                if (refetch instanceof Function) {
                    refetch();
                }
            }
        }, [isLogin, refetch]),
    );

    // const navigation = useNavigation();
    // useEffect(() => {
    //     if (isLogin) {
    //         const navBlurListener = navigation.addListener('focus', (payload) => {
    //             if (refetch instanceof Function) {
    //                 refetch();
    //             }
    //         });
    //         return () => {
    //             navBlurListener();
    //         };
    //     }
    // }, [isLogin, refetch]);
};
