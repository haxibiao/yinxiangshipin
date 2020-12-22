import React, { useState, useEffect } from 'react';
import { StatusBar, Platform, NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

export default function useSafeArea({ fullscreen }) {
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    useEffect(() => {
        if (!Device.Android || !Device.isFullScreenDevice || !fullscreen) {
            setStatusBarHeight(0);
        } else if (Platform.OS == 'android') {
            setStatusBarHeight(StatusBar.currentHeight || 0);
        } else {
            StatusBarManager.getHeight(({ height }) => {
                setStatusBarHeight(height);
            });
        }
    }, [fullscreen]);
    return statusBarHeight;
}
