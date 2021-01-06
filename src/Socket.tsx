import React, { useEffect } from 'react';
import Echo from 'laravel-echo';
import Socketio from 'socket.io-client';
import { observer, appStore, adStore, userStore } from '@src/store';
// import GetMedalOverlay from '@src/screens/user/components/GetMedalOverlay';
// import { UnlockCategroyOverlay } from '@src/components';

//使用laravel-echo挂载socket监听
export const Socket = observer((user: { token: string | undefined; id: string }) => {
    // const { appStore, userStore } = useStores();
    console.log('Socket', userStore.me);
    useEffect(() => {
        if (userStore?.me?.token != undefined) {
            const { me } = userStore;
            // 构造laravel echo及Socket Client
            const echo = new Echo({
                broadcaster: 'socket.io',
                host: 'ws://socket.datizhuanqian.com:6001',
                client: Socketio,
                auth: {
                    headers: {
                        Authorization: 'Bearer ' + me.token,
                    },
                },
            });

            appStore.setEcho(echo);

            // 监听公共频道
            echo.channel('notice').listen('NewNotice', sendLocalNotification);

            // 监听用户私人频道
            echo.private('App.User.' + me.id);
            // .listen('WithdrawalDone', sendLocalNotification)
            // .listen('NewMedal', sendLocalNotification)
            // .listen('NewLike', sendLocalNotification)
            // .listen('NewFollow', sendLocalNotification)
            // .listen('NewComment', sendLocalNotification)
            // .listen('NewAudit', sendLocalNotification)
            // .listen('NewMedal', (data: any) => GetMedalOverlay.show({ medal: data })) //解锁勋章
            // .listen('CanSubmitCategory', (data: any) => UnlockCategroyOverlay.show()); //解锁出题

            // 系统通知栏
        }
    }, [userStore.me]);

    // 本地推送通知
    const sendLocalNotification = (data: { id: any; content: any; title: any }) => {
        const currentDate = new Date();
        // JPushModule.sendLocalNotification({
        //     buildId: 1,
        //     id: data.id,
        //     content: data.content,
        //     extra: {},
        //     fireTime: currentDate.getTime() + 3000,
        //     title: data.title,
        // });
    };
    return null;
});

export default Socket;
