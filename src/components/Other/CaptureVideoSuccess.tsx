import React, { Component, useMemo } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import PlaceholderImage from '../Basic/PlaceholderImage';

// interface Props {
//     earnings: number;
// }

const CaptureVideoSuccess = props => {
    const { video } = props;

    return useMemo(
        () => (
            <View style={styles.overlayWrap}>
                <ImageBackground
                    style={styles.overlayImage}
                    source={require('@app/assets/images/capture_video_cover.png')}>
                    <View style={styles.overlayContent}>
                        <Text style={styles.title}>上传成功</Text>
                        <PlaceholderImage source={video.cover} style={styles.videoCover} videoMark={true} />
                        <Text style={styles.body}>{video.body}</Text>
                        <TouchableOpacity style={styles.button} onPress={props.onPress}>
                            <Text style={styles.buttonText}>立即查看</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        ),
        [video],
    );
};

const OVERLAY_WIDTH = percent(72);
const OVERLAY_HEIGHT = (OVERLAY_WIDTH * 1450) / 1040;

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: Theme.secondaryColor,
        borderRadius: OVERLAY_WIDTH * 0.7,
        height: OVERLAY_WIDTH * 0.15,
        justifyContent: 'center',
        width: OVERLAY_WIDTH * 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: font(16),
    },
    overlayContent: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: pixel(Theme.itemSpace),
    },
    videoCover: {
        width: OVERLAY_WIDTH * 0.5,
        height: OVERLAY_WIDTH * 0.7,
    },
    overlayWrap: {
        backgroundColor: '#fff',
        borderRadius: pixel(5),
    },
    overlayImage: {
        height: OVERLAY_HEIGHT,
        width: OVERLAY_WIDTH,
    },
    body: {
        color: Theme.defaultTextColor,
        fontSize: font(14),
        marginVertical: pixel(Theme.itemSpace),
    },
    title: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        fontWeight: 'bold',
        marginVertical: pixel(Theme.itemSpace),
    },
});

export default CaptureVideoSuccess;
