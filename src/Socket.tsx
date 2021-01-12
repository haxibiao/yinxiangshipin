import React, { useEffect, useCallback } from 'react';
import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';
import { observer, appStore, adStore, userStore } from '@src/store';
import Notice from '@src/components/notice';
import { navigate } from '@src/common';

// 通知信息有哪些字段
// ⁣type：通知类型
// ⁣content：通知内容

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
            echo.channel('notice').listen('.system.notice', sendLocalNotification);
            // 监听用户私人频道
            echo.private('App.User.' + me.id);
        }
    }, [userStore.me]);

    const sendLocalNotification = useCallback((data: { id: any; content: any; title: any }) => {
        const handler = () => navigate('systemRemindNotification', { user: userStore.me });
        if (data && typeof data === 'object') {
            Notice.add({ ...data, handler });
        }
    }, []);

    return null;
});

export default Socket;
