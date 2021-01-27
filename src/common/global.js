import lodash from 'lodash';
import * as helper from './helper';
import * as scale from './scale';
import device from './device';
import config from './config';
import theme from './styles';

const Global = global || window || {};

// lodash
Global.__ = lodash;
// helper
Global.Helper = helper;
// 适配字体
Global.font = scale.font;
// 屏幕适配
Global.pixel = scale.pixel;
// 宽度适配
Global.percent = scale.percent;
// 设备信息
Global.Device = device;
// App配置
Global.Config = config;
// App主题
Global.Theme = theme;
// 用户token
Global.TOKEN = null;
// toast
Global.Toast = () => null;
// Log
Global.Log = (...args) => {
    if (__DEV__) {
        console.log('『Log』:', ...args);
    }
};
