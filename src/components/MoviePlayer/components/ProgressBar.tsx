import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, StatusBar, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-device-orientation';
import { setFullscreenMode } from 'react-native-realfullscreen';
import { Iconfont } from '@src/components';
import { HomeIndicator } from '@src/native';
import { moment } from '@src/common';
import { observer } from 'mobx-react';
import { TrackIndicator } from './SystemSettingIndicator';
import playerStore from '../PlayerStore';

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
            <View style={styles.timeContainer}>
                <Text style={{ fontSize: fontSize1, color: Theme.primaryColor }}>
                    {moment(playerStore.seeking ? playerStore.seekProgress : playerStore.progress)}
                </Text>
                <Text style={{ fontSize: fontSize2, color: '#ffffff' }}>/{moment(playerStore.duration)}</Text>
            </View>
            {!playerStore.controllerBarVisible && (
                <TrackIndicator
                    style={{ width: pixel(120) }}
                    value={(playerStore.seekProgress / playerStore.duration) * 100}
                />
            )}
        </View>
    );
});

export default observer(({ playerRef, onTouchMove, onTouchEnd }) => {
    const onSliderValueChanged = useCallback((sliderValue) => {
        if (onTouchMove instanceof Function) {
            onTouchMove();
        }
        playerStore.toggleSliding(true);
        playerStore.toggleSeeking(true);
        playerStore.setSeekProgress(sliderValue);
    }, []);
    const onSlidingComplete = useCallback((sliderValue) => {
        if (onTouchEnd instanceof Function) {
            onTouchEnd();
        }
        playerStore.toggleSliding(false);
        playerStore.setSeekProgress(sliderValue);
        playerStore.setProgress(sliderValue);
        playerRef.current?.seek(sliderValue);
    }, []);

    const lockToLandscapeHandler = useCallback(() => {
        playerStore.toggleFullscreen(true);
        StatusBar.setHidden(true, 'slide');
        if (Platform.OS === 'ios') {
            HomeIndicator.setAutoHidden(true);
            Orientation.lockToLandscapeRight();
        } else {
            setFullscreenMode(true);
            Orientation.lockToLandscapeLeft();
        }
    }, []);

    return (
        <View style={styles.progressOperate}>
            {!playerStore.fullscreen && (
                <View style={styles.row}>
                    <Pressable
                        onPress={() => {
                            playerStore.togglePaused(!playerStore.paused);
                            if (onTouchEnd instanceof Function) {
                                onTouchEnd();
                            }
                        }}
                        style={styles.operateBtn}>
                        <Iconfont name={playerStore.paused ? 'bofang1' : 'zanting'} size={font(16)} color="#ffffffee" />
                    </Pressable>
                </View>
            )}
            <CurrentTime />
            <Slider
                style={styles.slider}
                maximumTrackTintColor="#ffffffcc"
                minimumTrackTintColor={Theme.primaryColor}
                thumbTintColor="#fff"
                value={playerStore.seeking ? playerStore.seekProgress : playerStore.progress}
                minimumValue={0}
                maximumValue={Number(playerStore.duration)}
                onValueChange={onSliderValueChanged}
                onSlidingComplete={onSlidingComplete}
                thumbImage={require('@app/assets/images/movie/ic_player_thumb.png')}
            />
            <DurationTime />
            {!playerStore.fullscreen && (
                <Pressable onPress={lockToLandscapeHandler} style={styles.operateBtn}>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000022',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: pixel(10),
    },
});
