import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    TouchableWithoutFeedback,
    Animated,
    Easing,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export const SPACE = pixel(8);
export const POSTER_WIDTH = (Device.width - SPACE * 3 - pixel(14)) / 3.5;
const POSTER_HEIGHT = POSTER_WIDTH;

interface Collection {
    id: string;
    logo: string;
    name: string;
    description: string;
}
interface CollectionProps {
    collection: Collection;
    navigation: {
        navigate: (p1: String, p2?: any) => void;
    };
}

export default function CollectionItem({ collection, navigation }: CollectionProps) {
    if (!collection?.id) {
        return <CollectionPlaceholder />;
    }

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('CollectionDetail', { collection })}>
            <View style={styles.collectionContent}>
                <ImageBackground style={styles.collectionCover} i resizeMode="cover" source={{ uri: collection?.logo }}>
                    <LinearGradient
                        style={styles.picBt}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}>
                        <View style={{ flex: 1 }}>
                            {collection?.count_posts && (
                                <Text style={styles.picText} numberOfLines={1}>
                                    {collection?.count_posts}个视频
                                </Text>
                            )}
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.collectionInfo}>
                    <Text style={styles.collectionName} numberOfLines={1}>
                        {collection?.name || ''}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

function CollectionPlaceholder() {
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
        <View style={styles.collectionContent}>
            <Animated.View style={[styles.collectionCover, animationStyle]} />
            <View style={styles.collectionInfo}>
                <Animated.View style={[styles.placeholderName, animationStyle]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    collectionContent: {
        marginRight: SPACE,
        width: POSTER_WIDTH,
    },
    collectionCover: {
        position: 'relative',
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        borderRadius: pixel(8),
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.24,
                shadowRadius: pixel(8),
                shadowOffset: {
                    width: 0,
                    height: pixel(3),
                },
            },
            android: {
                elevation: 6,
            },
        }),
    },
    picLabel: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: (font(19) * 64) / 34,
        height: font(19),
        paddingHorizontal: pixel(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    picLabelText: {
        color: '#fff',
        lineHeight: font(14),
        fontSize: font(11),
    },
    picBt: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: pixel(10),
        paddingBottom: pixel(4),
        paddingHorizontal: pixel(8),
    },
    picText: {
        color: '#fff',
        lineHeight: font(14),
        fontSize: font(11),
    },
    collectionInfo: {
        marginTop: pixel(5),
    },
    placeholderName: {
        width: '60%',
        height: font(15),
        borderRadius: font(5),
        marginTop: font(5),
        backgroundColor: '#f0f0f0',
    },
    placeholderDesc: {
        width: '90%',
        height: font(15),
        borderRadius: font(5),
        marginTop: font(6),
        backgroundColor: '#f0f0f0',
    },
    collectionName: {
        color: '#202020',
        lineHeight: font(20),
        fontSize: font(14),
    },
    collectionDesc: {
        color: '#909090',
        lineHeight: font(20),
        fontSize: font(12),
    },
});
