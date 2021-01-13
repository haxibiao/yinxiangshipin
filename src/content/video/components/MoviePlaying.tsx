import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, Animated, Easing } from 'react-native';

const TEXT = '播放电影';
const width = pixel(30);
const height = pixel(70);
export default function DanceText({ movie, viewable }) {
    const values = useRef(
        Array(TEXT.length)
            .fill(1)
            .map(() => new Animated.Value(0)),
    ).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    const startImageAnimation = useCallback(() => {
        Animated.loop(
            Animated.timing(rotateAnimation, {
                toValue: 1,
                duration: 8000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    const startTextAnimation = useCallback(() => {
        Animated.stagger(
            1800,
            values.map((value) => {
                value.setValue(0);
                return Animated.timing(value, {
                    toValue: 1,
                    duration: 3600,
                    easing: Easing.linear,
                    useNativeDriver: true,
                });
            }),
        ).start((e) => {
            if (e.finished) {
                startTextAnimation();
            }
        });
    }, []);

    useEffect(() => {
        if (viewable) {
            startImageAnimation();
            startTextAnimation();
        }
        return () => {
            rotateAnimation.setValue(0);
            rotateAnimation.stopAnimation();
        };
    }, [viewable]);

    const rotate = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const animationStyle = useCallback((value, index) => {
        return {
            opacity: value.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0.4, 0.8, 0],
            }),
            transform: [
                {
                    translateY: value.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -height],
                    }),
                },
                {
                    translateX: value.interpolate({
                        inputRange: [0, 0.4, 0.6, 1],
                        outputRange: [0, -width * 0.9, -width, -width * 0.8],
                    }),
                },
                {
                    rotate: value.interpolate({
                        inputRange: [0, 1],
                        outputRange: [`${index * 5}deg`, `${80 - index * 5}deg`],
                    }),
                },
            ],
        };
    }, []);

    return (
        <View>
            {viewable && (
                <View style={styles.textWrap}>
                    {values.map((value, index) => (
                        <Animated.View key={index} style={[styles.textItem, animationStyle(value, index)]}>
                            <Text style={styles.text}>{TEXT[index]}</Text>
                        </Animated.View>
                    ))}
                </View>
            )}
            <Animated.View style={{ transform: [{ rotate }] }}>
                <ImageBackground
                    source={require('@app/assets/images/movie/playing_film.png')}
                    style={styles.playingImage}>
                    <Image source={{ uri: movie?.cover }} style={styles.movieCover} />
                </ImageBackground>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    playingImage: {
        height: pixel(48),
        width: pixel(48),
        alignItems: 'center',
        justifyContent: 'center',
    },
    movieCover: {
        height: pixel(28),
        width: pixel(28),
        borderRadius: pixel(15),
    },
    textWrap: {
        ...StyleSheet.absoluteFillObject,
        left: pixel(5),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textItem: {
        position: 'absolute',
        left: 0,
    },
    text: {
        fontSize: font(14),
        color: '#fff',
    },
});
