import { Dimensions, PixelRatio } from 'react-native';

const guidelineBaseWidth = 375;

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

// response image
export const response = (
    { width, height }: { width: number; height: number } = { width: WINDOW_WIDTH, height: WINDOW_WIDTH },
    limit: number = WINDOW_WIDTH,
) => {
    const proportion = width / height;
    if (proportion > 1) {
        return {
            width: limit,
            height: limit / proportion,
        };
    } else {
        return {
            width: limit * proportion,
            height: limit,
        };
    }
};

// 宽高百分比
export const percent = (n: any, type: 'width' | 'height' = 'width'): number => {
    const base = type === 'width' ? WINDOW_WIDTH : WINDOW_HEIGHT;
    const multiple = parseFloat(n) / 100;
    return PixelRatio.roundToNearestPixel(base * multiple);
};

// 像素适配
export const pixel = (s: number) => (WINDOW_WIDTH / guidelineBaseWidth) * s;

// 字号适配
export const font = (s: number) => pixel(s) / PixelRatio.getFontScale();
