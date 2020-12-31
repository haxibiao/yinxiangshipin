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
            notificationStore.reduceToastNotice();
            setVisible(false);
            setNoticeData({});
            shown.current = false;
        }
    }, []);

    useEffect(
        () =>
            autorun(() => {
                if (notificationStore.toastNotice.length > 0) {
                    showModal(notificationStore.toastNotice[0]);
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
                <View style={styles.modalBody}>
                    <Text style={styles.modalContent}>{noticeData.content}</Text>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
    },
    modalBody: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        maxWidth: '50%',
        paddingHorizontal: pixel(15),
        paddingVertical: pixel(5),
        borderRadius: pixel(5),
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContent: {
        color: '#ffffffee',
        fontSize: font(15),
        lineHeight: font(22),
    },
});
