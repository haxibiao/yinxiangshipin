import React, { useState, useEffect, ReactChild } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import Notification from './components/Notification';
import validateSource from './helper/validateSource';
import { Player } from './Player';
import playerStore, { MovieScheme } from './PlayerStore';

const portraitHeight = Dimensions.get('window').width * 0.58;
interface Props {
    style?: ViewStyle;
    children?: ReactChild; // placeholder
    movie: MovieScheme;
    onBeforeDestroy?: ({ index, progress }: { index: number; progress: number }) => void;
}

export const MoviePlayer = observer(({ style, children, movie, onBeforeDestroy }: Props) => {
    useEffect(() => {
        const data = movie?.data || [];
        const series_index = movie?.series_index || 0;
        const episode = data?.[series_index] || {};
        episode.progress = movie?.progress;
        playerStore.setSeries(data);
        playerStore.setCurrentEpisode(episode, Number(series_index));
    }, [movie, movie]);

    useEffect(() => {
        return () => {
            if (onBeforeDestroy instanceof Function) {
                onBeforeDestroy({ index: playerStore.currentEpisodeIndex, progress: playerStore.progress });
            }
            playerStore.resetVideoState();
            playerStore.resetMovieData();
        };
    }, []);

    if (!movie) {
        return <View style={[styles.portrait, { backgroundColor: '#f0f0f0' }, style]}>{children}</View>;
    }

    return (
        <Animated.View style={[styles.container, playerStore.fullscreen ? styles.fullscreenMode : style]}>
            <View style={playerStore.fullscreen ? styles.landscape : styles.portrait}>
                <Notification />
                <Player />
            </View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#010101',
    },
    fullscreenMode: {
        ...StyleSheet.absoluteFill,
        zIndex: 999,
        padding: 0,
        margin: 0,
    },
    portrait: {
        height: portraitHeight,
        zIndex: 999,
    },
    landscape: {
        ...StyleSheet.absoluteFill,
    },
});
