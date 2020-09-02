import { Platform } from 'react-native';
import Config from 'react-native-config';
// import DeviceInfo from 'react-native-device-info';
import {
    AppID,
    DisplayName as AppName,
    name as PackageName,
    Version,
    Build,
    AppSlogan,
    ServerRoot,
    UploadServer,
    WechatAppId,
} from '@app/app.json';

const AppStore = Config && Config.APP_STORE ? Config.APP_STORE : 'haxibiao'; // 应用商店名称

// let AppVersionNumber = DeviceInfo.getVersion().split('');
// AppVersionNumber.splice(3, 1);
// AppVersionNumber = parseFloat(AppVersionNumber.join('')); //app vesrsion 数值

export default {
    AppID,
    AppName,
    PackageName,
    Version,
    Build,
    AppSlogan,
    ServerRoot,
    UploadServer,
    WechatAppId,
    AppStore,
    goldAlias: '金币',
    ticketAlias: '精力',
    qqGroup: '1036821462',
    iosAppStoreUrl: 'https://apps.apple.com/cn/app/id1526799985',
};
