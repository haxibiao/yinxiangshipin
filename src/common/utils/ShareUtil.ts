import { Platform } from 'react-native';
import NativeShare from 'react-native-share';
import * as WeChat from 'react-native-wechat-lib';
import { Share } from 'react-native-app-utils';
import { userStore, appStore } from '@src/store';

interface Target {
    id: number;
    description?: string;
    [key: string]: any;
}

function ShareRollback(target: Target) {
    NativeShare.open({
        title: '分享给朋友',
        url: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
    });
}

function shareToWeChat(target: Target) {
    if (Platform.OS === 'ios') {
        ShareRollback(target);
        return;
    }
    try {
        WeChat.shareVideo({
            title: `我在${Config.AppName}发现一个很好看的小视频，分享给你`,
            description: target.description,
            thumbImageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
            videoUrl: Config.ServerRoot + '/share/post/' + target.id + '?user_id=' + userStore.me.id,
            scene: 0,
        });
    } catch (e) {
        Toast.show({ content: '未安装微信或当前微信版本较低' });
    }
}

function shareToTimeline(target: Target) {
    if (Platform.OS === 'ios') {
        ShareRollback(target);
        return;
    }
    try {
        WeChat.shareVideo({
            title: `我在${Config.AppName}发现一个很好看的小视频，分享给你`,
            description: target.description,
            thumbImageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
            videoUrl: Config.ServerRoot + '/share/post/' + target.id + '?user_id=' + userStore.me.id,
            scene: 1,
        });
    } catch (e) {
        Toast.show({
            content: '未安装微信或当前微信版本较低',
        });
    }
}

async function shareToQQ(target: Target) {
    if (Platform.OS === 'ios') {
        ShareRollback(target);
        return;
    }
    const result = await Share.shareTextToQQ(
        Config.ServerRoot + '/share/post/' + target.id + '?user_id=' + userStore.me.id,
    );
    if (!result) {
        ShareRollback(target);
    }
}

async function shareToSina(target: Target) {
    if (Platform.OS === 'ios') {
        ShareRollback(target);
        return;
    }
    const result = await Share.shareTextToSina(
        Config.ServerRoot + '/share/post/' + target.id + '?user_id=' + userStore.me.id,
    );
    if (!result) {
        ShareRollback(target);
    }
}

function shareToQQZone(target: Target) {
    ShareRollback(target);
}

export const ShareUtil = { shareToWeChat, shareToTimeline, shareToQQ, shareToSina, shareToQQZone };
