import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { observer } from 'mobx-react';
import playerStore from '../Store';

export default observer(() => {
    const fontSize = playerStore.fullscreen ? font(15) : font(13);
    if (!playerStore.error) {
        return null;
    }
    return (
        <View style={styles.container}>
            <Text style={[styles.tipsText, { fontSize }]}>播放出错</Text>
        </View>
    );
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
