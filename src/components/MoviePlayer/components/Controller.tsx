import React, { useRef, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    StatusBar,
    Animated,
    Easing,
    Dimensions,
    InteractionManager,
} from 'react-native';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { Iconfont } from '@src/components';
import BrightnessIndicator from './BrightnessIndicator';
import VolumeIndicator from './VolumeIndicator';
import ProgressBar from './ProgressBar';
import Buffering from './Buffering';
import { observer } from 'mobx-react';
import playerStore from '../Store';

const VISIBLE_DURATION = 4000;
const FADE_VALUE = Dimensions.get('window').width * 0.25;
let controllerBarIsShown = false;

export default observer(({ playerRef, safeInset }) => {
    const timerToControllerBar = useRef();
    const clearTimerToControllerBar = useCallback(() => {
        if (timerToControllerBar.current) {
            clearTimeout(timerToControllerBar.current);
        }
    }, []);
    const controllerBarAnimation = useRef(new Animated.Value(0));
    const controllerBarOpacity = controllerBarAnimation.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    const topControllerBarAnimationStyle = {
        opacity: controllerBarOpacity,
        transform: [
            {
                translateY: controllerBarAnimation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-FADE_VALUE, 0],
                }),
            },
        ],
    };
    const bottomControllerBarAnimationStyle = {
        opacity: controllerBarOpacity,
        transform: [
            {
                translateY: controllerBarAnimation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [FADE_VALUE, 0],
                }),
            },
        ],
    };
    const runControllerBarAnimation = useCallback((toValue: 0 | 1) => {
        clearTimerToControllerBar();
        Animated.timing(controllerBarAnimation.current, {
            toValue,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => null);
    }, []);
    const setTimerToControllerBar = useCallback(() => {
        clearTimerToControllerBar();
        timerToControllerBar.current = setTimeout(() => {
            controllerBarIsShown = false;
            runControllerBarAnimation(0);
        }, VISIBLE_DURATION);
    }, []);
    const toggleControllerBarVisible = useCallback(() => {
        // Log('controllerBarIsShown', controllerBarIsShown);
        controllerBarIsShown = !controllerBarIsShown;
        if (controllerBarIsShown) {
            runControllerBarAnimation(1);
            setTimerToControllerBar();
        } else {
            runControllerBarAnimation(0);
        }
    }, []);
    useEffect(() => {
        if (playerStore.loaded) {
            controllerBarIsShown = true;
            runControllerBarAnimation(1);
            setTimerToControllerBar();
        }
    }, [playerStore.loaded]);

    const doublePressHandlerRef = useRef();

    const onPanGestureHandler = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            // Log('onPanGestureHandler ACTIVE', nativeEvent.state);
        }
        if (nativeEvent.state == State.END) {
            // Log('onPanGestureHandler', nativeEvent.state);
        }
    }, []);
    const onPanGestureEvent = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            // Log('onPanGestureEvent ACTIVE', nativeEvent.state);
        }
    }, []);
    const onSinglePress = useCallback(({ nativeEvent }) => {
        // Log('onSinglePress', nativeEvent.state);
        if (nativeEvent.state === State.ACTIVE) {
            // Log('onSinglePress ACTIVE', nativeEvent.state);
            InteractionManager.runAfterInteractions(() => {
                toggleControllerBarVisible();
            });
        }
    }, []);
    const onDoublePress = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            playerStore.togglePaused(!playerStore.paused);
            // Log('onDoublePress ACTIVE', nativeEvent.state);
        }
    }, []);

    const lockPortrait = useCallback(() => {
        playerStore.toggleFullscreen(false);
        Orientation.unlockAllOrientations();
        StatusBar.setHidden(false, 'slide');
        Orientation.lockToPortrait();
    }, []);

    useEffect(() => {
        return () => {
            clearTimerToControllerBar();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.secTop,
                    playerStore.fullscreen
                        ? { padding: pixel(10), paddingRight: safeInset + pixel(10) }
                        : { padding: pixel(10) },
                    topControllerBarAnimationStyle,
                ]}>
                <LinearGradient
                    style={{ ...StyleSheet.absoluteFill, zIndex: -1 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}
                />
                <View style={styles.row}>
                    {playerStore.fullscreen && (
                        <Pressable style={styles.operateBtn} onPress={lockPortrait}>
                            <Iconfont name="fanhui" size={font(20)} color={'#ffffffee'} />
                        </Pressable>
                    )}
                </View>
                <View style={styles.row}></View>
            </Animated.View>
            <PanGestureHandler onHandlerStateChange={onPanGestureHandler} onGestureEvent={onPanGestureEvent}>
                <TapGestureHandler onHandlerStateChange={onSinglePress} waitFor={doublePressHandlerRef}>
                    <TapGestureHandler
                        ref={doublePressHandlerRef}
                        enabled={!playerStore.buffering}
                        onHandlerStateChange={onDoublePress}
                        numberOfTaps={2}>
                        <View style={styles.container}>
                            <Buffering store={playerStore} />
                        </View>
                    </TapGestureHandler>
                </TapGestureHandler>
            </PanGestureHandler>
            <Animated.View
                style={[
                    styles.secBottom,
                    playerStore.fullscreen
                        ? { padding: pixel(10), paddingRight: safeInset + pixel(10) }
                        : { padding: pixel(10) },
                    bottomControllerBarAnimationStyle,
                ]}>
                <LinearGradient
                    style={{ ...StyleSheet.absoluteFill, zIndex: -1 }}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}
                />
                <ProgressBar
                    playerRef={playerRef}
                    clearTimer={clearTimerToControllerBar}
                    setTimer={setTimerToControllerBar}
                />
                {playerStore.fullscreen && (
                    <View style={styles.playerOperate}>
                        <View style={styles.row}>
                            <Pressable
                                onPress={() => {
                                    playerStore.togglePaused(!playerStore.paused);
                                    setTimerToControllerBar();
                                }}
                                style={styles.operateBtn}>
                                <Iconfont
                                    name={playerStore.paused ? 'bofang1' : 'zanting'}
                                    size={font(18)}
                                    color="#ffffffee"
                                />
                            </Pressable>
                        </View>
                        <View style={styles.row}>
                            <Pressable
                                onPress={() => {
                                    toggleControllerBarVisible();
                                    playerStore.toggleRateChooserVisible(true);
                                }}
                                style={styles.operateBtn}>
                                <Text style={styles.operateText}>倍速</Text>
                            </Pressable>
                            {playerStore.series.length > 0 && (
                                <Pressable
                                    onPress={() => {
                                        toggleControllerBarVisible();
                                        playerStore.toggleSeriesChooserVisible(true);
                                    }}
                                    style={styles.operateBtn}>
                                    <Text style={styles.operateText}>选集</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                )}
            </Animated.View>
        </View>
    );
});

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    secTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    secBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    progressOperate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerOperate: {
        marginTop: pixel(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    operateBtn: {
        height: pixel(30),
        paddingHorizontal: pixel(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    operateText: {
        fontSize: font(15),
        fontWeight: 'bold',
        color: '#ffffffEE',
    },
});
