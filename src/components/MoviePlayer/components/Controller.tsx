import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
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
    LogBox,
} from 'react-native';
import { PanGestureHandler, TapGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import Orientation from 'react-native-device-orientation';
import { setFullscreenMode } from 'react-native-realfullscreen';
import SystemSetting from 'react-native-system-setting';
import { HomeIndicator } from '@src/native';
import { Iconfont, SvgIcon, SvgPath } from '@src/components';
import { VolumeIndicator, BrightnessIndicator } from './SystemSettingIndicator';
import Buffering from './Buffering';
import SpeedUpIndicator from './SpeedUpIndicator';
import ProgressBar, { SeekingProgress } from './ProgressBar';
import { observer } from 'mobx-react';
import playerStore, { EpisodeScheme } from '../PlayerStore';
import useSafeArea from '../helper/useSafeArea';

const dww = Dimensions.get('window').width;
const dwh = Dimensions.get('window').height;
const PROGRESS_GESTURE_RATIO = [0.7, 0.7, 1, 2, 3];
const SETTING_GESTURE_RATIO = dww * 0.58;
const FADE_VALUE = dww * 0.25;
let INIT_BRIGHTNESS = 0;
let INIT_VOLUME = 0;

interface Props {
    playerRef: { current: { seek: (p: number) => void } };
}

export default observer(({ playerRef }: Props) => {
    const safeInset = useSafeArea({ fullscreen: playerStore.fullscreen });
    // ### 控制器显示逻辑
    const timerToControllerBar = useRef();
    const clearTimerToControllerBar = useCallback(() => {
        if (timerToControllerBar.current) {
            clearTimeout(timerToControllerBar.current);
        }
    }, []);
    const controllerBarAnimation = useRef(new Animated.Value(0));
    const animatedOpacity = controllerBarAnimation.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    const topControllerBarAnimationStyle = {
        opacity: animatedOpacity,
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
        opacity: animatedOpacity,
        transform: [
            {
                translateY: controllerBarAnimation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [FADE_VALUE, 0],
                }),
            },
        ],
    };
    // 控制器动画
    const controllerBarSlideAnimation = useCallback((type: 'slideIn' | 'slideOut') => {
        const toValue = type === 'slideIn' ? 1 : 0;
        clearTimerToControllerBar();
        Animated.timing(controllerBarAnimation.current, {
            toValue,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => null);
    }, []);
    // 控制器计时器
    const delaySlideOutControllerBar = useCallback(() => {
        clearTimerToControllerBar();
        timerToControllerBar.current = setTimeout(() => {
            playerStore.toggleControllerBarVisible(false);
            controllerBarSlideAnimation('slideOut');
        }, 4000);
    }, []);
    // 控制器显示/隐藏
    const toggleControllerBarVisible = useCallback(() => {
        playerStore.toggleControllerBarVisible(!playerStore.controllerBarVisible);
        if (playerStore.controllerBarVisible) {
            controllerBarSlideAnimation('slideIn');
            delaySlideOutControllerBar();
        } else {
            controllerBarSlideAnimation('slideOut');
        }
    }, []);
    // 视频加载完成并且没有锁定播放器，显示控制器
    useEffect(() => {
        if (playerStore.loaded && !playerStore.locked) {
            playerStore.toggleControllerBarVisible(true);
            controllerBarSlideAnimation('slideIn');
            delaySlideOutControllerBar();
        }
    }, [playerStore.loaded, playerStore.locked]);

    // ### 右边操作栏
    // 满屏播放
    const onToggleResizeMode = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            InteractionManager.runAfterInteractions(() => {
                toggleControllerBarVisible();
                playerStore.toggleResizeMode();
            });
        }
    }, []);
    // 锁定播放器
    const onLockPress = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            InteractionManager.runAfterInteractions(() => {
                toggleControllerBarVisible();
                playerStore.toggleLocked(true);
                Orientation.lockToLandscape();
            });
        }
    }, []);

    // ### 长按、单击、双击、手势调整视频进度
    const speedValueRef = useRef(0);
    const [speedUpIndicatorVisible, setSpeedUpIndicatorVisible] = useState(false);
    const onSpeedUpPanGestureHandler = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            // console.log('ACTIVE');
            speedValueRef.current = playerStore.rate;
            playerStore.setRateValue(3.0);
            setSpeedUpIndicatorVisible(true);
        } else if (speedValueRef.current > 0) {
            // console.log('END');
            playerStore.setRateValue(speedValueRef.current);
            setSpeedUpIndicatorVisible(false);
            speedValueRef.current = 0;
        }
    }, []);
    const doublePressHandlerRef = useRef();
    const panGestureStartProgressRef = useRef(0);
    const onProgressPanGestureHandler = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            panGestureStartProgressRef.current = playerStore.progress;
            // Log('onProgressPanGestureHandler ACTIVE', nativeEvent.state);
        }
        if (nativeEvent.state == State.END) {
            if (playerStore.sliding) {
                playerStore.toggleSliding(false);
                playerStore.setSeekProgress(playerStore.seekProgress);
                playerStore.setProgress(playerStore.seekProgress);
                playerRef.current?.seek(playerStore.seekProgress);
            }
            // Log('onProgressPanGestureHandler', nativeEvent.state);
        }
    }, []);
    const onProgressPanGestureEvent = useCallback(({ nativeEvent }) => {
        const tx = nativeEvent.translationX;
        const trackX = playerStore.fullscreen ? dwh : dww;
        //计算滑动距离和播放时间的最近比例
        const ratio = PROGRESS_GESTURE_RATIO[Math.min(Math.floor(playerStore.duration / trackX), 4)];
        const progress = panGestureStartProgressRef.current + tx * ratio;
        playerStore.toggleSliding(true);
        playerStore.toggleSeeking(true);
        if (progress <= 0) {
            playerStore.setSeekProgress(0);
        } else if (progress >= playerStore.duration) {
            playerStore.setSeekProgress(playerStore.duration);
        } else {
            playerStore.setSeekProgress(progress);
        }
        // Log('change progress', tx, progress);
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

    // ### 系统音量、亮度控制
    const [brightnessIndicatorVisible, setBrightnessIndicatorVisible] = useState(false);
    const [volumeIndicatorVisible, setVolumeIndicatorVisible] = useState(false);
    const brightnessSystemValueRef = useRef(0);
    const volumeSystemValueRef = useRef(0);
    const brightnessAnimationValue = useRef(new Animated.Value(0));
    const volumeAnimationValue = useRef(new Animated.Value(0));
    useEffect(() => {
        SystemSetting.getBrightness().then((v) => {
            INIT_BRIGHTNESS = brightnessSystemValueRef.current = v;
            brightnessAnimationValue.current.setValue(v * 100);
        });
        SystemSetting.getVolume().then((v) => {
            INIT_VOLUME = volumeSystemValueRef.current = v;
            volumeAnimationValue.current.setValue(v * 100);
        });
        return () => {
            SystemSetting.setAppBrightness(INIT_BRIGHTNESS);
            SystemSetting.setVolume(INIT_VOLUME);
        };
    }, []);
    // 控制指示器显示，保存最终值
    const onBrightnessPanGestureHandler = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            setBrightnessIndicatorVisible(true);
        }
        if (nativeEvent.state == State.END) {
            setBrightnessIndicatorVisible(false);
            brightnessSystemValueRef.current = brightnessAnimationValue.current._value / 100;
        }
    }, []);
    const onVolumePanGestureHandler = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            setVolumeIndicatorVisible(true);
        }
        if (nativeEvent.state == State.END) {
            setVolumeIndicatorVisible(false);
            volumeSystemValueRef.current = volumeAnimationValue.current._value / 100;
        }
    }, []);
    // 设置亮度和音量
    const onPanGestureBrightnessEvent = useCallback(({ nativeEvent }) => {
        const ty = -nativeEvent.translationY;
        let brightness = brightnessSystemValueRef.current + ty / SETTING_GESTURE_RATIO;
        if (brightness >= 1) brightness = 1;
        if (brightness <= 0) brightness = 0;
        // Log(`setting Brightness`, brightness);
        SystemSetting.setAppBrightness(brightness);
        brightnessAnimationValue.current.setValue(brightness * 100);
    }, []);
    const onPanGestureVolumeEvent = useCallback(({ nativeEvent }) => {
        const ty = -nativeEvent.translationY;
        // Log(`setting Volume`, ty);
        let volume = volumeSystemValueRef.current + ty / SETTING_GESTURE_RATIO;
        if (volume >= 1) volume = 1;
        if (volume <= 0) volume = 0;
        // Log(`setting Volume`, volume);
        SystemSetting.setVolume(volume);
        volumeAnimationValue.current.setValue(volume * 100);
    }, []);

    // ### 锁定竖屏
    const lockPortraitHandler = useCallback(() => {
        playerStore.toggleFullscreen(false);
        if (Platform.OS === 'ios') {
            HomeIndicator.setAutoHidden(false);
        } else {
            setFullscreenMode(false);
        }
        StatusBar.setHidden(false, 'slide');
        Orientation.lockToPortrait();
    }, []);

    // ...
    useEffect(() => {
        return () => {
            clearTimerToControllerBar();
            lockPortraitHandler();
        };
    }, []);

    return (
        <View style={styles.container}>
            {playerStore.fullscreen && (
                <Animated.View style={[styles.secRight, { right: safeInset + pixel(30), opacity: animatedOpacity }]}>
                    <View style={styles.operation}>
                        <TapGestureHandler onHandlerStateChange={onToggleResizeMode}>
                            <View style={[styles.sideOperateBtn, { marginBottom: pixel(10) }]}>
                                <SvgIcon
                                    name={playerStore.resizeMode === 'contain' ? SvgPath.zoomIn : SvgPath.zoomOut}
                                    size={22}
                                    color={'#FFFFFFDD'}
                                />
                            </View>
                        </TapGestureHandler>
                        <TapGestureHandler onHandlerStateChange={onLockPress}>
                            <View style={styles.sideOperateBtn}>
                                <SvgIcon name={SvgPath.unlock} size={22} color={'#FFFFFFDD'} />
                            </View>
                        </TapGestureHandler>
                    </View>
                </Animated.View>
            )}
            <Animated.View style={[styles.secTop, { paddingHorizontal: safeInset }, topControllerBarAnimationStyle]}>
                <LinearGradient
                    style={{ ...StyleSheet.absoluteFill, zIndex: -1 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}
                />
                <View style={[styles.sectionWrap, playerStore.fullscreen && { paddingHorizontal: pixel(20) }]}>
                    <View style={styles.row}>
                        {playerStore.fullscreen && (
                            <>
                                <Pressable style={styles.operateBtn} onPress={lockPortraitHandler}>
                                    <Iconfont name="fanhui" size={font(20)} color={'#ffffffee'} />
                                </Pressable>
                                <Text style={styles.movieName}>{playerStore.currentEpisode.name}</Text>
                            </>
                        )}
                    </View>
                    <View style={styles.row}></View>
                </View>
            </Animated.View>
            <LongPressGestureHandler onHandlerStateChange={onSpeedUpPanGestureHandler}>
                <PanGestureHandler
                    activeOffsetX={[-4, 4]}
                    onHandlerStateChange={onProgressPanGestureHandler}
                    onGestureEvent={onProgressPanGestureEvent}>
                    <TapGestureHandler waitFor={doublePressHandlerRef} onHandlerStateChange={onSinglePress}>
                        <TapGestureHandler
                            ref={doublePressHandlerRef}
                            onHandlerStateChange={onDoublePress}
                            numberOfTaps={2}>
                            <View style={styles.gestureContainer}>
                                <Buffering />
                                <SeekingProgress />
                                <SpeedUpIndicator visible={speedUpIndicatorVisible} />
                                <BrightnessIndicator
                                    visible={brightnessIndicatorVisible}
                                    value={brightnessAnimationValue.current}
                                />
                                <VolumeIndicator
                                    visible={volumeIndicatorVisible}
                                    value={volumeAnimationValue.current}
                                />
                                <PanGestureHandler
                                    activeOffsetY={[-4, 4]}
                                    onHandlerStateChange={onBrightnessPanGestureHandler}
                                    onGestureEvent={onPanGestureBrightnessEvent}>
                                    <Animated.View style={styles.brightnessSettingArea} />
                                </PanGestureHandler>
                                <PanGestureHandler
                                    activeOffsetY={[-4, 4]}
                                    onHandlerStateChange={onVolumePanGestureHandler}
                                    onGestureEvent={onPanGestureVolumeEvent}>
                                    <Animated.View style={styles.volumeSettingArea} />
                                </PanGestureHandler>
                            </View>
                        </TapGestureHandler>
                    </TapGestureHandler>
                </PanGestureHandler>
            </LongPressGestureHandler>
            <Animated.View
                style={[styles.secBottom, { paddingHorizontal: safeInset }, bottomControllerBarAnimationStyle]}>
                <LinearGradient
                    style={{ ...StyleSheet.absoluteFill, zIndex: -1 }}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}
                />
                <View style={[styles.sectionWrap, playerStore.fullscreen && { paddingHorizontal: pixel(20) }]}>
                    <ProgressBar
                        playerRef={playerRef}
                        onTouchMove={clearTimerToControllerBar}
                        onTouchEnd={delaySlideOutControllerBar}
                    />
                    {playerStore.fullscreen && (
                        <View style={styles.playerOperate}>
                            <View style={styles.row}>
                                <Pressable
                                    onPress={() => {
                                        playerStore.togglePaused(!playerStore.paused);
                                        delaySlideOutControllerBar();
                                    }}
                                    style={styles.operateBtn}>
                                    <Iconfont
                                        name={playerStore.paused ? 'bofang1' : 'zanting'}
                                        size={font(18)}
                                        color="#ffffffee"
                                    />
                                </Pressable>
                                {playerStore.currentEpisodeIndex < playerStore.series.length - 1 && (
                                    <Pressable
                                        onPress={() => {
                                            playerStore.nextEpisode();
                                            clearTimerToControllerBar();
                                            controllerBarSlideAnimation('slideOut');
                                        }}
                                        style={[styles.operateBtn, { marginLeft: -3, marginBottom: 1 }]}>
                                        <SvgIcon name={SvgPath.nextEpisode} size={25} color={'#FFFFFFDD'} />
                                    </Pressable>
                                )}
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
                                {playerStore.series.length > 1 && (
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
                </View>
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
    gestureContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    brightnessSettingArea: {
        flex: 1,
    },
    volumeSettingArea: {
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
    movieName: {
        marginLeft: pixel(4),
        fontSize: font(18),
        color: '#ffffffEE',
    },
    sectionWrap: {
        paddingVertical: pixel(12),
    },
    secRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: pixel(120),
        zIndex: 2,
        justifyContent: 'flex-end',
    },
    operation: {
        width: pixel(40),
        paddingVertical: pixel(5),
        borderRadius: pixel(20),
        backgroundColor: '#00000044',
    },
    sideOperateBtn: {
        width: pixel(40),
        height: pixel(40),
        justifyContent: 'center',
        alignItems: 'center',
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
