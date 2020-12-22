import React, { useRef } from 'react';
import { StyleSheet, View, Text, Animated, ColorValue, ViewStyle } from 'react-native';
import { SvgIcon, SvgPath } from '@src/components';
import Theme from '@app/src/common/theme';

interface Props {
    value: Animated.AnimatedValue;
    color?: ColorValue;
}

function Indicator({ value, color = Theme.primaryColor }: Props) {
    const animationStyle = {
        width: value.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
        }),
    };
    return <Animated.View style={[animationStyle, { height: '100%', backgroundColor: color }]} />;
}

interface SettingProps extends Props {
    visible: boolean;
}

export function VolumeIndicator({ visible, value, color }: SettingProps) {
    if (!visible) {
        return null;
    }
    return (
        <View style={styles.systemSettingContainer}>
            <View style={styles.slider}>
                <SvgIcon name={SvgPath.volume} size={20} color={'#FFFFFFDD'} />
                <View style={[styles.trackTint, { marginLeft: pixel(15) }]}>
                    <Indicator value={value} color={color} />
                </View>
            </View>
        </View>
    );
}

export function BrightnessIndicator({ visible, value, color }: SettingProps) {
    if (!visible) {
        return null;
    }
    return (
        <View style={styles.systemSettingContainer}>
            <View style={styles.slider}>
                <SvgIcon name={SvgPath.brightness} size={20} color={'#FFFFFFDD'} />
                <View style={[styles.trackTint, { marginLeft: pixel(15) }]}>
                    <Indicator value={value} color={color} />
                </View>
            </View>
        </View>
    );
}

interface TrackIndicatorProps extends Props {
    style: ViewStyle;
}

export function TrackIndicator({ value, color = Theme.primaryColor, style }: TrackIndicatorProps) {
    const animationValue = useRef(new Animated.Value(value));
    animationValue.current.setValue(value);
    const animationStyle = {
        width: animationValue.current.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
        }),
    };

    return (
        <View style={[styles.trackTint, style]}>
            <Animated.View style={[animationStyle, { height: '100%', backgroundColor: color }]} />
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
        borderRadius: pixel(1),
        overflow: 'hidden',
        backgroundColor: '#FFFFFF55',
    },
});
