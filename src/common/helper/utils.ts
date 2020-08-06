import { PixelRatio, Dimensions } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const guidelineBaseWidth = 375;

export function NumberFormat(value: any) {
    const num: number = parseFloat(value);
    if (num >= 1000) {
        return Math.round(Number((num / 1000).toFixed(2)) * 10) / 10 + 'k';
    } else {
        return num || 0;
    }
}

// 网络状态
export const getNetInfoStatus = (netInfo: any): Record<string, any> => {
    const { type } = netInfo;
    return {
        isConnect: type.toUpperCase() === 'WIFI' || type.toUpperCase() === 'CELLULAR',
        isWifi: type.toUpperCase() === 'WIFI',
        isCellular: type.toUpperCase() === 'CELLULAR',
    };
};
