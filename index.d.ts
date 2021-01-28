interface DeviceInfo {
    width: number;
    height: number;
    topInset: number;
    bottomInset: number;
    leftInset: number;
    rightInset: number;
    navBarHeight: number;
    tabBarHeight: number;
    UUID: string;
    OS: string;
    isIOS: boolean;
    isAndroid: boolean;
    isFullScreenDevice: boolean;
    minimumPixel: number;
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
