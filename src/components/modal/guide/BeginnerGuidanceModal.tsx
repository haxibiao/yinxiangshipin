import React, { useRef, useState, useMemo, useEffect, useCallback, ReactChildren } from 'react';
import { StyleSheet, View, Text, Image, Modal, ScrollView, BackHandler, TouchableWithoutFeedback } from 'react-native';
import { observer, Storage, GuideKeys, appStore, userStore, notificationStore } from '@src/store';
import { useNavigation } from '@react-navigation/native';
import { GQL, useApolloClient } from '@src/apollo';
import { DebouncedPressable } from '../../Basic/DebouncedPressable';
import Iconfont from '../../Iconfont';

const MODAL_WIDTH = Device.WIDTH * 0.82 > pixel(300) ? pixel(300) : Device.WIDTH * 0.82;

interface Props {
    guidanceKey: keyof typeof GuideKeys; //指导标识
    dismissEnabled?: boolean; //外部能否关闭
    recordable?: boolean; //是否记录到Storage，再次进来将不会触发，默认为true
    skipEnabled?: boolean; //能否跳过
    skipGuidanceKeys?: Array; //跳过的指导，方便跳过其它步骤
    children: ReactChildren; //内部指导视图
}

// 用户引导
export const BeginnerGuidanceModal = observer((props: Props) => {
    const navigation = useNavigation();
    const {
        guidanceKey,
        recordable = true,
        dismissEnabled,
        skipEnabled,
        skipGuidanceKeys = [guidanceKey],
        children,
    } = props;

    const shown = useRef(false);
    const [visible, setVisible] = useState(false);

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            setVisible(false);
            shown.current = false;
        }
    }, []);

    const handleDismiss = useCallback(() => {
        hideModal();
        notificationStore.inGuidance = false;
        if (recordable) {
            notificationStore.guides[guidanceKey] = true;
            Storage.setItem(guidanceKey, JSON.stringify({}));
        }
    }, []);

    const skipGuidance = useCallback(() => {
        notificationStore.inGuidance = false;
        if (recordable) {
            skipGuidanceKeys.forEach((skipGuidanceKey) => {
                Storage.setItem(skipGuidanceKey, JSON.stringify({}));
            });
        }
        hideModal();
    }, []);

    useEffect(() => {
        (async function () {
            const result = await Storage.getItem(guidanceKey);
            notificationStore.guides[guidanceKey] = !!result;
            if (!result) {
                notificationStore.inGuidance = true;
                showModal();
            }
        })();
    }, []);

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <TouchableWithoutFeedback disabled={!dismissEnabled} onPress={handleDismiss}>
                <View style={styles.modalView}>
                    {React.cloneElement(children, { navigation, onDismiss: handleDismiss })}
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
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    header: {
        position: 'absolute',
        top: pixel(Device.statusBarHeight + 10),
        paddingHorizontal: pixel(15),
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
