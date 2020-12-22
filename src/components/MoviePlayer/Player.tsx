import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, BackHandler } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-device-orientation';
import { observer } from 'mobx-react';
import { useStatusBarHeight } from '@src/common';
import playerStore from './Store';
import Controller from './components/Controller';
import VideoRateChooser from './components/VideoRateChooser';
import EpisodeChooser from './components/EpisodeChooser';

interface Props {
    destroy?: (progress: number) => void;
}

export const Player = observer((props: Props) => {
    let safeInset = useStatusBarHeight();
    if (!Device.Android || !Device.isFullScreenDevice || !playerStore.fullscreen) {
        safeInset = 0;
    }

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
            Log('progressInBufferingRef');
            progressInBufferingRef.current = 0;
            playerStore.toggleBuffering(false);
        }
    };

    const _onLoad = (e) => {
        Log('_onLoad');
        playerStore.setDuration(e.duration);
        playerStore.toggleLoaded(true);
    };

    const _onEnd = () => {};

    useEffect(() => {
        return () => {
            if (props.onBeDestroy instanceof Function) {
                props.onBeDestroy();
            }
        };
    }, [props.onBeDestroy]);

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
                <Controller playerRef={playerRef} safeInset={safeInset} />
                <VideoRateChooser />
                <EpisodeChooser />
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
