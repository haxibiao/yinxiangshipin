import React, { useRef, useEffect } from 'react';
import { Storage, GuideKeys, userStore, notificationStore } from '@src/store';
import { authNavigate } from '@src/router';

interface UserProfile {
    gold: number;
    articles: number;
}

export function useAccountRemind({ gold, articles }: UserProfile) {
    const updateCount = useRef(0);
    useEffect(() => {
        // 满足这些条件并且更新了2次以上
        if (userStore?.login && !userStore?.me?.phone && userStore.startParseSharedLink) {
            updateCount.current++;
        }
        // 用户账户信息满足条件
        const condition =
            (gold >= userStore?.me?.exchangeRate * 0.3 || userStore?.me?.balance >= 0.3 || articles >= 3) &&
            updateCount.current >= 2 &&
            !notificationStore.bindAccountRemind &&
            !notificationStore.hasModalShown;
        if (condition) {
            Storage.setItem(GuideKeys.bindAccountRemind, true);
            notificationStore.bindAccountRemind = true;
            notificationStore.sendRemindNotice({
                title: '账号绑定提醒',
                content: '退出登录可能会丢失数据！可前往【我的 -> 设置】绑定手机号',
                buttonName: '前去绑定',
                buttonHandler: () => authNavigate('BindingAccount'),
            });
        }
    }, [gold, articles]);
}
