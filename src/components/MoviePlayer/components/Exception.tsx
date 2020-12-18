import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { observer } from 'mobx-react';
import playerStore from '../Store';

export default observer(() => {
    const fontSize = playerStore.fullscreen ? font(15) : font(13);

    return (
        <View style={styles.container}>
            <Text style={[styles.tipsText, { fontSize }]}>视频资源出错，请切换其它视频</Text>
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
