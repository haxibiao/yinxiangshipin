import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, StatusBar } from 'react-native';
import Video from 'react-native-video';
import { observer } from 'mobx-react';
import playerStore, { EpisodeScheme } from './PlayerStore';
import useSafeArea from './helper/useSafeArea';
import VideoStatus from './components/VideoStatus';
import Exception from './components/Exception';
import Controller from './components/Controller';
import VideoRateChooser from './components/VideoRateChooser';
import EpisodeChooser from './components/EpisodeChooser';
import LockOverlay from './components/LockOverlay';
import DisplayContainer from './components/DisplayContainer';

export const Player = observer(() => {
    const safeInset = useSafeArea({ fullscreen: playerStore.fullscreen });
    const playerRef = useRef();
    const progressInBufferingRef = useRef(0);
    const errorTimerRef = useRef(0);

    const delayToggleError = useCallback(() => {
        clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => {
            playerStore.toggleBuffering(false);
            playerStore.toggleError(true);
        }, 3000);
    }, []);

    const _onError = (e) => {
        if (e.error) {
            Log('_onError', e.error);
            if (playerStore.progress >= 3) {
                delayToggleError();
            } else {
                playerStore.toggleBuffering(false);
                playerStore.toggleError(true);
            }
        }
    };

    const _onBuffer = (e) => {
        Log('e.isBuffering', e.isBuffering, playerStore.seeking);
        // 排除正在seeking buffering中
        if (!(playerStore.seeking && playerStore.buffering)) {
            playerStore.toggleBuffering(e.isBuffering);
        }
        if (playerStore.error) {
            playerStore.toggleError(false);
        }
        // if(e.isBuffering){
        //     clearTimeout(bufferingTimerRef.current)
        //     bufferingTimerRef.current = setTimeout(() => {
        //         playerStore.toggleBuffering(true);
        //     }, 1000);
        // }
    };

    const _onSeek = () => {
        Log('_onSeek');
        playerStore.toggleSeeking(false);
    };

    const _onProgress = (e) => {
        playerStore.setProgress(e.currentTime);
        // 处理已经在播放中了,但是buffering状态没有改变
        if (playerStore.buffering && ++progressInBufferingRef.current > 4) {
            progressInBufferingRef.current = 0;
            playerStore.toggleBuffering(false);
        }
        // 播放出错，但又恢复正常
        if (playerStore.error) {
            playerStore.toggleError(false);
        }
        // 正在播放中视频出错了，但又恢复正常，清除可能存在的延迟报错定时器
        if (errorTimerRef.current) {
            clearTimeout(errorTimerRef.current);
        }
    };

    const _onLoad = (e) => {
        Log('_onLoad');
        playerStore.setDuration(e.duration);
        playerStore.toggleLoaded(true);
        if (playerStore.currentEpisode?.progress && playerStore.currentEpisode?.progress >= 10) {
            playerStore.sendNotice({ content: '为您定位到上次观看位置', orientation: 'left' });
            const progress = Math.floor(Number(playerStore.currentEpisode?.progress));
            playerStore.setProgress(progress);
            playerRef.current?.seek(progress);
        }
    };

    const _onEnd = () => {
        if (playerStore.currentEpisodeIndex < playerStore.series.length - 1) {
            playerStore.nextEpisode();
        }
    };

    return (
        <View style={styles.videoWrap}>
            <DisplayContainer visible={playerStore.currentEpisode.url && !playerStore.sourceException}>
                <Video
                    ref={playerRef}
                    style={[
                        styles.absoluteVideo,
                        playerStore.resizeMode === 'contain' && { marginHorizontal: safeInset },
                    ]}
                    source={{ uri: playerStore.currentEpisode.url }}
                    rate={playerStore.rate}
                    paused={playerStore.paused}
                    resizeMode={playerStore.resizeMode}
                    onError={_onError}
                    onBuffer={_onBuffer}
                    onSeek={_onSeek}
                    onProgress={_onProgress}
                    onLoad={_onLoad}
                    onEnd={_onEnd}
                />
            </DisplayContainer>
            <VideoStatus />
            <View style={styles.controllerWrap}>
                <Controller playerRef={playerRef} />
                <VideoRateChooser />
                <EpisodeChooser />
                <LockOverlay />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    videoWrap: {
        ...StyleSheet.absoluteFillObject,
    },
    absoluteVideo: {
        ...StyleSheet.absoluteFillObject,
    },
    controllerWrap: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
});
