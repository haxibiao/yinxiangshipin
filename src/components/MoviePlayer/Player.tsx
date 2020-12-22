import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, StatusBar } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-device-orientation';
import { observer } from 'mobx-react';
import playerStore from './Store';
import useSafeArea from './helper/useSafeArea';
import Controller from './components/Controller';
import VideoRateChooser from './components/VideoRateChooser';
import EpisodeChooser from './components/EpisodeChooser';
import LockOverlay from './components/LockOverlay';

interface Props {
    destroy?: (progress: number) => void;
}

export const Player = observer((props: Props) => {
    const safeInset = useSafeArea({ fullscreen: playerStore.fullscreen });

    const playerRef = useRef();
    const progressInBufferingRef = useRef(0);
    // const bufferingTimerRef = useRef(0);

    const _onError = (e) => {
        if (e.error) {
            Log('_onError', e.error);
            playerStore.toggleBuffering(false);
            playerStore.toggleError(true);
        }
    };

    const _onBuffer = (e) => {
        Log('e.isBuffering', e.isBuffering, playerStore.seeking);
        if (!(playerStore.seeking && !e.isBuffering)) {
            playerStore.toggleBuffering(e.isBuffering);
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
        if (playerStore.seeking && playerStore.buffering && ++progressInBufferingRef.current > 4) {
            progressInBufferingRef.current = 0;
            playerStore.toggleBuffering(false);
        }
        if (playerStore.error) {
            playerStore.toggleError(false);
        }
    };

    const _onLoad = (e) => {
        Log('_onLoad');
        playerStore.setDuration(e.duration);
        playerStore.toggleLoaded(true);
    };

    const _onEnd = () => {
        if (playerStore.currentEpisodeIndex < playerStore.series.length - 1) {
            playerStore.setCurrentEpisode(playerStore.series[playerStore.currentEpisodeIndex + 1]);
        }
    };

    useEffect(() => {
        return () => {
            if (props.onBeDestroy instanceof Function) {
                props.onBeDestroy();
            }
        };
    }, [props.onBeDestroy]);

    useEffect(() => {
        // TODO:监听用户主动更改手机屏幕方向，设置全屏播放（但是addOrientationListener无效）
        // let delayUnlockAllOrientations;
        // const _orientationDidChange = (orientation) => {
        //     console.log('====================================');
        //     console.log('orientation', orientation);
        //     console.log('====================================');
        //     if (orientation === 'LANDSCAPE' && !playerStore.fullscreen) {
        //         playerStore.toggleFullscreen(true);
        //         setFullscreenMode(true);
        //         HomeIndicator.setAutoHidden(true);
        //         StatusBar.setHidden(true, 'slide');
        //         Orientation.lockToLandscapeLeft();
        //         delayUnlockAllOrientations = setTimeout(() => {
        //             Orientation.unlockAllOrientations();
        //         }, 0);
        //     } else if (orientation === 'PORTRAIT' && playerStore.fullscreen) {
        //         playerStore.toggleFullscreen(false);
        //         setFullscreenMode(false);
        //         HomeIndicator.setAutoHidden(false);
        //         StatusBar.setHidden(false, 'slide');
        //         Orientation.lockToPortrait();
        //         delayUnlockAllOrientations = setTimeout(() => {
        //             Orientation.unlockAllOrientations();
        //         }, 0);
        //     }
        // };
        // Orientation.addOrientationListener(_orientationDidChange);
        return () => {
            Orientation.lockToPortrait();
        };
    }, []);

    return (
        <View style={styles.videoWrap}>
            <Video
                ref={playerRef}
                style={[styles.absoluteVideo, { marginRight: safeInset }]}
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
        ...StyleSheet.absoluteFill,
        zIndex: 2,
    },
});
