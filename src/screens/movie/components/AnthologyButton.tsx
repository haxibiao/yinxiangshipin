import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Easing, ViewStyle, ColorValue } from 'react-native';
import __ from 'lodash';

const EPISODE_WIDTH = (Device.width - pixel(66)) / 6;

export default function AnthologyButton({
    style,
    active,
    content,
    onPress,
}: {
    style?: ViewStyle;
    active: boolean;
    content: string;
    onPress: (i: any) => void;
}) {
    return (
        <Pressable onPress={onPress} style={[styles.button, style]}>
            {active ? <LiveAnimation style={{ height: pixel(18) }} /> : <Text style={styles.content}>{content}</Text>}
        </Pressable>
    );
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

interface Props {
    number?: number;
    duration?: number;
    style?: ViewStyle;
}

function LiveAnimation({ number = 3, duration = 800, style }) {
    const values = useRef(
        Array(number)
            .fill(1)
            .map(() => new Animated.Value(getRandomArbitrary(0.2, 0.6))),
    ).current;

    const startAnimation = useCallback(() => {
        Animated.loop(
            Animated.parallel(
                values.map((value) =>
                    Animated.sequence([
                        Animated.timing(value, {
                            toValue: 1,
                            duration: duration * (1 - value._value),
                            easing: Easing.linear,
                            useNativeDriver: true,
                        }),
                        Animated.timing(value, {
                            toValue: 0.3,
                            duration: duration * 0.5,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        }),
                    ]),
                ),
            ),
        ).start();
    }, []);

    useEffect(() => {
        startAnimation();
    }, []);

    return (
        <View style={[styles.liveContainer, style]}>
            {values.map((value, index) => (
                <View style={styles.lineItemWrap}>
                    <Animated.View
                        key={index}
                        style={[
                            styles.lineItem,
                            {
                                transform: [
                                    {
                                        scaleY: value.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: pixel(6),
        minWidth: EPISODE_WIDTH,
        height: EPISODE_WIDTH,
        paddingHorizontal: pixel(8),
        borderRadius: pixel(5),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F5F9',
    },
    content: {
        fontSize: font(16),
        lineHeight: font(18),
        fontWeight: 'bold',
        color: '#202020',
    },
    liveContainer: {
        flexDirection: 'row',
        marginRight: -pixel(3),
    },
    lineItemWrap: {
        width: pixel(3),
        alignSelf: 'stretch',
        marginRight: pixel(3),
        overflow: 'hidden',
        borderRadius: pixel(2),
    },
    lineItem: {
        position: 'absolute',
        bottom: '-100%',
        width: '100%',
        height: '200%',
        borderRadius: pixel(2),
        backgroundColor: Theme.primaryColor,
        // backgroundColor: '#37B7FB',
    },
});
