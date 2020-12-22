import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions, InteractionManager } from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Orientation from 'react-native-device-orientation';
import { SvgIcon, SvgPath } from '@src/components';
import { observer } from 'mobx-react';
import playerStore from '../Store';
import useSafeArea from '../helper/useSafeArea';
import DisplayContainer from './DisplayContainer';
import { TrackIndicator } from './SystemSettingIndicator';

const VISIBLE_DURATION = 4000;
const FADE_VALUE = Dimensions.get('window').width * 0.25;

export default observer(() => {
    return (
        <DisplayContainer visible={playerStore.loaded && playerStore.locked}>
            <LockOverlay />
        </DisplayContainer>
    );
});

export const LockOverlay = observer(() => {
    const safeInset = useSafeArea({ fullscreen: playerStore.fullscreen });
    const [operateVisible, setOperateVisible] = useState(true);
    const timerToOperate = useRef();
    const clearTimerToOperate = useCallback(() => {
        if (timerToOperate.current) {
            clearTimeout(timerToOperate.current);
        }
    }, []);
    const operateAnimation = useRef(new Animated.Value(1));
    const operateOpacity = operateAnimation.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    // 控制器动画
    const runOperateAnimation = useCallback((toValue: 0 | 1) => {
        clearTimerToOperate();
        Animated.timing(operateAnimation.current, {
            toValue,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => null);
    }, []);
    // 控制器计时器
    const setTimerToOperate = useCallback(() => {
        clearTimerToOperate();
        timerToOperate.current = setTimeout(() => {
            setOperateVisible(false);
            runOperateAnimation(0);
        }, VISIBLE_DURATION);
    }, []);
    // 控制器显示/隐藏
    const toggleOperateVisible = useCallback(() => {
        setOperateVisible((v) => {
            if (!v) {
                runOperateAnimation(1);
                setTimerToOperate();
            } else {
                runOperateAnimation(0);
            }
            return !v;
        });
    }, []);
    // 清除定时器
    useEffect(() => {
        return () => {
            clearTimerToOperate();
        };
    }, []);

    const unlockPressHandlerRef = useRef();
    const onTogglePress = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            InteractionManager.runAfterInteractions(() => {
                toggleOperateVisible(1);
            });
        }
    }, []);

    const onUnlockPress = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            InteractionManager.runAfterInteractions(() => {
                // 这会触发controller中的useEffect
                playerStore.toggleLocked(false);
            });
        }
    }, []);

    return (
        <TapGestureHandler waitFor={unlockPressHandlerRef} onHandlerStateChange={onTogglePress}>
            <View style={styles.container}>
                <Animated.View
                    style={[styles.sideBar, { paddingRight: safeInset + pixel(30), opacity: operateOpacity }]}>
                    <TapGestureHandler
                        enabled={operateVisible}
                        ref={unlockPressHandlerRef}
                        onHandlerStateChange={onUnlockPress}>
                        <View style={styles.operateBtn}>
                            <SvgIcon name={SvgPath.lock} size={22} color={'#FFFFFFDD'} />
                        </View>
                    </TapGestureHandler>
                </Animated.View>
                <Animated.View style={[styles.progressContainer, { opacity: operateOpacity }]}>
                    <TrackIndicator
                        style={{ width: '100%' }}
                        value={(playerStore.seekProgress / playerStore.duration) * 100}
                    />
                </Animated.View>
            </View>
        </TapGestureHandler>
    );
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        zIndex: 10,
        backgroundColor: '#00000022',
    },
    sideBar: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    operateBtn: {
        width: pixel(40),
        minHeight: pixel(40),
        borderRadius: pixel(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000044',
    },
    progressContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
});
