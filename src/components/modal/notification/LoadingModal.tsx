import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { observer, autorun, notificationStore } from '@src/store';
import LottieView from 'lottie-react-native';
const animation = require('../../../../assets/json/loading_spinner.json');

const MODAL_WIDTH = Device.width * 0.8 > pixel(300) ? pixel(300) : Device.width * 0.8;
const LOTTIE_WIDTH = MODAL_WIDTH * 0.4;

export const LoadingModal = observer(() => {
    return (
        <Modal
            animationType="fade"
            visible={notificationStore.loadingVisible}
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <View style={styles.modalContainer}>
                    <LottieView
                        style={{ width: LOTTIE_WIDTH, height: LOTTIE_WIDTH }}
                        source={animation}
                        autoPlay
                        loop
                    />
                    {notificationStore.loadingTips?.length > 0 && (
                        <Text style={styles.loadingTips}>{notificationStore.loadingTips}</Text>
                    )}
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
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContainer: {
        width: MODAL_WIDTH,
        height: MODAL_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingTips: {
        color: '#fff',
        fontSize: font(15),
        lineHeight: font(20),
        marginTop: pixel(15),
    },
});
