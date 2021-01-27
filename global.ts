import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { colors, scale } from 'src/styles';
import config from './config';

const Global: any = global;
const { height, width } = Dimensions.get('window');
const deviceID = DeviceInfo.getDeviceId();
let HAS_NOTCH = DeviceInfo.hasNotch();
let homeIndicatorHeight = 0;

if (['iPhone12,1', 'iPhone12,3', 'iPhone12,5'].includes(deviceID)) {
    HAS_NOTCH = true;
    homeIndicatorHeight = scale.size(34);
}

if (Platform.OS === 'ios' && HAS_NOTCH) {
    homeIndicatorHeight = scale.size(34);
}

// 设备信息
const device: DeviceInfo = {
    width,
    height,
    homeIndicatorHeight,
    OS: Platform.OS,
    isIos: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    systemVersion: DeviceInfo.getSystemVersion(),
    pixelRatio: PixelRatio.get(),
    minimumPixel: 1 / PixelRatio.get(),
    phoneNumber: DeviceInfo.getPhoneNumber(),
    navBarHeight: scale.size(44),
    tabBarHeight: scale.size(49) + homeIndicatorHeight,
    UUID: DeviceInfo.getUniqueID(),
    get isLandscape(): boolean {
        return Dimensions.get('window').width > Dimensions.get('window').height;
    },

    get statusBarHeight(): number {
        if (Platform.OS === 'ios') {
            return this.isLandscape ? 0 : HAS_NOTCH ? scale.size(34) : scale.size(20);
        } else if (Platform.OS === 'android') {
            return StatusBar.currentHeight as number;
        }
        return this.isLandscape ? 0 : scale.size(20);
    },
};

// 主题色彩
Global.Colors = colors;
// App的配置、设备信息、布局适配
Object.defineProperties(Global, {
    Config: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: config,
    },
    Device: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: device,
    },
    Scale: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: scale,
    },
});
