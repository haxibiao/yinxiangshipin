import React, { useEffect, useCallback } from 'react';
import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';
import { observer, appStore, adStore, userStore } from '@src/store';
import Notice from '@src/components/notice';
import { navigate } from '@src/common';

interface NoticeData {
    id: number;
    type: string;
    title: string;
    content: string;
    cover?: string; //图片封面
    url?: string; //跳转的h5链接
}

export const Socket = observer((user: { token: string | undefined; id: string }) => {
    useEffect(() => {
        if (userStore?.me?.token != undefined) {
            const { me } = userStore;
            const echo = new Echo({
                broadcaster: 'socket.io',
                // host: 'ws://socket.datizhuanqian.com:6001',
                host: 'ws://yxsp.haxifang.cn:6002',
                client: Socketio,
                auth: {
                    headers: {
                        Authorization: 'Bearer ' + me.token,
                    },
                },
            });
            //保存echo实例
            appStore.setEcho(echo);
            // 监听公共频道
            echo.channel('notice').listen('.system.notice', sendPublicNotification);
            // 监听用户私人频道
            echo.private('App.User.' + me.id).listen('.personal.notice', sendPersonalNotification);
        }
    }, [userStore.me]);

    const sendPublicNotification = useCallback((data: NoticeData) => {
        const handler = () => navigate('PublicNotification');
        if (data && typeof data === 'object') {
            Notice.add({ ...data, handler });
        }
    }, []);

    const sendPersonalNotification = useCallback((data: NoticeData) => {
        const handler = () => navigate('PersonalNotification');
        if (data && typeof data === 'object') {
            Notice.add({ ...data, handler });
        }
    }, []);

    return null;
});

export default Socket;
