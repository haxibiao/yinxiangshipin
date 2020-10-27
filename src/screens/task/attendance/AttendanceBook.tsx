import React, { useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableWithoutFeedback, Animated } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import { ad } from 'react-native-ad';
import { appStore, adStore, userStore, notificationStore } from '@src/store';
import { SafeText } from '@src/components';
import { useCirculationAnimation } from '@src/common';
import { GQL, useMutation, useQuery, getUserReward } from '@src/apollo';
import * as SignedReturnOverlay from './SignedReturnOverlay';

interface SignInReturns {
    id: any;
    gold_reward: string | number;
    ticket_reward: string | number;
}

const AttendanceBook = (): JSX.Element => {
    const [boxShadowHeight, setBoxShadowHeight] = useState(150);

    const onLayoutEffect = useCallback((event) => {
        setBoxShadowHeight(event.nativeEvent.layout.height);
    }, []);

    const { data, loading, refetch } = useQuery(GQL.CheckInsQuery, {
        fetchPolicy: 'network-only',
    });
    const [createCheckIn] = useMutation(GQL.CreateCheckInMutation, {
        refetchQueries: (): array => [
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

    const keepCheckInDays = useMemo(() => {
        return data?.checkIns?.keep_checkin_days || 0;
    }, [data]);
    const todayChecked = useMemo(() => {
        return data?.checkIns?.today_checked;
    }, [data]);
    const checkIns = useMemo(() => {
        return data?.checkIns?.checks || fakeChecksData.checks;
    }, [data]);

    const toDaySignIn = useCallback(
        __.debounce(async () => {
            if (!todayChecked) {
                try {
                    const result = await createCheckIn();
                    const todayReturns = Helper.syncGetter('data.createCheckIn', result);
                    checkInSuccess(todayReturns);
                    refetch();
                } catch (e) {
                    const str = e.toString().replace(/Error: GraphQL error: /, '');
                    Toast.show({ content: str || '签到失败' });
                }
            } else {
                Toast.show({ content: '今天已经签到过了哦' });
            }
        }, 500),
        [todayChecked, refetch],
    );

    const checkInSuccess = useCallback(
        (returns: SignInReturns) => {
            SignedReturnOverlay.show({
                gold: returns.gold_reward,
                ticket: returns.ticket_reward,
                signInDays: keepCheckInDays + 1,
            });
        },
        [keepCheckInDays],
    );

    const animation = useCirculationAnimation({ duration: 2000, start: true });
    const translateY = animation.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: [-pixel(2), -pixel(5), 0, pixel(5), -pixel(2)],
    });

    const getDoubleReward = useCallback(() => {
        let called;
        let rewardVideo;
        if (userStore.me?.wallet?.total_withdraw_amount > 0) {
            rewardVideo = ad.startRewardVideo({ appid: adStore.tt_appid, codeid: adStore.codeid_reward_video });
        } else {
            rewardVideo = ad.startFullVideo({ appid: adStore.tt_appid, codeid: adStore.codeid_full_video });
        }
        rewardVideo.subscribe('onAdClose', (event) => {
            if (!called) {
                called = true;
                getUserReward('DOUBLE_SIGNIN_REWARD')
                    .then((res) => {
                        notificationStore.sendRewardNotice({
                            title: '获得签到双倍奖励',
                            gold: res?.gold,
                            ticket: res?.ticket,
                        });
                    })
                    .catch((err) => {
                        Toast.show({ content: err });
                    });
            }
        });
        rewardVideo.subscribe('onAdLoaded', (event) => {
            if (!called) {
                called = true;
                getUserReward('DOUBLE_SIGNIN_REWARD')
                    .then((res) => {
                        notificationStore.sendRewardNotice({
                            title: '获得签到双倍奖励',
                            gold: res?.gold,
                            ticket: res?.ticket,
                        });
                    })
                    .catch((err) => {
                        Toast.show({ content: err });
                    });
            }
        });
        rewardVideo.subscribe('onAdError', (event) => {
            Toast.show({ content: event?.message || '视频播放失败！', duration: 1500 });
        });
    }, []);

    const doubleCheckInReward = useMemo(() => {
        return (
            <TouchableWithoutFeedback onPress={getDoubleReward}>
                <View style={styles.signItem}>
                    <Animated.Image
                        source={require('@app/assets/images/double_signIn_reward.png')}
                        style={[styles.doubleRewardImage, { transform: [{ translateY }] }]}
                    />
                    <Image
                        style={styles.redEnvelop}
                        source={require('@app/assets/images/get_double_signIn_reward.gif')}
                    />
                    <SafeText style={styles.recordDayText}>领取</SafeText>
                </View>
            </TouchableWithoutFeedback>
        );
    }, [translateY]);

    const checkInRecord = useMemo(() => {
        return checkIns.map((elem, index) => {
            if (
                elem.checked !== false &&
                elem.reward_rate === 1 &&
                new Date(elem.date).getDay() === new Date().getDay() &&
                adStore.enableAd
            ) {
                return <View key={elem + index}>{doubleCheckInReward}</View>;
            }

            if (index === checkIns.length - 1) {
                return (
                    <View style={styles.signItem} key={elem + index}>
                        {!elem.checked && (
                            <Animated.Image
                                source={require('@app/assets/images/mystic_gift.png')}
                                style={[styles.mysticGift, { transform: [{ translateY }] }]}
                            />
                        )}
                        <View style={styles.giftImage}>
                            <Image
                                style={{ height: signItemWidth * 0.65, width: signItemWidth * 0.65 }}
                                source={
                                    elem.checked
                                        ? require('@app/assets/images/ic_task_attendance_open_reward.png')
                                        : require('@app/assets/images/ic_task_attendance_reward.png')
                                }
                            />
                        </View>

                        <SafeText style={styles.recordDayText}>{elem.checked ? '已签' : `${index + 1}天`}</SafeText>
                    </View>
                );
            }

            return (
                <View style={styles.signItem} key={elem + index}>
                    <ImageBackground
                        style={styles.coinImage}
                        source={
                            elem.checked
                                ? require('@app/assets/images/coin_grey.png')
                                : require('@app/assets/images/coin_yellow.png')
                        }>
                        <SafeText style={[styles.rewardGoldText, elem.checked && { color: '#a0a0a0' }]}>
                            {elem.gold_reward || 0}
                        </SafeText>
                    </ImageBackground>
                    <SafeText style={styles.recordDayText}>{elem.checked ? '已签' : `${index + 1}天`}</SafeText>
                </View>
            );
        });
    }, [keepCheckInDays, checkIns]);

    return (
        <BoxShadow
            setting={Object.assign({}, shadowOpt, {
                height: boxShadowHeight,
            })}>
            <View style={styles.attendanceBook} onLayout={onLayoutEffect}>
                <View style={styles.header}>
                    <SafeText style={styles.signInText}>
                        已签到
                        <SafeText style={styles.keepSignInText}>{` ${keepCheckInDays}/${checkIns.length} `}</SafeText>天
                    </SafeText>
                </View>
                <TouchableWithoutFeedback onPress={toDaySignIn} disabled={loading}>
                    <View style={styles.attendance}>{checkInRecord}</View>
                </TouchableWithoutFeedback>
            </View>
        </BoxShadow>
    );
};

const signItemWidth = (Device.WIDTH - pixel(40)) / 7;
const coinImageWidth = signItemWidth * 0.9;
const mysticGiftHeight = (coinImageWidth * 0.9 * 86) / 164;
const doubleRewardHeight = mysticGiftHeight;

const shadowOpt = {
    width: Device.WIDTH - pixel(30),
    height: pixel(150),
    color: '#E8E8E8',
    border: pixel(10),
    radius: pixel(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        margin: pixel(15),
    },
};

const fakeChecksData = {
    keep_checkin_days: 0,
    today_checked: true,
    checks: Array(7).fill({
        signed: false,
        gold_reward: 10,
    }),
};

const styles = StyleSheet.create({
    attendance: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingTop: pixel(10),
    },
    attendanceBook: {
        backgroundColor: '#fff',
        borderRadius: pixel(10),
        paddingHorizontal: pixel(5),
        paddingVertical: mysticGiftHeight,
        shadowColor: '#E8E8E8',
        shadowOffset: { width: pixel(5), height: pixel(5) },
        shadowOpacity: 0.8,
        shadowRadius: pixel(10),
    },
    coinImage: {
        alignItems: 'center',
        height: coinImageWidth,
        justifyContent: 'center',
        width: coinImageWidth,
    },
    doubleRewardImage: {
        alignItems: 'center',
        height: doubleRewardHeight,
        justifyContent: 'center',
        left: signItemWidth * 0.09,
        position: 'absolute',
        top: signItemWidth * 0.02,
        width: coinImageWidth * 0.9,
    },
    redEnvelop: {
        height: coinImageWidth * 0.9,
        width: coinImageWidth * 0.9,
        margin: coinImageWidth * 0.05,
    },
    giftImage: {
        height: signItemWidth * 0.9,
        width: signItemWidth * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: pixel(10),
    },
    keepSignInText: {
        color: '#FF5733',
        fontSize: font(18),
    },
    mysticGift: {
        alignItems: 'center',
        height: mysticGiftHeight,
        justifyContent: 'center',
        left: signItemWidth * 0.09,
        position: 'absolute',
        top: signItemWidth * 0.02,
        width: coinImageWidth * 0.9,
    },
    recordDayText: {
        color: '#888888',
        fontSize: font(12),
    },
    rewardGoldText: {
        color: '#9F641A',
        fontSize: font(11),
        fontWeight: 'bold',
        marginBottom: coinImageWidth * 0.07,
    },
    shareButton: {
        justifyContent: 'center',
        paddingLeft: pixel(10),
        paddingVertical: pixel(4),
    },
    shareText: {
        color: '#FF5733',
        fontSize: font(13),
        marginRight: pixel(2),
    },
    signInText: {
        color: Theme.defaultTextColor,
        fontSize: font(18),
        fontWeight: 'bold',
    },
    signItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: signItemWidth * 0.05,
        paddingTop: mysticGiftHeight,
    },
});

export default AttendanceBook;
