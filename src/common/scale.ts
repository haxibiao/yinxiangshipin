import { Dimensions, PixelRatio } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const guidelineBaseWidth = 375;
// 宽高百分比
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

// 字体大小适配
export const font = (s: number) => pixel(s) / PixelRatio.getFontScale();

// FONT SIZE
export const FONT_20 = font(20);
export const FONT_18 = font(18);
export const FONT_16 = font(16);
export const FONT_14 = font(14);
export const FONT_12 = font(12);

// LINE HEIGHT
export const LINE_32 = font(32);
export const LINE_28 = font(28);
export const LINE_24 = font(24);
export const LINE_20 = font(20);
export const LINE_16 = font(16);

// INTERVAL
export const SPACE_18 = pixel(18);
export const SPACE_16 = pixel(16);
export const SPACE_14 = pixel(14);
export const SPACE_12 = pixel(12);
export const SPACE_10 = pixel(10);
