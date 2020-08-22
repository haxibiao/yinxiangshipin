import { observable, action, computed } from 'mobx';
import AppJson from '@app/app.json';

class AdStore {
    /**
     **********************
     *  广告相关的 store(viewmodel)
     **********************
     */

    @observable tt_appid: string = Device.IOS ? AppJson.tt_appid_ios : AppJson.tt_appid; // 头条APPID
    @observable tx_appid: string = Device.IOS ? AppJson.tx_appid_ios : AppJson.tx_appid; // 腾讯APPID
    @observable bd_appid: string = Device.IOS ? AppJson.bd_appid_ios : AppJson.bd_appid; // 百度APPID

    @observable splash_provider: string = AppJson.splash_provider;
    @observable feed_provider: string = AppJson.feed_provider;
    @observable reward_video_provider: string = AppJson.reward_video_provider;

    @observable codeid_splash: string = Device.IOS ? AppJson.codeid_splash_ios : AppJson.codeid_splash;
    @observable codeid_splash_tencent: string = AppJson.codeid_splash_tencent;
    @observable codeid_splash_baidu: string = AppJson.codeid_splash_baidu;

    @observable codeid_feed: string = Device.IOS ? AppJson.codeid_feed_ios : AppJson.codeid_feed;
    @observable codeid_feed_tencent: string = AppJson.codeid_feed_tencent;
    @observable codeid_feed_baidu: string = AppJson.codeid_feed_baidu;

    @observable codeid_reward_video: string = Device.IOS
        ? AppJson.codeid_reward_video_ios
        : AppJson.codeid_reward_video;

    @observable codeid_reward_video_tencent: string = AppJson.codeid_reward_video_tencent; // 激励视频

    @observable codeid_draw_video: string = Device.IOS ? AppJson.codeid_draw_video_ios : AppJson.codeid_draw_video;
    @observable codeid_full_video: string = AppJson.codeid_full_video;

    @observable rewardCount: number = 0; // 激励视频的次数

    @observable enableAd: boolean = true; // 广告开关
    @observable enableWallet: boolean = true; // 钱包相关业务开关

    @observable timeForLastAdShow: number = 0; // 最后一次广告播放事件
    @observable interval: number = 90000; // 广告间隔时间(毫秒)

    @action.bound
    setRewardCount(count: number) {
        this.rewardCount = count;
    }

    @action.bound
    recordTimeForLastAdShow() {
        this.timeForLastAdShow = new Date().getTime();
    }

    @computed get adWaitingTime() {
        return this.interval - (new Date().getTime() - this.timeForLastAdShow);
    }

    @action.bound
    setAdInterval(interval: number) {
        this.interval = interval;
    }
}

export default new AdStore();
