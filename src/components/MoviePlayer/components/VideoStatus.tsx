import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import playerStore from '../PlayerStore';

export default observer(({ style }) => {
    const fontSize = playerStore.fullscreen ? font(15) : font(13);

    if (playerStore.sourceException) {
        return (
            <View style={[styles.container, style]}>
                <Text style={[styles.tipsText, { fontSize, marginBottom: pixel(10) }]}>o(╥﹏╥)o</Text>
                <Text style={[styles.tipsText, { fontSize }]}>视频资源出错，请观看其它视频</Text>
            </View>
        );
    }

    if (!playerStore.loaded) {
        return (
            <View style={[styles.container, style]}>
                <Text style={[styles.tipsText, { marginBottom: -pixel(10), fontSize }]}>即将播放</Text>
                <LottieView source={require('@app/assets/json/loading.json')} style={{ width: '30%' }} loop autoPlay />
            </View>
        );
    }

    if (playerStore.error) {
        return (
            <View style={[styles.container, style]}>
                <Text style={[styles.tipsText, { fontSize }]}>播放出错</Text>
            </View>
        );
    }

    return null;
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B1724',
    },
    tipsText: {
        color: '#778089',
    },
});
