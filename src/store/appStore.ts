import { Platform } from 'react-native';
import { observable, action, computed } from 'mobx';
import NetInfo from '@react-native-community/netinfo';
import { Keys, Storage, ItemKeys } from './localStorage';

class App {
    @observable viewportHeight: number = Device.HEIGHT;
    @observable unreadMessages: number = 0;
    @observable deviceOffline: boolean = false;
    @observable connectionInfoType: Record<string, any> = {};
    @observable isFullScreen: boolean = false;
    @observable client: Record<string, any> = {};
    @observable modalIsShow: boolean = false;
    @observable currentRouteName: string = '';
    // storage record
    @observable createPostGuidance: boolean = true; // 用户引导,现在默认关闭
    @observable agreeCreatePostAgreement: boolean = false; // 用户协议观看记录
    @observable spiderVideoTaskGuided: boolean = false; // 是否指导过采集任务
    @observable isLocalSpiderVideo: boolean = false; // 是否启用本地采集
    detectedFileInfo: string[] = []; // 是否启用本地采集
    // user guides
    @observable guides: Record<string, any> = {};

    constructor() {
        this.recall();
        NetInfo.addEventListener(this.handleConnectivityChange);
    }

    @action.bound
    async recall() {
        const agreeCreatePostAgreement = await Storage.getItem(Keys.agreeCreatePostAgreement);
        const spiderVideoTaskGuided = await Storage.getItem(Keys.spiderVideoTaskGuided);
        const isLocalSpiderVideo = await Storage.getItem(Keys.isLocalSpiderVideo);
        const detectedFileInfo = await Storage.getItem(Keys.detectedFileInfo);
        if (agreeCreatePostAgreement) {
            this.agreeCreatePostAgreement = true;
        }
        if (spiderVideoTaskGuided) {
            this.spiderVideoTaskGuided = true;
        }
        if (isLocalSpiderVideo !== null) {
            this.isLocalSpiderVideo = isLocalSpiderVideo;
        }
        if (Array.isArray(detectedFileInfo)) {
            this.detectedFileInfo = detectedFileInfo;
        }
    }

    @action.bound
    setAppStorage(key: keyof ItemKeys, value: any) {
        Storage.setItem(key, value);
    }

    @action.bound
    handleConnectivityChange(connectionInfo: any) {
        this.connectionInfoType = connectionInfo.type;
        this.deviceOffline = connectionInfo.type === 'none';
    }

    // 记录已查看的版本更新提示
    @action.bound
    async updateViewedVersion(viewedVersion: string) {
        await Storage.setItem(Keys.viewedVersion, viewedVersion);
    }

    changeAppVersion(version: string) {
        Storage.setItem(Keys.appVersion, version);
    }

    @action.bound
    appGuides(guideName: string) {
        this.guides[guideName] = true;
    }
}

export default new App();
