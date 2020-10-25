import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { ad } from 'react-native-ad';
import { authNavigate } from '@src/router';
import { observer, autorun, adStore, notificationStore } from '@src/store';
import Iconfont from '../../../components/Iconfont';
import { DebouncedPressable } from '../../../components/Basic/DebouncedPreesable';

const MODAL_WIDTH = Device.WIDTH * 0.84 > pixel(320) ? pixel(320) : Device.WIDTH * 0.84;
const BUTTON_WIDTH = MODAL_WIDTH * 0.66;
const BUTTON_HEIGHT = BUTTON_WIDTH * 0.2;

export const TaskNotificationModal = observer(() => {
    const [visible, setVisible] = useState(false);
    const [noticeData, setNoticeData] = useState({});
    const shown = useRef(false);

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
            setNoticeData(data);
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            notificationStore.reduceTaskNotice();
            setVisible(false);
            setNoticeData({});
            shown.current = false;
        }
    }, []);

    useEffect(
        () =>
            autorun(() => {
                if (notificationStore.taskNotice.length > 0) {
                    showModal(notificationStore.taskNotice[0]);
                }
            }),
        [],
    );

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <DebouncedPressable style={styles.closeBtn} onPress={hideModal} activeOpacity={1}>
                    <Iconfont name="guanbi1" size={font(15)} color={'#b2b2b2'} />
                </DebouncedPressable>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{noticeData.title}</Text>
                    </View>
                    <View style={styles.modalBody}>
                        <Text style={styles.modalContent}>{noticeData.content}</Text>
                        {noticeData?.guideHandler && (
                            <TouchableOpacity
                                style={styles.guidanceBtn}
                                onPress={() => {
                                    hideModal();
                                    noticeData.guideHandler();
                                }}
                                activeOpacity={1}>
                                <Text style={styles.guidanceText}>立即去完成每日任务</Text>
                                <Iconfont name="right" size={font(20)} color={Theme.primaryColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <DebouncedPressable style={styles.modalBtn} onPress={hideModal} activeOpacity={1}>
                        <Text style={styles.modalBtnText}>我知道了</Text>
                    </DebouncedPressable>
                </View>
            </View>
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
    modalContainer: {
        width: MODAL_WIDTH,
        minHeight: MODAL_WIDTH,
        maxHeight: Device.HEIGHT * 0.8,
        paddingVertical: pixel(20),
        paddingHorizontal: pixel(16),
        borderRadius: pixel(10),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    closeBtn: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: pixel(10),
        right: pixel(10),
        width: pixel(26),
        height: pixel(26),
        borderRadius: pixel(13),
        borderWidth: pixel(1),
        borderColor: '#f0f0f0',
    },
    modalHeader: {
        paddingBottom: pixel(12),
    },
    modalTitle: {
        color: '#121212',
        fontSize: font(17),
        lineHeight: font(22),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: pixel(10),
    },
    modalContent: {
        color: '#7B7B7B',
        fontSize: font(15),
        lineHeight: font(22),
    },
    guidanceContainer: {
        alignItems: 'center',
    },
    guidanceBtn: {
        padding: pixel(10),
    },
    guidanceText: {
        color: Theme.primaryColor,
        fontSize: font(14),
        lineHeight: font(18),
        marginRight: pixel(4),
    },
    modalBtn: {
        marginTop: pixel(10),
        alignSelf: 'center',
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
        backgroundColor: Theme.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBtnText: {
        color: '#fff',
        fontSize: font(16),
        lineHeight: font(22),
    },
});
