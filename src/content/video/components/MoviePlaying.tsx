import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, Animated, Easing } from 'react-native';

const TEXT = '立即观看';
const IMAGE_HEIGHT = pixel(48);
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
                duration: 6000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    const startTextAnimation = useCallback(() => {
        Animated.stagger(
            800,
            values.map((value) => {
                value.setValue(0);
                return Animated.timing(value, {
                    toValue: 1,
                    duration: 3000,
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
                inputRange: [0, 0.6, 1],
                outputRange: [0, 1, 0],
            }),
            transform: [
                {
                    translateY: value.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -IMAGE_HEIGHT - font(14)],
                    }),
                },
                {
                    translateX: value.interpolate({
                        inputRange: [0, 0.6, 1],
                        outputRange: [0, -IMAGE_HEIGHT / 2, 0],
                    }),
                },
                {
                    scale: value.interpolate({
                        inputRange: [0, 0.4, 0.6, 1],
                        outputRange: [0, 1, 1, 0],
                    }),
                },
            ],
        };
    }, []);

    return (
        <View>
            {viewable &&
                values.map((value, index) => (
                    <Animated.View key={index} style={[styles.textItem, animationStyle(value, index)]}>
                        <Text style={styles.text}>{TEXT[index]}</Text>
                    </Animated.View>
                ))}
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
        height: IMAGE_HEIGHT,
        width: IMAGE_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    movieCover: {
        height: pixel(28),
        width: pixel(28),
        borderRadius: pixel(15),
    },
    textItem: {
        position: 'absolute',
        left: -font(14) / 2,
        bottom: -font(14),
    },
    text: {
        fontSize: font(14),
        color: '#fff',
    },
});
