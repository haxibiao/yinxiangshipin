import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useDoubleHandler, syncGetter, moment, useLinearAnimation } from '@src/common';
import { Iconfont } from '@src/components';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { useApolloClient } from '@apollo/react-hooks';

interface Props {
    poster: string;
    source: string;
    resizeMode: 'cover' | 'contain';
    onLoad?: ({ duration }) => void;
}

export default (props: Props) => {
    const { poster, source, resizeMode = 'contain', onLoad } = props;

    const [paused, setPause] = useState(false);
    const lastState = useRef(paused);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [sliderValue, setSliderValue] = useState(0);
    const [controlVisible, setControlVisible] = useState(false);
    const [rate, setRate] = useState(1);
    const sliderIsMoveOn = useRef(false);
    const duration = useRef(props.duration);
    const videoRef = useRef();
    const visibleTimer = useRef<ReturnType<typeof setTimeout>>();

    const [rateAnimation, startRateAnimation] = useLinearAnimation({ duration: 300, initValue: 0 });
    const rateOpacity = rateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    const rateTranslateY = rateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, headerHeight],
    });

    const controlVisibleTimer = useCallback(() => {
        if (visibleTimer.current) {
            clearTimeout(visibleTimer.current);
        }
        visibleTimer.current = setTimeout(() => {
            setControlVisible(false);
        }, 4000);
    }, []);

    const onSliderValueChanged = useCallback(value => {
        sliderIsMoveOn.current = true;
        if (visibleTimer.current) {
            clearTimeout(visibleTimer.current);
        }
        setSliderValue(value);
        setProgress(value);
    }, []);

    const onSlidingComplete = useCallback(value => {
        sliderIsMoveOn.current = false;
        controlVisibleTimer();
        videoRef.current.seek(value);
    }, []);

    const twiceRate = useCallback(() => {
        setRate(r => {
            startRateAnimation(0, 1);
            return 2;
        });
    }, []);

    const defaultRate = useCallback(() => {
        setRate(r => {
            if (r === 2) {
                startRateAnimation(1, 0);
            }
            return 1;
        });
    }, []);

    const togglePause = useCallback(() => {
        setPause(v => {
            if (visibleTimer.current) {
                clearTimeout(visibleTimer.current);
            }
            if (v) {
                controlVisibleTimer();
            }
            return !v;
        });
    }, []);

    const toggleControlVisible = useCallback(() => {
        setControlVisible(v => {
            controlVisibleTimer();
            return !v;
        });
    }, []);

    const onPress = useDoubleHandler({ doubleClick: togglePause, singleClick: toggleControlVisible });

    const onBlur = useCallback(() => {
        setPause(p => {
            lastState.current = p;
            return true;
        });
    }, []);

    const onFocus = useCallback(() => {
        setPause(lastState.current);
    }, []);

    const videoEvents = useMemo((): object => {
        return {
            onLoadStart() {
                setProgress(0);
                if (!sliderIsMoveOn.current) {
                    setSliderValue(0);
                }
            },

            onLoad(data) {
                setLoading(false);
                duration.current = data.duration;
                if (onLoad instanceof Function) {
                    onLoad({ duration: duration.current });
                }
            },

            onProgress(data) {
                setProgress(data.currentTime);
                if (!sliderIsMoveOn.current) {
                    setSliderValue(data.currentTime);
                }
            },

            onEnd() {},

            onError() {},

            onAudioBecomingNoisy() {
                setPause(true);
            },
        };
    }, []);

    const videoCover = useMemo(() => {
        if (poster) {
            return (
                <View style={styles.cover}>
                    <Image style={styles.curtain} source={poster} resizeMode="cover" blurRadius={4} />
                    <View style={styles.mask} />
                </View>
            );
        }
        return null;
    }, [poster]);

    return (
        <TouchableWithoutFeedback onPress={onPress} onLongPress={twiceRate} onPressOut={defaultRate}>
            <View style={styles.playerContainer}>
                {videoCover}
                <Video
                    ref={videoRef}
                    resizeMode={resizeMode}
                    paused={paused}
                    source={source}
                    style={styles.fullPlayer}
                    rate={rate} // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                    volume={1} // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
                    muted={false} // true代表静音，默认为false.
                    progressUpdateInterval={150}
                    disableFocus={true}
                    useTextureView={false}
                    repeat={false} // 是否重复播放
                    ignoreSilentSwitch="obey"
                    playWhenInactive={false}
                    playInBackground={false}
                    {...videoEvents}
                />
                <View
                    style={[styles.videoControl, controlVisible && { opacity: 1, zIndex: 1 }]}
                    // onStartShouldSetResponderCapture={() => false}
                    // onStartShouldSetResponder={evt => true}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.playButton}
                        disabled={!controlVisible}
                        onPress={togglePause}>
                        <Iconfont name={paused ? 'bofang1' : 'zanting'} size={percent(8)} color="#fff" />
                    </TouchableOpacity>
                    <LinearGradient
                        style={styles.bottomControl}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['rgba(000,000,000,0.4)', 'rgba(000,000,000,0.2)', 'rgba(000,000,000,0.0)']}>
                        <View style={styles.playerStatus} onStartShouldSetResponder={evt => true}>
                            <View style={styles.momentWrap}>
                                <Text style={styles.momentText}>
                                    {moment(sliderIsMoveOn.current ? sliderValue : progress)}
                                </Text>
                            </View>
                            <Slider
                                style={{ flex: 1 }}
                                maximumTrackTintColor="rgba(225,225,225,0.5)" // 滑块右侧轨道的颜色
                                minimumTrackTintColor="#fff" // 滑块左侧轨道的颜色
                                thumbTintColor="#fff"
                                value={sliderValue}
                                minimumValue={0}
                                maximumValue={duration.current}
                                onValueChange={onSliderValueChanged}
                                onSlidingComplete={onSlidingComplete}
                            />
                            <View style={styles.momentWrap}>
                                <Text style={styles.momentText}>{moment(duration.current)}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <Animated.View
                    style={[styles.toast, { opacity: rateOpacity, transform: [{ translateY: rateTranslateY }] }]}>
                    <View style={styles.toastInfo}>
                        <Text style={styles.toastText}>2倍速播放中</Text>
                    </View>
                </Animated.View>
                <View style={[styles.loadingStatus, loading && { zIndex: 9, opacity: 1 }]}>
                    <ActivityIndicator color={'#fff'} size={'large'} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const headerHeight = Theme.navBarHeight + Theme.statusBarHeight;

const styles = StyleSheet.create({
    playerContainer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: '#000000',
    },
    fullPlayer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    cover: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    curtain: {
        alignItems: 'center',
        flex: 1,
        height: undefined,
        justifyContent: 'center',
        width: undefined,
    },
    mask: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    videoControl: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
        zIndex: -1,
    },
    playButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: percent(8),
        height: percent(16),
        justifyContent: 'center',
        width: percent(16),
    },
    bottomControl: {
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
    },
    playerStatus: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: pixel(5),
        paddingVertical: pixel(10),
    },
    momentWrap: {
        paddingHorizontal: pixel(10),
    },
    momentText: {
        color: '#fff',
        fontSize: font(14),
    },
    toast: {
        alignItems: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    toastInfo: {
        backgroundColor: 'rgba(58,65,77,0.7)',
        borderRadius: pixel(18),
        height: pixel(32),
        justifyContent: 'center',
        paddingHorizontal: pixel(10),
    },
    toastText: {
        color: '#fff',
        fontSize: font(14),
    },
    loadingStatus: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        opacity: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
