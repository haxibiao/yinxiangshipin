import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal, ImageBackground, TouchableOpacity } from 'react-native';
import { authNavigate } from '@src/common';
import { observer, Storage, GuideKeys, appStore, adStore, userStore, notificationStore } from '@src/store';
import { GQL, useQuery, useMutation } from '@src/apollo';
import { DebouncedPressable } from '../../Basic/DebouncedPressable';
import Iconfont from '../../Iconfont';

const MODAL_WIDTH = Device.width * 0.8 > pixel(290) ? pixel(290) : Device.width * 0.8;
const MODAL_HEIGHT = (MODAL_WIDTH * 756) / 578;

// 新用户红包
export const NewUserRedEnvelopeModal = observer(() => {
    const shown = useRef(false);
    const [visible, setVisible] = useState(false);
    const [rewardGold, setRewardGold] = useState(50);

    const { data } = useQuery(GQL.hasNewUserReward, {
        variables: {
            user_id: userStore.me?.id,
        },
        fetchPolicy: 'network-only',
        skip: !userStore.me?.id,
    });
    const [getNewUserReward, { called }] = useMutation(GQL.UserRewardMutation, {
        variables: {
            reason: 'NEW_USER_REWARD',
        },
        refetchQueries: () => [
            {
                query: GQL.meMetaQuery,
                fetchPolicy: 'network-only',
            },
        ],
        onCompleted: (res) => {
            setRewardGold(res?.reward?.gold || 50);
            showModal();
        },
        onError: (err) => {
            notificationStore.hasModalShown = false;
        },
    });

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
        }
    }, []);

    const onPress = useCallback(() => {
        hideModal();
        authNavigate('Wallet');
    }, []);

    useEffect(() => {
        if (
            notificationStore.guides.UserAgreementGuide &&
            adStore.loadedConfig &&
            userStore.isNewUser === undefined &&
            data?.hasNewUserReward !== undefined
        ) {
            if (data?.hasNewUserReward) {
                userStore.isNewUser = true;
                if (adStore.enableWallet) {
                    notificationStore.hasModalShown = true;
                    getNewUserReward();
                }
            } else {
                userStore.isNewUser = false;
            }
        }
    }, [notificationStore.guides.UserAgreementGuide, adStore.loadedConfig, userStore.isNewUser, data]);

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <ImageBackground
                    style={styles.newUserRedEnvelope}
                    source={require('@app/assets/images/wallet/new_user_red_envelope.png')}>
                    <View style={styles.redEnvelopeTop}>
                        <Text style={styles.modalTitle}>恭喜收到现金红包</Text>
                        <Text style={styles.modalText1}>新用户专属</Text>
                        <Text style={styles.rewardNumber}>
                            {rewardGold}
                            <Text style={styles.rewardName}>{Config.goldAlias}</Text>
                        </Text>
                    </View>
                    <View style={styles.redEnvelopeBot}>
                        <TouchableOpacity style={styles.redEnvelopeBtn} onPress={onPress}>
                            <Text style={styles.redEnvelopeBtnText}>查看红包</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalText2}>当天可提现</Text>
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
    closeBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: pixel(26),
        height: pixel(26),
        borderRadius: pixel(13),
        borderWidth: pixel(1),
        borderColor: '#fefefe',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    newUserRedEnvelope: {
        width: MODAL_WIDTH,
        height: MODAL_HEIGHT,
        paddingTop: MODAL_HEIGHT * 0.16,
        paddingBottom: MODAL_HEIGHT * 0.14,
        justifyContent: 'space-between',
    },
    redEnvelopeTop: {
        alignItems: 'center',
    },
    modalTitle: {
        color: '#fff',
        fontSize: font(20),
        fontWeight: 'bold',
    },
    modalText1: {
        color: '#fff',
        fontSize: font(15),
        marginVertical: pixel(20),
    },
    rewardNumber: {
        color: '#FFEC8B',
        fontSize: font(36),
        lineHeight: font(42),
        fontWeight: 'bold',
    },
    rewardName: {
        color: '#FFEC8B',
        fontSize: font(14),
        fontWeight: 'normal',
    },
    redEnvelopeBot: {
        alignItems: 'center',
    },
    redEnvelopeBtn: {
        width: MODAL_WIDTH * 0.68,
        height: MODAL_WIDTH * 0.15,
        borderRadius: MODAL_WIDTH * 0.15,
        backgroundColor: '#FE9D50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    redEnvelopeBtnText: {
        color: '#DD0D04',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    modalText2: {
        color: '#fff',
        fontSize: font(13),
        marginTop: pixel(15),
    },
});
