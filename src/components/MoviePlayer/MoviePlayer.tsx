import React, { ReactChildren, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import Exception from './components/Exception';
import Error from './components/Error';
import Loading from './components/Loading';
import Notification from './components/Notification';
import playerStore, { EpisodeData } from './Store';
import { Player } from './Player';

const portraitHeight = Dimensions.get('window').width * 0.58;
const VIDEO_FORMATS = ['mp3', 'mp4', 'avi', 'mov', 'rmvb', 'm3u8'];
function getFormatFromSource(str) {
    if (!str) return;
    let index = str.lastIndexOf('.');
    str = str.substring(index + 1, str.length);
    return String(str).toLowerCase();
}

interface Props {
    children: ReactChildren;
    source: EpisodeData;
    series?: EpisodeData[];
    progress?: number;
    error?: boolean;
}

export const MoviePlayer = observer(({ children, source, series }: Props) => {
    const isError = !source?.url || !VIDEO_FORMATS.includes(getFormatFromSource(source?.url));

    useEffect(() => {
        if (source?.url) {
            playerStore.setCurrentEpisode(source);
        }
    }, [source]);

    useEffect(() => {
        if (series?.length > 0) {
            playerStore.setSeries(series);
        }
    }, [series]);

    return (
        <Animated.View style={playerStore.fullscreen ? styles.landscape : styles.portrait}>
            {isError ? (
                <Exception />
            ) : (
                <>
                    <Notification />
                    <Player />
                    <Loading />
                    <Error />
                </>
            )}
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
