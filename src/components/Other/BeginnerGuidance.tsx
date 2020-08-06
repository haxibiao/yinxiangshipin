import React, { Component, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { Overlay } from 'teaset';
import { Keys, Storage } from '@src/store/localStorage';

interface Props {
    guidanceKey: string; // 指导标识
    GuidanceView: JSX.Element; // 内部指导视图
    dismissEnabled?: boolean; // 外部能否关闭
    recordable?: boolean; // 是否记录到storage，再次进来将不会触发,默认为true
    skipEnabled?: boolean; // 能否跳过
    skipGuidanceKeys?: string[]; // 跳过的指导，方便跳过其它步骤
}

const BeginnerGuidance = (props: Props) => {
    const {
        guidanceKey,
        GuidanceView,
        recordable = true,
        dismissEnabled,
        skipEnabled,
        skipGuidanceKeys = [guidanceKey],
    } = props;
    const guidanceType = `BeginnerGuidance_${guidanceKey}`;
    const backListener = useRef();
    const OverlayKey = useRef();

    const overlayView = useMemo(() => {
        return (
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
    }, [dismissEnabled, handleDismiss, skipEnabled, skipGuidance]);

    const removeBackListener = useCallback(() => {
        if (Device.Android) {
            backListener.current.remove();
        }
    }, [backListener]);

    const handleDismiss = useCallback(() => {
        if (recordable) {
            storage.setItem(guidanceType, JSON.stringify({}));
        }
        removeBackListener();
        Overlay.hide(OverlayKey.current);
    }, [guidanceType, recordable, removeBackListener]);

    const skipGuidance = useCallback(() => {
        if (recordable) {
            skipGuidanceKeys.forEach(skipGuidanceKey => {
                storage.setItem(`BeginnerGuidance_${skipGuidanceKey}`, JSON.stringify({}));
            });
        }
        removeBackListener();
        Overlay.hide(OverlayKey.current);
    }, [recordable, removeBackListener, skipGuidanceKeys]);

    React.useEffect(async () => {
        const result = await Storage.getItem(key);
        if (!result) {
            OverlayKey.current = Overlay.show(overlayView);
            if (Device.Android) {
                backListener.current = BackHandler.addEventListener('hardwareBackPress', () => {
                    return true;
                });
            }
        }
    }, []);
};

const styles = StyleSheet.create({
    closeBtn: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: pixel(14),
        height: pixel(28),
        justifyContent: 'center',
        paddingHorizontal: pixel(10),
    },
    closeBtnText: {
        color: '#fff',
        fontSize: font(15),
    },
    container: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        height: Device.HEIGHT,
        justifyContent: 'center',
        width: Device.WIDTH,
    },
    header: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: pixel(Theme.itemSpace),
        position: 'absolute',
        top: pixel(Theme.statusBarHeight + 10),
        width: '100%',
    },
});

export default BeginnerGuidance;
