import React from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { SvgIcon, SvgPath } from '@src/components';

interface Props {
    visible: boolean;
    value: Animated.AnimatedValue;
}

export function VolumeIndicator({ visible, value }: Props) {
    if (!visible) {
        return null;
    }
    const animationStyle = {
        width: value.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
        }),
    };
    return (
        <View style={styles.systemSettingContainer}>
            <View style={styles.slider}>
                <SvgIcon name={SvgPath.volume} size={20} color={'#FFFFFFDD'} />
                <View style={styles.trackTint}>
                    <Animated.View style={[animationStyle, styles.trackActive]} />
                </View>
            </View>
        </View>
    );
}

export function BrightnessIndicator({ visible, value }: Props) {
    if (!visible) {
        return null;
    }
    const animationStyle = {
        width: value.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
        }),
    };
    return (
        <View style={styles.systemSettingContainer}>
            <View style={styles.slider}>
                <SvgIcon name={SvgPath.brightness} size={20} color={'#FFFFFFDD'} />
                <View style={styles.trackTint}>
                    <Animated.View style={[animationStyle, styles.trackActive]} />
                </View>
            </View>
        </View>
    );
}

// 380 60
const styles = StyleSheet.create({
    systemSettingContainer: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000022',
    },
    slider: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00000077',
        height: pixel(34),
        paddingHorizontal: pixel(16),
        borderRadius: pixel(17),
    },
    trackTint: {
        width: pixel(100),
        height: pixel(2),
        marginLeft: pixel(15),
        borderRadius: pixel(1),
        overflow: 'hidden',
        backgroundColor: '#FFFFFF55',
    },
    trackActive: {
        height: '100%',
        backgroundColor: Theme.primaryColor,
    },
});
