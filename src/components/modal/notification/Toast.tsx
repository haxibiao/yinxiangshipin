import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { observer, autorun, adStore, notificationStore } from '@src/store';
import Iconfont from '../../../components/Iconfont';

const MODAL_WIDTH = Device.WIDTH * 0.8 > pixel(300) ? pixel(300) : Device.WIDTH * 0.8;
const BUTTON_WIDTH = MODAL_WIDTH * 0.66;
const BUTTON_HEIGHT = BUTTON_WIDTH * 0.2;

export const Toast = observer(() => {
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
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{noticeData.title}</Text>
                    </View>
                    <View style={styles.modalBody}>
                        <Text style={styles.modalContent}>{noticeData.content}</Text>
                    </View>
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
});
