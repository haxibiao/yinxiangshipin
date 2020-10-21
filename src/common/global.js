import { Dimensions, PixelRatio, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import config from './config';
import theme from './theme';
import * as Helper from './helper';
import * as scale from './scale';

const { height, width } = Dimensions.get('window');

const Global = global || window || {};

const device = {
    WIDTH: width,
    HEIGHT: height,
    isFullScreenDevice: height / width >= 18 / 9,
    INNER_HEIGHT: height - theme.HOME_INDICATOR_HEIGHT - theme.NAVBAR_HEIGHT - theme.statusBarHeight,
    OS: Platform.OS,
    IOS: Platform.OS === 'ios',
    Android: Platform.OS === 'android',
    SystemVersion: DeviceInfo.getSystemVersion(),
    PixelRatio: PixelRatio.get(), // 获取屏幕分辨率
    PhoneNumber: DeviceInfo.getPhoneNumber(),
    UUID: DeviceInfo.getUniqueId(),
    Brand: DeviceInfo.getBrand(),
};
// 设备信息
Global.Device = device;
// App主题
Global.Theme = theme;
// 适配字体
Global.font = scale.font;
// 屏幕适配
Global.pixel = scale.pixel;
// 宽度适配
Global.percent = scale.percent;
// helper
Global.Helper = Helper;
// App配置
Global.Config = config;
// 用户token
Global.TOKEN = null;
// lodash
Global.__ = _;
// toast
Global.Toast = () => null;

Object.defineProperties(Global, {
    Scale: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: scale,
    },
});
