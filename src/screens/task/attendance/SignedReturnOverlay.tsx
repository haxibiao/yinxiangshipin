import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Iconfont, Row, HxfButton } from '@src/components';
import { playAdvertVideo, getUserReward } from '@src/common';
import { userStore, appStore } from '@src/store';
import { authNavigate } from '@src/router';
import { Overlay } from 'teaset';

interface Props {
    gold: any;
    reward: any;
    signInDays: any;
}
let OverlayKey: any = null;

const ReceiveTaskOverlay = (props: Props) => {
    const { gold, energy, signInDays } = props;
    const currentGold = userStore.me?.gold + gold;

    const [adShow, setAdShow] = useState(false);
    const loadAd = useCallback(
        __.debounce(() => {
            playAdvertVideo({ callback: () => getUserReward('SIGNIN_VIDEO_REWARD') });
            hide();
        }),
        [],
    );

    const navigateAction = useCallback(() => {
        authNavigate('BillingRecord', {
            initialPage: 2,
        });
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.content,
                    adShow ? {} : { borderBottomLeftRadius: pixel(10), borderBottomRightRadius: pixel(10) },
                ]}>
                <TouchableOpacity style={styles.operation} onPress={hide}>
                    <Iconfont name="guanbi1" color="#D8D8D8" size={font(16)} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('@app/assets/images/bg_overlay_top.png')} style={styles.headerImage} />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.todayChecked}>
                            获得第
                            <Text style={{ color: '#EF514A' }}>{signInDays}</Text>天签到奖励
                        </Text>
                        <View style={styles.rewards}>
                            <Row>
                                <Image
                                    source={require('@app/assets/images/icon_wallet_dmb.png')}
                                    style={styles.rewardImage}
                                />
                                <Text style={styles.rewardNumber}>+{gold}</Text>
                            </Row>
                            {energy > 0 && (
                                <Row style={{ margintLeft: pixel(15) }}>
                                    <Image
                                        source={require('@app/assets/images/diamond.png')}
                                        style={styles.rewardImage}
                                    />
                                    <Text style={styles.rewardNumber}>+{energy}</Text>
                                </Row>
                            )}
                        </View>
                        <Text style={styles.tomorrowCheck}>连续签到可领取更多奖励</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: pixel(5), paddingBottom: pixel(15) }}>
                        <HxfButton
                            style={styles.button}
                            titleStyle={{ color: '#623605' }}
                            title={appStore.disableAd ? '查看奖励详情' : '看视频领取额外奖励'}
                            onPress={appStore.disableAd ? navigateAction : loadAd}
                        />
                    </View>
                    <Row style={{ justifyContent: 'center' }}>
                        <Text
                            style={{
                                fontSize: font(13),
                                color: '#999999',
                            }}>
                            当前{Config.goldAlias}:
                        </Text>
                        <Image
                            source={require('@app/assets/images/icon_wallet_dmb.png')}
                            style={{ width: pixel(17), height: pixel(17), marginHorizontal: pixel(3) }}
                        />
                        <Text
                            style={{
                                fontSize: font(13),
                                color: '#999999',
                            }}>
                            {currentGold}
                            <Text style={{ color: Theme.primaryColor }}>
                                ≈{Helper.goldExchange(currentGold, userStore.me?.exchange_rate)}元
                            </Text>
                        </Text>
                    </Row>
                </View>
            </View>
            {adShow && (
                <Image
                    source={require('@app/assets/images/bg_feed_overlay_line.png')}
                    style={{
                        width: Device.WIDTH - pixel(48),
                        height: ((Device.WIDTH - pixel(48)) * 30) / 640,
                    }}
                />
            )}
        </View>
    );
};

export const show = (props: Props) => {
    const overlayView = (
        <Overlay.View animated={true}>
            <ReceiveTaskOverlay {...props} />
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    operation: {
        position: 'absolute',
        right: pixel(0),
        top: pixel(0),
        paddingTop: pixel(10),
        paddingHorizontal: pixel(15),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    content: {
        width: Device.WIDTH - pixel(48),
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingBottom: pixel(15),
        borderTopLeftRadius: pixel(10),
        borderTopRightRadius: pixel(10),
    },
    header: {
        alignItems: 'center',
        marginTop: pixel(15),
        paddingBottom: pixel(15),
        paddingHorizontal: pixel(25),
    },
    todayChecked: {
        fontSize: font(16),
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#212121',
    },
    rewards: {
        marginTop: pixel(5),
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardImage: {
        height: pixel(20),
        marginRight: pixel(3),
        width: pixel(20),
    },
    rewardNumber: {
        color: '#FCE03D',
        fontSize: font(14),
    },
    tomorrowCheck: {
        fontSize: font(14),
        textAlign: 'center',
        marginTop: pixel(8),
        color: '#999999',
        lineHeight: font(19),
    },
    headerImage: {
        width: (Device.WIDTH * 0.32 * 487) / 375,
        height: Device.WIDTH * 0.32,
        marginTop: pixel(-75),
    },
    button: {
        backgroundColor: '#FCE03D',
        borderRadius: pixel(19),
        height: pixel(38),
        width: Device.WIDTH * 0.6,
    },
});

export default { show, hide };
