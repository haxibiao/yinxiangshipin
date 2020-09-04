import { Platform } from 'react-native';
import { observable, action, computed } from 'mobx';
import AppJson from '@app/app.json';

class AdStore {
    /**
     **********************
     *  广告相关的 store
     **********************
     */

    @observable tt_appid: string = Platform.OS === 'ios' ? AppJson.tt_appid_ios : AppJson.tt_appid; // 头条APPID
    // @observable tx_appid: string = Platform.OS === 'ios' ? AppJson.tx_appid_ios : AppJson.tx_appid; // 腾讯APPID
    // @observable bd_appid: string = Platform.OS === 'ios' ? AppJson.bd_appid_ios : AppJson.bd_appid; // 百度APPID

    // ad provider
    @observable splash_provider: string = AppJson.splash_provider;
    @observable feed_provider: string = AppJson.feed_provider;
    @observable reward_video_provider: string = AppJson.reward_video_provider;
    // splash
    @observable codeid_splash: string = Platform.OS === 'ios' ? AppJson.codeid_splash_ios : AppJson.codeid_splash;
    // feed
    @observable codeid_feed: string = Platform.OS === 'ios' ? AppJson.codeid_feed_ios : AppJson.codeid_feed;
    // draw video
    @observable codeid_draw_video: string =
        Platform.OS === 'ios' ? AppJson.codeid_draw_video_ios : AppJson.codeid_draw_video;
    // reward video
    @observable codeid_reward_video: string =
        Platform.OS === 'ios' ? AppJson.codeid_reward_video_ios : AppJson.codeid_reward_video;
    // full video
    @observable codeid_full_video: string =
        Platform.OS === 'ios' ? AppJson.codeid_full_video_ios : AppJson.codeid_full_video;

    @observable rewardCount: number = 0; // 激励视频的次数

    @observable enableAd: boolean = false; // 广告开关
    @observable enableWallet: boolean = false; // 钱包相关业务开关

    @observable timeForLastAdShow: number = 0; // 最后一次广告播放事件
    @observable interval: number = 90000; // 广告间隔时间(毫秒)

    @action.bound
    setAdConfig(config: any) {
        // this.enableAd = true;
        // this.enableWallet = true;
        this.enableAd = config?.ad === 'on';
        this.enableWallet = config?.wallet === 'on';
        // for (var p in config) {
        //     if (config.hasOwnProperty(p)) {
        //         this[p] = config[p];
        //     }
        // }
    }

    @action.bound
    setRewardCount(count: number) {
        this.rewardCount = count;
    }

    @action.bound
    recordTimeForLastAdShow() {
        this.timeForLastAdShow = new Date().getTime();
    }

    @action.bound
    setAdInterval(interval: number) {
        this.interval = interval;
    }

    @computed get adWaitingTime() {
        return this.interval - (new Date().getTime() - this.timeForLastAdShow);
    }
}

export default new AdStore();
