/*
 * created by wyk made in 2018-12-05 20:53:57
 */
import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, BackHandler } from 'react-native';
import { Overlay } from 'teaset';
import { Storage, notificationStore } from '@src/store';

interface Props {
    guidanceKey: string; //指导标识
    GuidanceView: JSX.Element; //内部指导视图
    dismissEnabled?: boolean; //外部能否关闭
    recordable?: boolean; //是否记录到Storage，再次进来将不会触发,默认为true
    skipEnabled?: boolean; //能否跳过
    skipGuidanceKeys?: Array; //跳过的指导，方便跳过其它步骤
}

export default (props: Props) => {
    const {
        guidanceKey,
        GuidanceView,
        recordable = true,
        dismissEnabled,
        skipEnabled,
        skipGuidanceKeys = [guidanceKey],
    } = props;
    let backListener;
    let OverlayKey;

    const overlayView = (
        <Overlay.View animated={false}>
            <TouchableWithoutFeedback disabled={!dismissEnabled} onPress={handleDismiss}>
                <View style={styles.container}>
                    <GuidanceView onDismiss={handleDismiss} />
                    {skipEnabled && (
                        <View style={styles.header}>
                            <TouchableWithoutFeedback onPress={skipGuidance}>
                                <View style={styles.closeBtn}>
                                    <Text style={styles.closeBtnText}>跳过引导</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </Overlay.View>
    );

    (async function () {
        // OverlayKey = Overlay.show(overlayView);
        const result = await Storage.getItem(guidanceKey);
        notificationStore.guides[guidanceKey] = !!result;
        if (!result) {
            notificationStore.inGuidance = true;
            OverlayKey = Overlay.show(overlayView);
            if (Device.Android) {
                backListener = BackHandler.addEventListener('hardwareBackPress', () => {
                    return true;
                });
            }
        }
    })();

    function handleDismiss() {
        removeBackListener();
        Overlay.hide(OverlayKey);
        notificationStore.inGuidance = false;
        if (recordable) {
            Storage.setItem(guidanceKey, JSON.stringify({}));
            notificationStore.guides[guidanceKey] = true;
        }
    }

    function skipGuidance() {
        if (recordable) {
            skipGuidanceKeys.forEach((skipGuidanceKey) => {
                Storage.setItem(skipGuidanceKey, JSON.stringify({}));
            });
        }
        removeBackListener();
        Overlay.hide(OverlayKey);
    }

    function removeBackListener() {
        if (Device.Android) {
            backListener.remove();
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    header: {
        position: 'absolute',
        top: pixel(Device.statusBarHeight + 10),
        paddingHorizontal: pixel(Theme.itemSpace),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    closeBtn: {
        height: pixel(28),
        paddingHorizontal: pixel(10),
        borderRadius: pixel(14),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
    },
    closeBtnText: {
        fontSize: pixel(15),
        color: '#fff',
    },
});
