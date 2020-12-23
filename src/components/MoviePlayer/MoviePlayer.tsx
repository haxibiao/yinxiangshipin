import React, { useState, useEffect, ReactChild } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import Notification from './components/Notification';
import validateSource from './helper/validateSource';
import { Player } from './Player';
import playerStore, { MovieScheme, MovieHistoryScheme } from './PlayerStore';

const portraitHeight = Dimensions.get('window').width * 0.58;
interface Props {
    children?: ReactChild; // placeholder
    movie: MovieScheme;
    history?: MovieHistoryScheme;
    onBeforeDestroy?: ({ index, progress }: { index: number; progress: number }) => void;
}

export const MoviePlayer = observer(({ children, movie, history, onBeforeDestroy }: Props) => {
    useEffect(() => {
        const data = movie?.data || [];
        const series_index = history?.series_index || 0;
        const episode = data?.[series_index] || {};
        episode.progress = history?.progress;
        playerStore.setSeries(data);
        playerStore.setCurrentEpisode(episode, Number(series_index));
    }, [movie, history]);

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
        return <View style={styles.portrait}>{children}</View>;
    }

    return (
        <Animated.View style={playerStore.fullscreen ? styles.landscape : styles.portrait}>
            <Notification />
            <Player />
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    portrait: {
        backgroundColor: '#010101',
        height: portraitHeight,
    },
    landscape: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#010101',
        zIndex: 999,
        padding: 0,
        margin: 0,
    },
});
