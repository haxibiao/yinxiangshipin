import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal } from 'react-native';
import { ad } from 'react-native-ad';
import { authNavigate } from '@src/common';
import { observer, autorun, adStore, userStore, notificationStore } from '@src/store';
import Iconfont from '../../../components/Iconfont';
import { DebouncedPressable } from '../../../components/Basic/DebouncedPressable';

const MODAL_WIDTH = Device.WIDTH * 0.84 > pixel(320) ? pixel(320) : Device.WIDTH * 0.84;
const BUTTON_WIDTH = MODAL_WIDTH * 0.66;
const BUTTON_HEIGHT = BUTTON_WIDTH * 0.2;

export const RewardNotificationModal = observer(() => {
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
            notificationStore.reduceRewardNotice();
            setVisible(false);
            setNoticeData({});
            shown.current = false;
        }
    }, []);

    useEffect(
        () =>
            autorun(() => {
                if (notificationStore.rewardNotice.length > 0) {
                    showModal(notificationStore.rewardNotice[0]);
                }
            }),
        [],
    );

    return (
        <Modal
            animationType="fade"
            visible={visible}
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <View style={styles.modalContainer}>
                    <DebouncedPressable style={styles.closeBtn} onPress={hideModal} activeOpacity={1}>
                        <Iconfont name="guanbi1" size={font(15)} color={'#b2b2b2'} />
                    </DebouncedPressable>
                    <Image
                        style={styles.topRewardImage}
                        source={require('@app/assets/images/wallet/bg_reward_overlay_top.png')}
                    />
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{noticeData?.title || '获得奖励'}</Text>
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.modalContent}>
                            <Text style={styles.rewardItem}>
                                {noticeData?.gold > 0 ? Config.goldAlias + '+' + noticeData?.gold : ''}
                            </Text>
                            <Text style={styles.rewardItem}>
                                {noticeData?.ticket > 0 ? Config.ticketAlias + '+' + noticeData?.ticket : ''}
                            </Text>
                        </View>
                        <View style={styles.walletInfo}>
                            <Text style={styles.assetsText}>当前{Config.goldAlias}</Text>
                            <Image
                                source={require('@app/assets/images/wallet/icon_wallet_diamond.png')}
                                style={styles.currentDiamond}
                            />
                            <Text style={[styles.assetsText, { marginRight: pixel(15) }]}>{userStore.me.gold}</Text>
                            <Text style={styles.assetsText}>账户余额</Text>
                            <Image
                                source={require('@app/assets/images/wallet/icon_wallet_balance.png')}
                                style={styles.currentDiamond}
                            />
                            <Text style={styles.assetsText}>{userStore.me.balance}</Text>
                        </View>
                        <DebouncedPressable
                            style={styles.modalBtn}
                            onPress={() => {
                                hideModal();
                                if (noticeData.buttonHandler instanceof Function) {
                                    noticeData.buttonHandler();
                                } else {
                                    authNavigate('WithdrawHistory', { tabPage: 2 });
                                }
                            }}>
                            <Text style={styles.modalBtnText}>{noticeData?.buttonName || '查看详情'}</Text>
                        </DebouncedPressable>
                    </View>
                </View>
                <Image source={require('@app/assets/images/bg_feed_overlay_line.png')} style={styles.feedBgLine} />
                <View style={styles.adContainer}>
                    <ad.Feed codeid={adStore.codeid_feed} adWidth={MODAL_WIDTH} />
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
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(10),
        borderTopRightRadius: pixel(10),
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
    topRewardImage: {
        width: (MODAL_WIDTH * 0.28 * 318) / 216,
        height: MODAL_WIDTH * 0.28,
        marginTop: -MODAL_WIDTH * 0.2,
        alignSelf: 'center',
    },
    modalHeader: {
        paddingTop: pixel(10),
    },
    modalTitle: {
        color: '#121212',
        fontSize: font(17),
        lineHeight: font(22),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalBody: {
        alignItems: 'center',
        paddingHorizontal: pixel(16),
        paddingVertical: pixel(10),
    },
    modalContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardItem: {
        color: '#FCE03D',
        fontSize: font(15),
        lineHeight: font(22),
        fontWeight: 'bold',
        marginHorizontal: pixel(5),
    },
    walletInfo: {
        marginTop: pixel(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    assetsText: {
        color: '#b2b2b2',
        fontSize: font(13),
        lineHeight: font(18),
    },
    currentDiamond: {
        width: pixel(25),
        height: pixel(25),
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
    feedBgLine: {
        width: MODAL_WIDTH,
        height: (MODAL_WIDTH * 30) / 640,
    },
    adContainer: {
        width: MODAL_WIDTH,
        minHeight: MODAL_WIDTH * 0.66,
        maxHeight: MODAL_WIDTH * 0.85,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderBottomLeftRadius: pixel(10),
        borderBottomRightRadius: pixel(10),
    },
});
