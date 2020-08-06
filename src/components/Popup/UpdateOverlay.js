import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, NativeModules } from 'react-native';

import { appStore } from '@src/store';

import { Overlay } from 'teaset';

class UpdateOverlay {
    static show(versionData, serverVersion) {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.modalRemindContent}>检测到新版本</Text>
                        </View>
                        <View style={styles.center}>
                            <Text style={styles.centerTitle}>建议在WLAN环境下进行升级</Text>
                            <Text style={styles.centerTitle}>版本：{serverVersion}</Text>
                            <Text style={styles.centerTitle}>大小：{versionData.size}</Text>
                            <Text style={styles.centerTitle}>更新说明：</Text>
                            <Text style={styles.centerInfo}>{versionData.description}</Text>
                        </View>

                        <View style={styles.modalFooter}>
                            {!versionData.is_force && (
                                <TouchableOpacity
                                    style={styles.operation}
                                    onPress={() => {
                                        UpdateOverlay.hide();
                                        appStore.updateViewedVesion(serverVersion);
                                    }}>
                                    <Text style={styles.operationText}>以后再说</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.operation,
                                    versionData.is_force
                                        ? null
                                        : { borderLeftColor: Theme.lightBorder, borderLeftWidth: 0.5 },
                                ]}
                                onPress={() => {
                                    if (versionData.apk) {
                                        NativeModules.DownloadApk.downloading(
                                            versionData.apk || '',
                                            'dianmoge.apk',
                                            Config.DisplayName,
                                        );
                                        // UpdateOverlay.hide();
                                    } else {
                                        UpdateOverlay.hide();
                                        Toast.show({
                                            content: '更新失败，请稍后重试！',
                                            layout: 'bottom',
                                        });
                                    }
                                }}>
                                <Text style={[styles.operationText, { color: Theme.primaryColor }]}>立即更新</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: Device.WIDTH - pixel(60),
        borderRadius: pixel(15),
        backgroundColor: '#FFF',
        padding: 0,
    },
    header: {
        justifyContent: 'center',
        paddingTop: pixel(25),
    },
    headerText: {
        color: Theme.tintTextColor,
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
        color: Theme.navBarMenuColor,
        paddingTop: pixel(10),
        lineHeight: font(22),
    },
    centerInfo: {
        fontSize: font(14),
        color: Theme.navBarMenuColor,
        lineHeight: font(22),
    },
    modalRemindContent: {
        fontSize: font(18),
        color: '#000',
        paddingHorizontal: pixel(15),
        textAlign: 'center',
        lineHeight: font(20),
        fontWeight: '500',
    },
    modalFooter: {
        borderTopWidth: pixel(0.5),
        borderTopColor: Theme.borderColor,
        flexDirection: 'row',
    },
    operation: {
        paddingVertical: pixel(15),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    operationText: {
        fontSize: font(15),
        fontWeight: '400',
        color: Theme.navBarMenuColor,
    },
});

export default UpdateOverlay;
