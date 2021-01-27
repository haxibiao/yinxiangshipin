import { Platform, Dimensions, StatusBar, PixelRatio } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import color from './colors';

const hasNotch: boolean = DeviceInfo.hasNotch();
const bottomInset = initialWindowMetrics?.insets.bottom;

const Theme = {
    ...color,
    bottomInset,
    navBarHeight: 44,
    tabBarHeight: 50 + bottomInset,
    edgeDistance: 14,
    minimumPixel: 1 / PixelRatio.get(), // 最小线宽

    get isLandscape(): boolean {
        return Dimensions.get('window').width > Dimensions.get('window').height;
    },

    get statusBarHeight(): number {
        if (Platform.OS === 'ios') {
            return this.isLandscape ? 0 : hasNotch ? 34 : 20;
        } else if (Platform.OS === 'android') {
            return StatusBar.currentHeight as number;
        }
        return this.isLandscape ? 0 : 20;
    },
};

export default Theme;
