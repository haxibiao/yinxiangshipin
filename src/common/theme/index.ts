import { Platform, Dimensions, StatusBar, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import color from './colors';

let HAS_NOTCH: boolean = DeviceInfo.hasNotch();
let HOME_INDICATOR_HEIGHT = 0;

const deviceID = DeviceInfo.getDeviceId();
if (['iPhone12,1', 'iPhone12,3', 'iPhone12,5'].includes(deviceID)) {
    HAS_NOTCH = true;
    HOME_INDICATOR_HEIGHT = 26;
}

if (Platform.OS === 'ios' && HAS_NOTCH) {
    HOME_INDICATOR_HEIGHT = 26;
}
const Theme = {
    ...color,
    HAS_NOTCH,
    HOME_INDICATOR_HEIGHT,
    NAVBAR_HEIGHT: 44,
    BOTTOM_HEIGHT: 50 + HOME_INDICATOR_HEIGHT,
    itemSpace: 14,
    minimumPixel: 1 / PixelRatio.get(), // 最小线宽

    get isLandscape(): boolean {
        return Dimensions.get('window').width > Dimensions.get('window').height;
    },

    get statusBarHeight(): number {
        if (Platform.OS === 'ios') {
            return this.isLandscape ? 0 : HAS_NOTCH ? 34 : 20;
        } else if (Platform.OS === 'android') {
            return StatusBar.currentHeight as number;
        }
        return this.isLandscape ? 0 : 20;
    },
};

export default Theme;
