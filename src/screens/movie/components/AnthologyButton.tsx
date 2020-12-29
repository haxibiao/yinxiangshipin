import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Easing, ViewStyle, ColorValue } from 'react-native';
import __ from 'lodash';
import Theme from '@app/src/common/theme';

export default function AnthologyButton({
    active,
    content,
    onPress,
}: {
    active: boolean;
    content: string;
    onPress: (i: any) => void;
}) {
    return (
        <Pressable onPress={onPress} style={styles.button}>
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
                        }),
                        Animated.timing(value, {
                            toValue: 0.3,
                            duration: duration * 0.5,
                            easing: Easing.linear,
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
                                height: value.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
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
        marginRight: pixel(5),
        minWidth: pixel(50),
        height: pixel(50),
        paddingHorizontal: pixel(10),
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
    },
    lineItemWrap: {
        width: pixel(3),
        alignSelf: 'stretch',
        marginRight: pixel(3),
    },
    lineItem: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: pixel(2),
        backgroundColor: Theme.primaryColor,
        // backgroundColor: '#37B7FB',
    },
});
