import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

const { width, height } = Dimensions.get('window');
const topInset = initialWindowMetrics?.insets.top;
const bottomInset = initialWindowMetrics?.insets.bottom;
const leftInset = initialWindowMetrics?.insets.left;
const rightInset = initialWindowMetrics?.insets.right;

export default {
    width,
    height,
    topInset,
    bottomInset,
    leftInset,
    rightInset,
    navBarHeight: 44,
    tabBarHeight: 50 + bottomInset,
    OS: Platform.OS,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isFullScreenDevice: height / width >= 18 / 9,
    minimumPixel: 1 / PixelRatio.get(),

    get isLandscape(): boolean {
        return Dimensions.get('window').width > Dimensions.get('window').height;
    },

    get statusBarHeight(): number {
        if (Platform.OS === 'ios') {
            return this.isLandscape ? 0 : DeviceInfo.hasNotch() ? 34 : 20;
        } else if (Platform.OS === 'android') {
            return StatusBar.currentHeight;
        }
        return this.isLandscape ? 0 : 20;
    },
};
