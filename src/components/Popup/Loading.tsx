/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from 'react-native';
import SafeText from '../Basic/SafeText';
import { Overlay } from 'teaset';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

let OverlayKey: any = null;

export const show = (content?: any) => {
    const overlayView = (
        <Overlay.View animated>
            <View style={styles.container}>
                <View style={styles.uploading}>
                    <View style={styles.body}>
                        <ActivityIndicator color="#fff" size={'small'} />
                        <SafeText style={styles.text}>{content || `loading...`}</SafeText>
                    </View>
                </View>
            </View>
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};

export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploading: {
        // backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        width: SCREEN_WIDTH / 4,
        height: SCREEN_WIDTH / 4,
        padding: pixel(10),
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    text: {
        fontSize: font(13),
        color: '#FFF',
        textAlign: 'center',
        paddingTop: pixel(8),
    },
});

export default { show, hide };
