import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { ad } from 'react-native-ad';
import { authNavigate } from '@src/router';
import { userStore, adStore } from '@src/store';
import { getUserReward } from '@src/apollo';
import { Iconfont, Row, HxfButton, RewardOverlay, SafeText } from '@src/components';
import { Overlay } from 'teaset';

interface Reward {
    gold?: number;
    ticket?: number;
}

interface Props {
    reward: Reward;
    title: string;
    type: any;
}

let OverlayKey: any = null;

const rewardTitle = (rewardList: { value: any; name: any }[]) => {
    return <SafeText style={styles.title}>{`恭喜获得${rewardList[0].value + rewardList[0].name}`}</SafeText>;
};

const SignedReturnOverlay = (props) => {
    const { gold, ticket, signInDays } = props;
    const [adShown, setAdShown] = useState(false);
    const currentGold = userStore.me?.gold;

    const loadAd = useCallback(
        __.debounce(() => {
            hide();
            let called;
            // const rewardVideo = ad.startRewardVideo({ appid: adStore.tt_appid, codeid: adStore.codeid_reward_video });
            const rewardVideo = ad.startFullVideo({ appid: adStore.tt_appid, codeid: adStore.codeid_full_video });

            if (!called) {
                called = true;
                getUserReward('SIGNIN_VIDEO_REWARD')
                    .then((res) => {
                        RewardOverlay.show({
                            reward: {
                                gold: res?.gold,
                                ticket: res?.ticket,
                            },
                            title: '额外奖励领取成功',
                        });
                    })
                    .catch((err) => {
                        Toast.show({ content: err });
                    });
            }
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
                    adShown ? {} : { borderBottomLeftRadius: pixel(10), borderBottomRightRadius: pixel(10) },
                ]}>
                <TouchableOpacity style={styles.closeBtn} onPress={hide}>
                    <Iconfont name={'guanbi1'} color={'#D8D8D8'} size={font(16)} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('@app/assets/images/wallet/bg_reward_overlay_top.png')}
                        style={styles.topImage}
                    />
                </View>
                <View style={styles.header}>
                    <SafeText style={styles.title}>
                        获得第
                        <Text style={{ color: '#EF514A' }}>{signInDays}</Text>天签到奖励
                    </SafeText>
                    <View style={styles.rewardContainer}>
                        <View style={styles.rewardItem}>
                            <Image
                                source={require('@app/assets/images/wallet/icon_wallet_diamond.png')}
                                style={styles.rewardIcon}
                            />
                            <Text style={styles.rewardValue}>+{gold}</Text>
                        </View>
                        {ticket > 0 && (
                            <View style={styles.rewardItem}>
                                <Image
                                    source={require('@app/assets/images/wallet/icon_wallet_giftAward.png')}
                                    style={styles.rewardIcon}
                                />
                                <Text style={styles.rewardValue}>+{ticket}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.tomorrowCheck}>连续签到可领取更多奖励</Text>
                </View>
                <View style={styles.modalFooter}>
                    <HxfButton
                        style={styles.buttonStyle}
                        titleStyle={{ color: '#623605' }}
                        title={adStore.enableAd ? '看视频领取额外奖励' : '查看奖励详情'}
                        onPress={adStore.enableAd ? loadAd : navigateAction}
                    />
                </View>
                {adStore.enableAd && (
                    <Row style={styles.currentGold}>
                        <Text
                            style={{
                                fontSize: font(13),
                                color: '#999999',
                            }}>
                            当前{Config.goldAlias}:
                        </Text>
                        <Image
                            source={require('@app/assets/images/wallet/icon_wallet_diamond.png')}
                            style={styles.currentDiamond}
                        />
                        <Text
                            style={{
                                fontSize: font(13),
                                color: '#999999',
                            }}>
                            {currentGold}
                            <Text style={{ color: Theme.themeRed }}>
                                ≈{Helper.goldExchange(currentGold, userStore.me?.exchangeRate)}元
                            </Text>
                        </Text>
                    </Row>
                )}
            </View>
            {adShown && (
                <Image
                    source={require('@app/assets/images/bg_feed_overlay_line.png')}
                    style={{
                        width: Device.WIDTH - pixel(48),
                        height: ((Device.WIDTH - pixel(48)) * 30) / 640,
                    }}
                />
            )}
            <View style={styles.adContainer}>
                <ad.Feed
                    codeid={adStore.codeid_feed}
                    adWidth={Device.WIDTH - pixel(50)}
                    onAdLayout={() => {
                        setAdShown(true);
                    }}
                    onAdError={() => {
                        setAdShown(false);
                    }}
                    onAdClose={() => {
                        setAdShown(false);
                    }}
                />
            </View>
        </View>
    );
};

export const show = (props: Props) => {
    const overlayView = (
        <Overlay.View animated>
            <SignedReturnOverlay {...props} />
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
    closeBtn: {
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
    topImage: {
        width: (Device.WIDTH * 0.28 * 318) / 216,
        height: Device.WIDTH * 0.28,
        marginTop: pixel(-75),
    },
    header: {
        marginVertical: pixel(12),
        alignItems: 'center',
    },
    title: {
        fontSize: font(18),
        color: '#2b2b2b',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    rewardContainer: {
        marginTop: pixel(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: pixel(5),
    },
    rewardIcon: {
        width: pixel(30),
        height: pixel(30),
    },
    rewardValue: {
        fontSize: font(14),
        color: '#b2b2b2',
    },
    tomorrowCheck: {
        fontSize: font(14),
        textAlign: 'center',
        marginTop: pixel(8),
        color: '#999999',
        lineHeight: font(19),
    },
    modalFooter: {
        alignItems: 'center',
        marginBottom: pixel(12),
    },
    buttonStyle: {
        backgroundColor: '#FCE03D',
        borderRadius: pixel(19),
        height: pixel(38),
        width: Device.WIDTH * 0.6,
    },
    currentGold: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentDiamond: {
        width: pixel(25),
        height: pixel(25),
    },
    adContainer: {
        width: Device.WIDTH - pixel(48),
        backgroundColor: '#FFF',
        borderBottomLeftRadius: pixel(10),
        borderBottomRightRadius: pixel(10),
    },
});

export default { show, hide };
