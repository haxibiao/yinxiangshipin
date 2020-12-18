import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, BackHandler } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
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

    const _onError = (e) => {
        if (e.error) {
            Log('_onError');
            playerStore.toggleBuffering(false);
            playerStore.toggleError(true);
        }
    };

    const _onBuffer = (e) => {
        Log('e.isBuffering', e.isBuffering);
        playerStore.toggleBuffering(e.isBuffering);
    };

    const _onSeek = () => {
        Log('_onSeek');
    };

    const _onProgress = (e) => {
        playerStore.setProgress(e.currentTime);
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
