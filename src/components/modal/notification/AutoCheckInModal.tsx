import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal, ImageBackground } from 'react-native';
import { ad } from 'react-native-ad';
import { authNavigate } from '@src/router';
import { observer, adStore, userStore, notificationStore } from '@src/store';
import { GQL, useQuery, useMutation } from '@src/apollo';
import Iconfont from '../../../components/Iconfont';
import { DebouncedPressable } from '../../../components/Basic/DebouncedPressable';

const MODAL_WIDTH = Device.WIDTH * 0.8 > pixel(300) ? pixel(300) : Device.WIDTH * 0.8;
const BUTTON_WIDTH = MODAL_WIDTH * 0.66;
const BUTTON_HEIGHT = BUTTON_WIDTH * 0.2;

export const AutoCheckInModal = observer(() => {
    const [visible, setVisible] = useState(false);
    const [checkInData, setCheckInData] = useState({ balance: 0.3, goldReward: 10, keepCheckInDays: 1 });
    const shown = useRef(false);

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            shown.current = false;
            setVisible(false);
            notificationStore.hasModalShown = false;
            userStore.startDetectPhotoAlbum = true;
        }
    }, []);

    const { data, loading } = useQuery(GQL.CheckInsQuery, {
        fetchPolicy: 'network-only',
        skip: !userStore.me?.id,
    });
    const [createCheckIn] = useMutation(GQL.CreateCheckInMutation, {
        refetchQueries: () => [
            {
                query: GQL.CheckInsQuery,
                fetchPolicy: 'network-only',
            },
            {
                query: GQL.MeMetaQuery,
                fetchPolicy: 'network-only',
            },
        ],
    });
    const todayChecked = useMemo(() => data?.checkIns?.today_checked, [data]);

    const toDaySignIn = useCallback(async () => {
        try {
            const result = await createCheckIn();
            const todayReturns = result?.data?.createCheckIn;
            const walletBalance =
                Number(userStore.me.balance) +
                Number(Helper.goldExchange(todayReturns.gold_reward + userStore.me.gold, userStore.me.exchangeRate));
            setCheckInData({
                goldReward: todayReturns.gold_reward,
                keepCheckInDays: todayReturns.keep_checkin_days,
                balance: Math.max(walletBalance, 0.3).toFixed(1),
            });
            showModal();
        } catch (error) {
            notificationStore.hasModalShown = false;
            userStore.startDetectPhotoAlbum = true;
        }
    }, [createCheckIn]);

    useEffect(() => {
        if (userStore.isNewUser === false && !notificationStore.hasModalShown && todayChecked !== undefined) {
            if (!todayChecked && adStore.enableWallet) {
                notificationStore.hasModalShown = true;
                toDaySignIn();
            } else {
                userStore.startDetectPhotoAlbum = true;
            }
        }
    }, [userStore.isNewUser, adStore.enableWallet, todayChecked]);

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <ImageBackground
                    style={styles.modalContainer}
                    source={require('@app/assets/images/bg/wallet_fireworks_bg.png')}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>连续签到{checkInData.keepCheckInDays}天</Text>
                    </View>
                    <Text style={styles.goldReward}>{`奖励${checkInData.goldReward}${Config.goldAlias}`}</Text>
                    <View style={styles.modalBody}>
                        <Text style={styles.modalContent}>连续签到奖励更多,记得每天来看看我</Text>
                        <Text style={styles.assetsText}>当天所得的金币会在次日转换成余额</Text>
                        <Text style={styles.assetsText}>
                            目前大约可提现
                            <Text style={{ color: '#FFCF3C', fontWeight: 'bold' }}>{checkInData.balance}元</Text>
                        </Text>
                        <DebouncedPressable
                            style={styles.modalBtn}
                            onPress={() => {
                                hideModal();
                                if (checkInData.balance >= 0.3) {
                                    authNavigate('Wallet');
                                } else {
                                    authNavigate('TaskCenter');
                                }
                            }}>
                            <Text style={styles.modalBtnText}>{checkInData.balance >= 0.3 ? '去提现' : '做任务'}</Text>
                        </DebouncedPressable>
                    </View>
                </ImageBackground>
                <DebouncedPressable style={styles.closeBtn} onPress={hideModal} activeOpacity={1}>
                    <Iconfont name="guanbi1" size={font(14)} color={'#fefefe'} />
                </DebouncedPressable>
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
        height: MODAL_WIDTH,
        backgroundColor: '#fff',
        borderRadius: pixel(10),
        overflow: 'hidden',
    },
    closeBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pixel(20),
        width: pixel(26),
        height: pixel(26),
        borderRadius: pixel(13),
        borderWidth: pixel(1),
        borderColor: '#fefefe',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalHeader: {
        paddingTop: pixel(15),
    },
    modalTitle: {
        color: '#121212',
        fontSize: font(17),
        lineHeight: font(22),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    goldReward: {
        position: 'absolute',
        left: 0,
        right: 0,
        marginTop: pixel(50),
        color: '#FFCF3C',
        fontSize: font(15),
        lineHeight: font(20),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalBody: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pixel(16),
        paddingVertical: pixel(10),
    },
    modalContent: {
        color: '#7B7B7B',
        fontSize: font(15),
        lineHeight: font(22),
        marginBottom: pixel(15),
    },
    assetsText: {
        color: '#7B7B7B',
        fontSize: font(13),
        lineHeight: font(20),
    },
    currentDiamond: {
        width: pixel(25),
        height: pixel(25),
    },
    modalBtn: {
        marginTop: pixel(20),
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
