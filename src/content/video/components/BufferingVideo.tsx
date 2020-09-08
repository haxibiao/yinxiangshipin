import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { useCirculationAnimation } from '@src/common';

const VideoLoading = ({ loading }) => {
    if (!loading) {
        return null;
    }
    const animation = useCirculationAnimation({ duration: 400, start: true });

    const scale = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 110],
    });
    return <Animated.View style={[styles.loading, { transform: [{ scaleX: scale }] }]} />;
};
const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        bottom: 0,
        left: '49%',
        height: pixel(1),
        borderRadius: pixel(1),
        width: '1%',
        backgroundColor: 'transparent',
    },
});

export default VideoLoading;
