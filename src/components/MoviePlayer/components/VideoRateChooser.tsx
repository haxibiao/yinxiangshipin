import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions, InteractionManager } from 'react-native';
import { TapGestureHandler, State, TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { observer } from 'mobx-react';
import playerStore from '../PlayerStore';

const RATE_VALUE = [3.0, 2.0, 1.5, 1.25, 1.0, 0.5];
const RATE_CHOOSER_WIDTH = Device.height * 0.4;

export default observer(() => {
    const animation = useRef(new Animated.Value(0));
    const animationStyle = {
        transform: [
            {
                translateX: animation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [RATE_CHOOSER_WIDTH, 0],
                }),
            },
        ],
    };

    const slideAnimation = useCallback((toValue: 0 | 1, callback?: () => void) => {
        Animated.timing(animation.current, {
            toValue,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            if (callback instanceof Function) {
                callback();
            }
        });
    }, []);

    const chooseValue = useCallback((value: number) => {
        playerStore.setRateValue(value);
        playerStore.sendNotice({ content: `已切换${value}倍数播放`, orientation: 'top' });
        InteractionManager.runAfterInteractions(() => {
            slideAnimation(0, () => {
                playerStore.toggleRateChooserVisible(false);
            });
        });
    }, []);

    const slideOut = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            InteractionManager.runAfterInteractions(() => {
                slideAnimation(0, () => {
                    playerStore.toggleRateChooserVisible(false);
                });
            });
        }
    }, []);

    useEffect(() => {
        if (playerStore.rateChooserVisible) {
            slideAnimation(1);
        }
    }, [playerStore.rateChooserVisible]);

    if (!playerStore.rateChooserVisible) {
        return null;
    }

    return (
        <TapGestureHandler onHandlerStateChange={slideOut}>
            <View style={styles.container}>
                <Animated.View style={[styles.chooserBox, animationStyle]}>
                    <LinearGradient
                        style={styles.chooserWrap}
                        start={{ x: 1, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }}
                        colors={['#00000099', '#00000066', '#00000044', '#00000000']}>
                        {RATE_VALUE.map((value, index) => {
                            const currentRate = value === playerStore.rate;
                            return (
                                <TouchableOpacity
                                    key={value}
                                    style={styles.rateItem}
                                    onPress={() => {
                                        chooseValue(value);
                                    }}>
                                    <Text style={[styles.rateText, currentRate && { color: Theme.primaryColor }]}>
                                        {value}
                                        <Text style={styles.chaText}>X</Text>
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </LinearGradient>
                </Animated.View>
            </View>
        </TapGestureHandler>
    );
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backgroundColor: '#00000011',
    },
    chooserBox: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: RATE_CHOOSER_WIDTH,
    },
    chooserWrap: {
        ...StyleSheet.absoluteFill,
        paddingVertical: pixel(20),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rateItem: {
        padding: pixel(10),
    },
    rateText: {
        fontWeight: 'bold',
        fontSize: font(18),
        color: '#ffffff',
    },
    chaText: {
        fontSize: font(14),
    },
});
