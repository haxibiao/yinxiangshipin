import React, { useRef, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import Orientation from 'react-native-orientation';
import SplashScreen from 'react-native-splash-screen';
import { ad } from 'react-native-ad';
import { DisplayName } from '@app/app.json';
import { adStore } from '@src/store';

const fetchConfigTimeout = 4000;

export function useFetchAppConfig() {
    const appLunch = useRef(true);
    const responseTime = useRef(0);
    const timer = useRef<ReturnType<typeof setInterval>>();
    const fetchConfig = useCallback(() => {
        fetch(Config.ServerRoot + '/api/app-config?os=' + Platform.OS + '&store=' + Config.AppStore)
            .then((response) => response.json())
            .then((result) => {
                timer.current && clearInterval(timer.current);
                // 1.保存APP配置(含ad appId, codeId等)
                adStore.setAdConfig(result);
                // 华为手机，广告开启，并且接口响应超时
                if (
                    String(Device.Brand).toLocaleUpperCase() === 'HUAWEI' &&
                    result?.ad === 'on' &&
                    responseTime.current <= fetchConfigTimeout
                ) {
                    // 启动开屏广告
                    ad.startSplash({
                        appid: adStore.tt_appid,
                        codeid: adStore.codeid_splash,
                    });
                }
            })
            .catch((err) => {
                adStore.loadedConfig = true;
                timer.current && clearInterval(timer.current);
            });
    }, []);
    // 防止获取广告配置超时
    useEffect(() => {
        timer.current = setInterval(() => {
            responseTime.current += 100;
        }, 100);
        //清除定时器
        return () => {
            timer.current && clearInterval(timer.current);
        };
    }, []);

    if (appLunch.current) {
        appLunch.current = false;
        Orientation.lockToPortrait();
        SplashScreen.hide();
        // 获取广告、钱包配置
        fetchConfig();
        // 启动前，初始化Ad
        ad.init({
            appid: adStore.tt_appid,
            app: DisplayName,
        });
        // 除了华为外直接启动启动开屏广告
        if (String(Device.Brand).toLocaleUpperCase() !== 'HUAWEI') {
            ad.startSplash({
                appid: adStore.tt_appid,
                codeid: adStore.codeid_splash,
            });
        }
    }
}
