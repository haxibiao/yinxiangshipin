import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import playerStore from '../Store';

export default observer(() => {
    const fontSize = playerStore.fullscreen ? font(15) : font(13);
    if (playerStore.loaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Text style={[styles.tipsText, { fontSize }]}>即将播放</Text>
            <LottieView source={require('@app/assets/json/loading.json')} style={{ width: '30%' }} loop autoPlay />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B1724',
    },
    tipsText: {
        marginBottom: -pixel(10),
        color: '#778089',
    },
});
