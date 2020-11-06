import { Platform } from 'react-native';
import NativeShare from 'react-native-share';
import * as WeChat from 'react-native-wechat-lib';
import { Share } from 'react-native-app-utils';
import { userStore, appStore } from '@src/store';

type ShareType = 'post' | 'collection';

interface Target {
    id: number;
    title?: string;
    description?: string;
    type?: ShareType;
}

function ShareRollback(target: Target, type: ShareType = 'post') {
    NativeShare.open({
        title: '分享给朋友',
        url: `${Config.ServerRoot}/share/${type}/${target.id}?user_id=${userStore.me.id}`,
    });
}

function shareToWeChat(target: Target, type: ShareType) {
    if (Platform.OS === 'ios') {
        ShareRollback(target);
        return;
    }
    try {
        WeChat.shareVideo({
            title: `我在${Config.AppName}发现${type === 'collection' ? '一些' : '一个'}很好看的小视频，分享给你`,
            description: target.description,
            thumbImageUrl: `${Config.ServerRoot}/logo/${Config.PackageName}.com.png`,
            videoUrl: `${Config.ServerRoot}/share/${type}/${target.id}?user_id=${userStore.me.id}`,
            scene: 0,
        });
    } catch (e) {
        Toast.show({ content: '未安装微信或当前微信版本较低' });
    }
}

function shareToTimeline(target: Target, type: ShareType) {
    if (Platform.OS === 'ios') {
        ShareRollback(target);
        return;
    }
    try {
        WeChat.shareVideo({
            title: `我在${Config.AppName}发现${type === 'collection' ? '一些' : '一个'}一个很好看的小视频，分享给你`,
            description: target.description,
            thumbImageUrl: `${Config.ServerRoot}/logo/${Config.PackageName}.com.png`,
            videoUrl: `${Config.ServerRoot}/share/${type}/${target.id}?user_id=${userStore.me.id}`,
            scene: 1,
        });
    } catch (e) {
        Toast.show({
            content: '未安装微信或当前微信版本较低',
        });
    }
}

async function shareToQQ(target: Target, type: ShareType) {
    if (Platform.OS === 'ios') {
        ShareRollback(target);
        return;
    }
    const result = await Share.shareTextToQQ(
        `${Config.ServerRoot}/share/${type}/${target.id}?user_id=${userStore.me.id}`,
    );
    if (!result) {
        ShareRollback(target);
    }
}

async function shareToSina(target: Target, type: ShareType) {
    if (Platform.OS === 'ios') {
        ShareRollback(target);
        return;
    }
    const result = await Share.shareTextToSina(
        `${Config.ServerRoot}/share/${type}/${target.id}?user_id=${userStore.me.id}`,
    );
    if (!result) {
        ShareRollback(target);
    }
}

function shareToQQZone(target: Target, type: ShareType) {
    ShareRollback(target);
}

async function shareImageToWeChat(image, description) {
    try {
        await WeChat.shareImage({
            type: 'imageFile',
            title: `我在${Config.AppName}发现一个很好看的小视频，分享给你`,
            description: description,
            imageUrl: image,
            scene: 0,
        });
    } catch (e) {
        Toast.show({
            content: '未安装微信或当前微信版本较低',
        });
    }
}

async function shareImageToTimeline(image, description) {
    try {
        await WeChat.shareImage({
            type: 'imageFile',
            title: `我在${Config.AppName}发现一个很好看的小视频，分享给你`,
            description: description,
            imageUrl: image,
            scene: 1,
        });
    } catch (e) {
        Toast.show({
            content: '未安装微信或当前微信版本较低',
        });
    }
}

async function shareImageToQQ(image) {
    try {
        const result = await Share.shareImageToQQ(image);
        if (callback == false) {
            Toast.show({
                content: '请先安装QQ客户端',
            });
        }
    } catch (error) {}
}

async function shareImageToSina(image) {
    try {
        const result = await Share.shareToSinaFriends(image);
        if (callback == false) {
            Toast.show({
                content: '请先安装新浪微博客户端',
            });
        }
    } catch (error) {}
}

async function shareImageToQQZone(image) {
    try {
        const result = await Share.shareImageToQQZone(image);
        if (callback == false) {
            Toast.show({
                content: '请先安装QQ空间客户端',
            });
        }
    } catch (error) {}
}

export const ShareUtil = {
    shareToWeChat,
    shareToTimeline,
    shareToQQ,
    shareToSina,
    shareToQQZone,
    shareImageToWeChat,
    shareImageToTimeline,
    shareImageToQQ,
    shareImageToSina,
    shareImageToQQZone,
};
