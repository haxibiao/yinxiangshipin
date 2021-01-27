import { Platform } from 'react-native';
import { observable, action, computed } from 'mobx';
import NetInfo from '@react-native-community/netinfo';
import { Storage, RecordKeys, ItemKeys } from './storage';
import Echo from 'laravel-echo';

class App {
    @observable viewportHeight: number = Device.height;
    @observable deviceOffline: boolean = false;
    @observable connectionInfoType: Record<string, any> = {};
    @observable isFullScreen: boolean = false;
    @observable client: Record<string, any> = {};
    @observable modalIsShow: boolean = false;
    @observable currentRouteName: string = '';
    @observable echo: object = {}; //socoket
    // storage
    @observable agreeCreatePostAgreement: boolean = false; // 用户协议（发布内容）
    @observable spiderVideoTaskGuided: boolean = false; // 采集功能使用指导
    @observable isLocalSpiderVideo: boolean = false; // 启用本地采集
    detectedFileInfo: string[] = []; // 相册解析记录

    constructor() {
        this.restore();
        NetInfo.addEventListener(this.handleConnectivityChange);
    }

    @action.bound
    async restore() {
        this.agreeCreatePostAgreement = !!(await Storage.getItem(RecordKeys.agreeCreatePostAgreement));
        this.spiderVideoTaskGuided = !!(await Storage.getItem(RecordKeys.spiderVideoTaskGuided));
        this.isLocalSpiderVideo = !!(await Storage.getItem(RecordKeys.isLocalSpiderVideo));
        this.detectedFileInfo = (await Storage.getItem(RecordKeys.detectedFileInfo)) || [];
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
        await Storage.setItem(RecordKeys.viewedVersion, viewedVersion);
    }

    changeAppVersion(version: string) {
        Storage.setItem(RecordKeys.appVersion, version);
    }
    //监听对象（即时能力）
    @action.bound
    setEcho(echo: Echo) {
        this.echo = echo;
    }
}

export default new App();
