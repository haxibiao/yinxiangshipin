/*
 * @flow
 * created by wyk made in 2019-09-09 11:10:28
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { authNavigate } from '@src/router';

function NewUserTaskGuidance({ onDismiss }) {
    const [step, setStep] = useState(0);
    const guidesView = useMemo(() => {
        return [
            <TouchableWithoutFeedback
                key={1}
                onPress={() => {
                    setStep(1);
                    authNavigate('TaskCenter');
                }}>
                <View style={styles.container}>
                    <Image
                        style={styles.redPacket}
                        source={require('@app/assets/images/guide/bg_new_user_red_packet.png')}
                    />
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback
                key={2}
                onPress={() => {
                    setStep(2);
                    authNavigate('Wallet');
                }}>
                <View style={styles.container}>
                    <Image style={styles.taskGuide} source={require('@app/assets/images/guide/daily_task_guide.png')} />
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback
                key={3}
                onPress={() => {
                    onDismiss();
                }}>
                <Image
                    style={styles.walletGuide}
                    source={require('@app/assets/images/guide/bg_new_user_answer_guidance.png')}
                />
            </TouchableWithoutFeedback>,
        ];
    }, []);

    return guidesView[step];
}

const redPacketWidth = (Device.WIDTH * 3) / 5;
const redPacketHeight = (redPacketWidth * 615) / 471;

const taskGuideWidth = Device.WIDTH;
const taskGuideHeight = (taskGuideWidth * 750) / 790;

const walletGuideWidth = Device.WIDTH - pixel(30);
const walletGuideHeight = (walletGuideWidth * 838) / 336;

const WalletBgWidth = (Device.WIDTH - pixel(20)) * 0.66 - walletGuideHeight * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    redPacket: {
        width: redPacketWidth,
        height: redPacketHeight,
        resizeMode: 'contain',
    },
    taskGuide: {
        width: taskGuideWidth,
        height: taskGuideHeight,
        resizeMode: 'contain',
    },
    walletGuide: {
        position: 'absolute',
        top: WalletBgWidth,
        left: pixel(15),
        width: walletGuideWidth,
        height: walletGuideHeight,
        resizeMode: 'contain',
    },
});

export default NewUserTaskGuidance;
