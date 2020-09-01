import { Platform } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
import {
    name as Name,
    AppID,
    DisplayName as AppName,
    AppSlogan,
    Build,
    ServerRoot,
    UploadServer,
    Version,
    AppVersionNumber,
    AndroidOnline,
    iOSOnline,
    goldAlias,
    energyAlias,
    qqGroup,
    appStoreUrl,
    WechatAppId,
} from '@app/app.json';

const AppStore = Config && Config.APP_STORE ? Config.APP_STORE : 'haxibiao'; // 应用商店名称

// let AppVersionNumber = DeviceInfo.getVersion().split('');
// AppVersionNumber.splice(3, 1);
// AppVersionNumber = parseFloat(AppVersionNumber.join('')); //app vesrsion 数值

export default {
    ServerRoot,
    UploadServer,
    Name,
    AppName,
    AppVersion: Version,
    AppID,
    AppSlogan,
    Version,
    Build,
    AppStore,
    AppVersionNumber,
    AndroidOnline,
    iOSOnline,
    goldAlias: goldAlias || '金币',
    energyAlias: energyAlias || '精力',
    qqGroup: qqGroup || '1036821462',
    iosAppStoreUrl: appStoreUrl || 'https://apps.apple.com/cn/app/id1526799985',
    WechatAppId,
};
