import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
    Easing,
    Platform,
    ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';

export const SPACE = pixel(15);
const POSTER_WIDTH = (Device.WIDTH - SPACE) / 3;
const POSTER_HEIGHT = POSTER_WIDTH * 0.64;

interface MovieProps {
    movie: {
        id: string;
        cover: string;
        name: string;
        introduction: string;
        count_series: string;
    };
}

export default function MediaItem({ movie }: MovieProps) {
    const navigation = useNavigation();
    const count_series = movie?.count_series;
    const hits = movie?.hits;
    let metaText = '尚未观看';
    if (movie?.count_series > 1) {
        metaText = `观看至第${movie.last_watch_series + 1}集 ${Helper.moment(movie.last_watch_progress)}`;
    } else if (movie?.last_watch_progress) {
        metaText = '观看至' + Helper.moment(movie.last_watch_progress);
    }

    if (!movie?.id) {
        return <MovieItemPlaceholder />;
    }

    return (
        <TouchableWithoutFeedback disabled={!movie?.id} onPress={() => navigation.navigate('MovieDetail', { movie })}>
            <View style={styles.movieContent}>
                <ImageBackground style={styles.movieCover} resizeMode="cover" source={{ uri: movie?.cover }}>
                    {count_series < 2 ? (
                        <ImageBackground
                            style={styles.picLabel}
                            source={require('@app/assets/images/movie/ic_movie_tag_sky.png')}>
                            <Text style={styles.picLabelText} numberOfLines={1}>
                                HD
                            </Text>
                        </ImageBackground>
                    ) : count_series >= 2 && hits > 0 ? (
                        <ImageBackground
                            style={styles.picLabel}
                            source={require('@app/assets/images/movie/ic_movie_tag_pink.png')}>
                            <Text style={styles.picLabelText} numberOfLines={1}>
                                热播
                            </Text>
                        </ImageBackground>
                    ) : null}
                    <LinearGradient
                        style={styles.picBt}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}>
                        <View style={{ flex: 1 }}>
                            {movie?.count_series > 1 && (
                                <Text style={styles.picText} numberOfLines={1}>
                                    共{movie?.count_series}集
                                </Text>
                            )}
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.movieInfo}>
                    <View>
                        <Text style={styles.movieName} numberOfLines={2}>
                            {movie?.name || ''}
                        </Text>
                    </View>
                    <Text style={styles.movieDesc} numberOfLines={1}>
                        {metaText}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

function MovieItemPlaceholder() {
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
        <View style={styles.movieContent}>
            <Animated.View style={[styles.movieCover, animationStyle]} />
            <View style={styles.movieInfo}>
                <Animated.View style={[styles.placeholderName, animationStyle]} />
                <Animated.View style={[styles.placeholderDesc, animationStyle]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    movieContent: {
        flexDirection: 'row',
        paddingHorizontal: SPACE,
        marginBottom: SPACE,
    },
    movieCover: {
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
    movieInfo: {
        flex: 1,
        marginLeft: pixel(10),
        justifyContent: 'space-between',
    },
    placeholderName: {
        width: '60%',
        height: font(15),
        borderRadius: font(5),
        marginTop: font(6),
        backgroundColor: '#f0f0f0',
    },
    placeholderDesc: {
        width: '90%',
        height: font(15),
        borderRadius: font(5),
        marginTop: font(6),
        backgroundColor: '#f0f0f0',
    },
    movieName: {
        color: '#202020',
        lineHeight: font(22),
        fontSize: font(14),
    },
    movieDesc: {
        color: '#909090',
        lineHeight: font(20),
        fontSize: font(12),
    },
});
