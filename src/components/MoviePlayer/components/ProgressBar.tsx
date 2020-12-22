import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, StatusBar, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-device-orientation';
import { setFullscreenMode } from 'react-native-realfullscreen';
import { Iconfont } from '@src/components';
import { HomeIndicator } from '@src/native';
import { moment } from '@src/common';
import { observer } from 'mobx-react';
import playerStore from '../Store';

const CurrentTime = observer(() => {
    const fontSize = playerStore.fullscreen ? font(13) : font(12);
    const paddingLeft = playerStore.fullscreen ? pixel(10) : pixel(0);
    return (
        <Text style={[styles.timeText, { fontSize, paddingLeft }]}>
            {moment(playerStore.seeking ? playerStore.seekProgress : playerStore.progress)}
        </Text>
    );
});

const DurationTime = observer(() => {
    const fontSize = playerStore.fullscreen ? font(13) : font(12);
    const paddingRight = playerStore.fullscreen ? pixel(10) : pixel(0);
    return <Text style={[styles.timeText, { fontSize, paddingRight }]}>{moment(playerStore.duration)}</Text>;
});

export const SeekingProgress = observer(() => {
    if (!playerStore.sliding) {
        return null;
    }
    const fontSize1 = playerStore.fullscreen ? font(28) : font(20);
    const fontSize2 = playerStore.fullscreen ? font(20) : font(14);

    return (
        <View style={styles.seekingContainer}>
            <Text style={{ fontSize: fontSize1, color: Theme.primaryColor }}>
                {moment(playerStore.seeking ? playerStore.seekProgress : playerStore.progress)}
            </Text>
            <Text style={{ fontSize: fontSize2, color: '#ffffff' }}>/{moment(playerStore.duration)}</Text>
        </View>
    );
});

export default observer(({ playerRef, clearTimer, setTimer }) => {
    const onSliderValueChanged = useCallback((sliderValue) => {
        Log('onSliderValueChanged');
        if (clearTimer instanceof Function) {
            clearTimer();
        }
        playerStore.toggleSliding(true);
        playerStore.toggleSeeking(true);
        playerStore.setSeekProgress(sliderValue);
    }, []);
    const onSlidingComplete = useCallback((sliderValue) => {
        Log('onSlidingComplete');
        if (setTimer instanceof Function) {
            setTimer();
        }
        playerStore.toggleSliding(false);
        playerStore.setSeekProgress(sliderValue);
        playerStore.setProgress(sliderValue);
        playerRef.current?.seek(sliderValue);
    }, []);

    const setFullscreen = useCallback(() => {
        playerStore.toggleFullscreen(true);
        Orientation.unlockAllOrientations();
        StatusBar.setHidden(true, 'slide');
        HomeIndicator.setAutoHidden(true);
        setFullscreenMode(true);
        Orientation.lockToLandscapeLeft();
    }, []);

    return (
        <View style={styles.progressOperate}>
            {!playerStore.fullscreen && (
                <View style={styles.row}>
                    <Pressable
                        onPress={() => {
                            playerStore.togglePaused(!playerStore.paused);
                            if (setTimer instanceof Function) {
                                setTimer();
                            }
                        }}
                        style={styles.operateBtn}>
                        <Iconfont name={playerStore.paused ? 'bofang1' : 'zanting'} size={font(16)} color="#ffffffee" />
                    </Pressable>
                </View>
            )}
            <CurrentTime />
            <Slider
                disabled={playerStore.buffering}
                style={styles.slider}
                maximumTrackTintColor="#ffffffcc"
                minimumTrackTintColor={'#fff'}
                thumbTintColor="#fff"
                value={playerStore.seeking ? playerStore.seekProgress : playerStore.progress}
                minimumValue={0}
                maximumValue={Number(playerStore.duration)}
                onValueChange={onSliderValueChanged}
                onSlidingComplete={onSlidingComplete}
            />
            <DurationTime />
            {!playerStore.fullscreen && (
                <Pressable onPress={setFullscreen} style={styles.operateBtn}>
                    <Iconfont name={'quanping'} size={font(16)} color="#ffffffee" />
                </Pressable>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressOperate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slider: {
        flex: 1,
        ...Platform.select({
            ios: {
                marginHorizontal: pixel(10),
            },
            android: {},
        }),
    },
    operateBtn: {
        height: pixel(30),
        paddingHorizontal: pixel(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        color: '#fff',
        textShadowColor: '#00000055',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
    },
    seekingContainer: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000022',
    },
});
