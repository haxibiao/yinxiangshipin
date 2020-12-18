import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, StatusBar } from 'react-native';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation';
import { Iconfont } from '@src/components';
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

export default observer(({ playerRef, clearTimer, setTimer }) => {
    const onSliderValueChanged = useCallback((sliderValue) => {
        if (clearTimer instanceof Function) {
            clearTimer();
        }
        playerStore.toggleSeeking(true);
        playerStore.setSeekProgress(sliderValue);
    }, []);
    const onSlidingComplete = useCallback((sliderValue) => {
        if (setTimer instanceof Function) {
            setTimer();
        }
        playerStore.toggleSeeking(false);
        playerStore.setSeekProgress(sliderValue);
        playerStore.setProgress(sliderValue);
        playerRef.current?.seek(sliderValue);
    }, []);

    const setFullscreen = useCallback(() => {
        playerStore.toggleFullscreen(true);
        Orientation.unlockAllOrientations();
        StatusBar.setHidden(true, 'slide');
        Orientation.lockToLandscape();
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
                style={{ flex: 1 }}
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
});
