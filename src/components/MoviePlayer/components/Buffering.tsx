import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import playerStore from '../Store';

export default observer(() => {
    const fontSize = playerStore.fullscreen ? font(15) : font(13);
    if (!playerStore.loaded || !playerStore.buffering) {
        return null;
    }
    return (
        <View style={styles.container}>
            <LottieView source={require('@app/assets/json/loading.json')} style={{ width: '30%' }} loop autoPlay />
            <Text style={[styles.tipsText, { fontSize }]}>全力加载中...</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000022',
    },
    tipsText: {
        marginTop: -pixel(10),
        color: '#ffffff',
    },
});
