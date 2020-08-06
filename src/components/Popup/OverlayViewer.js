/*
 * @flow
 * created by wyk made in 2019-01-16 16:06:13
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar } from 'react-native';
import { Overlay } from 'teaset';
import Iconfont from '../Iconfont';
import TouchFeedback from '../Basic/TouchFeedback';
import NavigatorBar from '../Header/NavigatorBar';

class OverlayViewer {
    static show(children) {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0)'} barStyle={'dark-content'} />
                    <TouchableOpacity style={styles.closeBtn} onPress={() => OverlayViewer.hide()} activeOpacity={1}>
                        <Iconfont name="guanbi1" color={'#fff'} size={pixel(24)} />
                    </TouchableOpacity>
                    {children}
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000000',
        flex: 1,
        height: Device.HEIGHT,
        width: Device.WIDTH,
    },
    closeBtn: {
        position: 'absolute',
        zIndex: 2,
        top: pixel(Theme.statusBarHeight),
        right: 0,
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingVertical: pixel(8),
        paddingRight: pixel(Theme.itemSpace),
        alignItems: 'flex-end',
    },
});

export default OverlayViewer;
