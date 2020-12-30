import React from 'react';
import { StyleSheet, View, Text, Image, Animated, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const PADDING = pixel(14);
const CONTENT_WIDTH = Device.WIDTH - PADDING * 2;

export default function CollectionBanner({ collection, banner }) {
    const navigation = useNavigation();

    if (!collection) {
        return <Placeholder />;
    }
    return (
        <Pressable style={styles.topBanner} onPress={() => navigation.navigate('CollectionDetail', { collection })}>
            <Image style={styles.banner} source={banner} />
            <View style={styles.bannerContent}>
                <Text style={styles.collectionText}>《精选合集》</Text>
                <Text style={[styles.collectionText, { fontSize: pixel(14), lineHeight: pixel(18) }]} numberOfLines={2}>
                    {collection?.description || collection?.name}
                </Text>
            </View>
        </Pressable>
    );
}

function Placeholder() {
    const animation = new Animated.Value(0.5);
    const animationStyle = { opacity: animation };

    (function startAnimation() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0.5,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    })();

    return (
        <View style={styles.topBanner}>
            <Animated.View style={[styles.banner, animationStyle]} />
        </View>
    );
}

const styles = StyleSheet.create({
    topBanner: {
        marginHorizontal: PADDING,
    },
    banner: {
        width: CONTENT_WIDTH,
        height: Math.floor(CONTENT_WIDTH * 0.5),
        borderRadius: pixel(6),
        backgroundColor: '#f0f0f0',
    },
    bannerContent: {
        position: 'absolute',
        bottom: pixel(10),
        left: pixel(10),
        right: CONTENT_WIDTH * 0.3,
    },
    collectionText: {
        fontSize: font(19),
        lineHeight: font(25),
        marginBottom: pixel(8),
        color: '#ffffffee',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
    },
});
