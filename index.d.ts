interface DeviceInfo {
    width: number;
    height: number;
    homeIndicatorHeight: number; // 刘海屏iPhone底部的Indicator高度
    OS: string;
    isIos: boolean;
    isAndroid: boolean;
    systemVersion: string;
    pixelRatio: number; // 屏幕分辨率
    minimumPixel: number; // 最小线宽
    navBarHeight: number; // 顶部导航高度
    tabBarHeight: number; // 底部导航高度
    phoneNumber: string;
    UUID: string;
    isLandscape: boolean;
    statusBarHeight: number;
    Brand: string;
}

interface AppConfig {
    AppID: string;
    AppName: string;
    PackageName: string;
    Version: string;
    Build: string;
    AppSlogan: string;
    ServerRoot: string;
    UploadServer: string;
    WechatAppId: string;
    AppStore: string;
    goldAlias: string;
    ticketAlias: string;
    qqGroup: string;
    iosAppStoreUrl: string;
}

interface Colour {
    primaryColor: any;
    primary: string;
    secondary: string;
    primaryRgb: string;
    secondaryRgb: string;
    fontDark: string;
    fontMedium: string;
    fontLight: string;
    link: string;

    // ACTIONS
    success: string;
    warning: string;
    alert: string;

    // GRAY_SCALE
    grayLight: string;
    grayMedium: string;
    grayDark: string;

    // SEX
    girl: string;
    boy: string;
}

interface ToastShowParams {
    content: string;
    layout?: 'top' | 'center' | 'bottom';
    duration?: number;
    callback?: () => void;
}

declare let TOKEN: any;

declare const Device: DeviceInfo;

declare const Config: AppConfig;

declare const Theme: Colour & { edgeDistance: number };

declare const Toast: {
    show: (p: ToastShowParams) => void;
};

declare const pixel: (n: number) => number;

declare const font: (n: number) => number;

declare const percent: (n: any, type: 'width' | 'height') => number;
