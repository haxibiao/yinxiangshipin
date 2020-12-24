import React, { useRef, useState, useMemo, useCallback } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { GQL, useQuery } from '@src/apollo';
import { Iconfont, DebouncedPressable } from '@src/components';

const POSTER_WIDTH = (Device.WIDTH - pixel(56)) / 3;
const POSTER_HEIGHT = POSTER_WIDTH * 1.34;

interface MovieProps {
    movie: {
        id: string;
        cover: string;
        name: string;
        introduction: string;
        count_series: string;
    };
    navigation: {
        navigate: (p1: String, p2?: any) => void;
    };
}

function MovieItem({ movie, navigation }: MovieProps) {
    const count_series = movie?.count_series;
    const hits = movie?.hits;

    return (
        <TouchableWithoutFeedback
            disabled={!movie?.id}
            onPress={() => navigation.navigate('MovieDetail', { movie_id: movie?.id })}>
            <View style={styles.movieContent}>
                <ImageBackground style={styles.movieCover} i resizeMode="cover" source={{ uri: movie?.cover }}>
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
                    <Text style={styles.movieName} numberOfLines={1}>
                        {movie?.name || ''}
                    </Text>
                    <Text style={styles.movieDesc} numberOfLines={1}>
                        {movie?.introduction || ''}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

interface Props {
    categoryName: string;
    type?: 'MEI' | 'HAN' | 'RI' | 'GANG';
    count?: number;
}

const CategoryIndex = {
    MEI: 0,
    HAN: 1,
    RI: 2,
    GANG: 3,
};

export default ({ type = 'MEI', count = 6, categoryName }: Props) => {
    const { data, refetch, loading } = useQuery(GQL.categoryMovieQuery, {
        variables: { region: type, count },
        fetchPolicy: 'network-only',
    });
    const moviesData = useMemo(() => data?.categoryMovie?.data || new Array(count).fill({}), [data]);
    const navigation = useNavigation();

    return (
        <View style={styles.secContainer}>
            <View style={styles.secHead}>
                <Text style={styles.secTitle}>{categoryName || '热门影视'}</Text>
                <TouchableOpacity
                    style={styles.headRight}
                    onPress={() => navigation.navigate('ApplicationMenuTable', { i: CategoryIndex[type] || 0 })}>
                    <Text style={styles.secAll}>查看全部</Text>
                    <Iconfont name="right" size={font(13)} color={'#909090'} />
                </TouchableOpacity>
            </View>
            <View style={styles.movieList}>
                {moviesData.map((item, index) => {
                    return (
                        <View style={styles.itemWrap} key={item?.id || index}>
                            <MovieItem movie={item} navigation={navigation} />
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    secContainer: {
        padding: pixel(14),
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    secHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    secTitle: {
        fontSize: font(16),
        color: '#202020',
        fontWeight: 'bold',
    },
    headRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secAll: {
        fontSize: font(13),
        color: '#909090',
        marginRight: font(-1),
    },
    movieList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: pixel(-14),
    },
    itemWrap: {
        marginTop: pixel(15),
        marginRight: pixel(14),
        width: POSTER_WIDTH,
    },
    movieContent: {},
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
        fontSize: font(12),
    },
    movieInfo: {
        marginTop: pixel(5),
        minHeight: font(42),
    },
    movieName: {
        color: '#202020',
        lineHeight: font(22),
        fontSize: font(14),
    },
    movieDesc: {
        color: '#909090',
        lineHeight: font(20),
        fontSize: font(13),
    },
});
