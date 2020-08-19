import React from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MediaItem({ media, ...params }) {
    const navigation = useNavigation();
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('VideoList', { media, ...params })}>
            <Image style={styles.videoCover} source={{ uri: media?.video?.cover }} />
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    videoCover: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
    },
});
