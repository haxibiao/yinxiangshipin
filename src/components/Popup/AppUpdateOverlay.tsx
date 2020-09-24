'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    NativeModules,
    Dimensions,
    PermissionsAndroid,
    Platform,
} from 'react-native';

import Iconfont from '../Iconfont';
import { SafeText } from '@src/components';
import { Overlay } from 'teaset';
import DownLoadApk from '@src/screens/wallet/components/DownLoadApk';
import { appStore } from '@src/store';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

let OverlayKey: any = null;

interface Props {
    versionData: object;
    onlineVersion: string;
}

export const show = (props: Props) => {
    const { versionData, onlineVersion } = props;
    const overlayView = (
        <Overlay.View animated>
            <View style={styles.container}>
                <View style={styles.content}>
                    {!versionData.is_force && (
                        <TouchableOpacity
                            style={styles.operation}
                            onPress={() => {
                                hide();
                                appStore.updateViewedVersion(onlineVersion);
                            }}>
                            <Iconfont name={'close'} color={Theme.grey} size={20} />
                        </TouchableOpacity>
                    )}
                    <View style={[styles.header, { paddingTop: versionData.is_force ? pixel(25) : pixel(15) }]}>
                        <SafeText style={styles.modalRemindContent}>检测到新版本</SafeText>
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.centerTitle}>建议在WLAN环境下进行升级</Text>
                        <Text style={styles.centerTitle}>版本：{versionData.version}</Text>
                        <Text style={styles.centerTitle}>大小：{versionData.size}</Text>
                        <Text style={styles.centerTitle}>更新说明：</Text>
                        <Text style={styles.centerInfo}>{versionData.description}</Text>
                    </View>
                    <View style={{ alignItems: 'center', paddingVertical: pixel(15) }}>
                        <DownLoadApk packageName={'appUpdate'} url={versionData.apk} />
                    </View>
                </View>
            </View>
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: SCREEN_WIDTH - pixel(60),
        borderRadius: pixel(15),
        backgroundColor: 'white',
        padding: 0,
    },
    header: {
        justifyContent: 'center',
    },
    headerText: {
        color: Theme.grey,
        fontSize: font(13),
        textAlign: 'center',
        paddingTop: pixel(3),
    },
    center: {
        paddingTop: pixel(15),
        paddingBottom: pixel(20),
        paddingHorizontal: pixel(20),
    },
    centerTitle: {
        fontSize: font(14),
        color: Theme.primaryFont,
        paddingTop: pixel(10),
        lineHeight: font(22),
    },
    centerInfo: {
        fontSize: font(14),
        color: Theme.primaryFont,
        lineHeight: font(22),
    },
    modalRemindContent: {
        fontSize: font(18),
        color: Theme.black,
        paddingHorizontal: pixel(15),
        textAlign: 'center',
        lineHeight: font(20),
        fontWeight: '500',
    },
    modalFooter: {
        borderTopColor: Theme.tintGray,
        flexDirection: 'row',
    },
    operation: {
        paddingTop: pixel(10),
        paddingHorizontal: pixel(15),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    operationText: {
        fontSize: font(15),
        fontWeight: '400',
        color: Theme.grey,
    },
});

export default { show, hide };
