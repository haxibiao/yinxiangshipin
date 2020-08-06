import { Platform } from 'react-native';
import { observable, action, computed } from 'mobx';
import NetInfo from '@react-native-community/netinfo';
import { Keys, Storage } from './localStorage';

const isIos = Platform.OS === 'ios';

// ios test codeid_full_video:  945294087
// 945294634
// ios test codeid_reward_video:  945294086
// 945294572

// 开屏Splash
// 视频刷 DrawVideo
// 激励视频DrawFeed
// 全屏视频 fullvideo
// 信息流 Feed（就是插在动态里的那种）

const defaultAdConfig = {
    // 广告 各种广告当前联盟配置
    splash_provider: '头条',
    feed_provider: '头条',
    reward_video_provider: '头条',
    draw_video_provider: '头条',
    // 头条/腾讯/百度 APP ID
    tt_appid: isIos ? '5084764' : '5031409',
    tx_appid: '1110143190',
    bd_appid: 'f8109ee3',
    // 广告 代码位配置
    codeid_banner: isIos ? '945294657' : '945294875',
    codeid_draw_video: isIos ? '945294630' : '931409417',
    codeid_feed: isIos ? '945294650' : '931409671',
    codeid_full_video: isIos ? '945294634' : '943671839',
    codeid_reward_video: isIos ? '945294572' : '931409105',
    codeid_splash: isIos ? '887343553' : '831409137',
    codeid_splash_tencent: '5060798543385857',
    codeid_splash_baidu: '6817073',
    codeid_feed_tencent: '6030697513584858',
    codeid_feed_baidu: '6817075',
    codeid_reward_video_tencent: '2000095513389819',
};

class App {
    // 直播相关: 是否有足够的权限开启直播( 麦克风，摄像头 )
    @observable public sufficient_permissions: boolean = false;

    @observable viewportHeight: number = Device.HEIGHT;
    @observable unreadMessages: number = 0;
    @observable deviceOffline: boolean = false;
    @observable connectionInfoType: Record<string, any> = {};
    @observable isFullScreen: boolean = false;
    @observable client: Record<string, any> = {};
    @observable echo: Record<string, any> = {};
    @observable modalIsShow: boolean = false;

    @observable adConfig = defaultAdConfig;
    @observable enableAd: boolean = false; // 广告开关
    @observable enableWallet: boolean = false; // 钱包相关业务开关
    @observable timeForLastAdvert: number = 0; // 最后一次广告播放事件

    @observable createPostGuidance: boolean = true; // 用户引导,现在默认关闭

    constructor() {
        NetInfo.addEventListener(this.handleConnectivityChange);
        this.recall();
    }

    @action.bound
    async recall() {
        // 现在默认关闭
        // this.createPostGuidance = await Storage.getItem(Keys.createPostGuidance);
    }

    @action.bound
    handleConnectivityChange(connectionInfo: any) {
        this.connectionInfoType = connectionInfo.type;
        this.deviceOffline = connectionInfo.type === 'none';
    }

    @action.bound
    setEcho(echo: any) {
        this.echo = echo;
    }

    @action.bound
    setAdConfig(config: any) {
        this.enableAd = config.ad !== 'off';
        this.enableWallet = config.wallet !== 'off';
    }

    // 记录已查看的版本更新提示
    @action.bound
    async updateViewedVesion(viewedVersion: string) {
        await Storage.setItem(Keys.viewedVersion, viewedVersion);
    }

    changeAppVersion(version: string) {
        Storage.setItem(Keys.appVersion, version);
    }

    @action.bound
    recordTimeForLastAdvert() {
        this.timeForLastAdvert = new Date().getTime();
    }

    // 关于直播更新 sufficent_permissions
    @action.bound
    public AppSetSufficientPermissions(sufficient: boolean) {
        this.sufficient_permissions = sufficient;
    }
}

export default new App();
