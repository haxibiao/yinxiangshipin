import React, { useMemo, useEffect, useState, useContext, useRef, useCallback } from 'react';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { useBounceAnimation, useLinearAnimation, exceptionCapture } from '@src/common';
import { observer, userStore } from '@src/store';
import { GQL, useMutation } from '@src/apollo';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';

const RewardProgress = observer(({ store }) => {
    const navigation = useNavigation();
    const firstReward = useRef(true);
    const userId = useMemo(() => userStore.me.id, [userStore.me]);
    const progress = (store.rewardProgress / store.rewardLimit) * 100;
    const rewardAble = progress >= 100;

    const [rewardGold, setReward] = useState();
    const [imageAnimation, startImageAnimation] = useBounceAnimation({ value: 0, toValue: 1 });
    const [textAnimation, startTextAnimation] = useLinearAnimation({ duration: 2000 });
    const [playReward] = useMutation(GQL.VideoPlayReward, {
        variables: {
            input: {
                video_ids: [...new Set(store.playedVideos)],
            },
        },
        refetchQueries: (): array => [
            {
                query: GQL.userProfileQuery,
                variables: { id: userId },
            },
        ],
    });

    useEffect(() => {
        async function fetchReward() {
            if (TOKEN) {
                store.rewardProgress = 0;
                startImageAnimation();
                const [error, res] = await exceptionCapture(playReward);
                store.playedVideos = [];
                if (error) {
                    setReward('领取失败');
                } else {
                    const gold = res?.data?.videoPlayReward?.gold;
                    setReward(`+${gold}${Config.goldAlias}`);
                    startTextAnimation();
                }
            } else if (firstReward.current) {
                firstReward.current = false;
                Toast.show({ content: '登录领取奖励哦' });
            }
        }
        if (rewardAble) {
            fetchReward();
        }
    }, [rewardAble]);

    const imageScale = imageAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    const textOpacity = textAnimation.interpolate({
        inputRange: [0, 0.1, 0.4, 0.7, 0.8, 1],
        outputRange: [0, 0.7, 0.8, 0.9, 1, 0],
    });

    const textTranslateY = textAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, -80],
    });

    const textScale = textAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1.5],
    });

    const onPress = useCallback(() => {
        if (userStore.login) {
            navigation.navigate('Wallet');
        } else {
            navigation.navigate('Login');
        }
    }, []);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View style={[styles.circleProgress, { transform: [{ scale: imageScale }] }]}>
                <Animated.Text
                    style={[
                        styles.rewardText,
                        { opacity: textOpacity, transform: [{ translateY: textTranslateY }, { scale: textScale }] },
                    ]}>
                    {rewardGold}
                </Animated.Text>
                <Image source={require('../../assets/ic_video_reward_progress.png')} style={styles.rewardImage} />
                {progress > 0 && !Device.IOS && (
                    <Progress.Circle
                        progress={progress / 100}
                        size={pixel(50)}
                        borderWidth={0}
                        color="#ff5644"
                        thickness={pixel(4)}
                        endAngle={1}
                        strokeCap="round"
                    />
                )}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
});
const styles = StyleSheet.create({
    circleProgress: {
        height: pixel(54),
        position: 'relative',
        width: pixel(54),
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#F00',
    },
    rewardImage: {
        ...StyleSheet.absoluteFill,
        height: pixel(54),
        width: pixel(54),
    },
    rewardText: {
        color: '#FFB100',
        fontSize: font(12),
        left: 0,
        position: 'absolute',
        right: 0,
        textAlign: 'center',
        top: 0,
    },
});

export default RewardProgress;
