import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableWithoutFeedback, Platform, ViewStyle } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import { GQL, useQuery } from '@src/apollo';

const POSTER_WIDTH = Device.WIDTH - pixel(28);
const POSTER_HEIGHT = POSTER_WIDTH * 0.52;

interface Props {
    style?: ViewStyle;
}

export default ({ style }: Props) => {
    const { data } = useQuery(GQL.movieSwiper, {
        fetchPolicy: 'network-only',
    });
    const moviesData = useMemo(() => data?.activities?.data, [data]);

    const navigation = useNavigation();
    const goToMovieDetail = useCallback((movie) => {
        navigation.navigate('MovieDetail', { movie_id: movie?.id });
    }, []);

    if (!moviesData?.length) {
        return <View style={[styles.posterContent, style]} />;
    }
    return (
        <View style={[styles.posterContent, style]}>
            <Swiper
                style={styles.swiperStyle}
                width={POSTER_WIDTH}
                index={0}
                autoplayTimeout={4}
                autoplay={true}
                showsButtons={false}
                paginationStyle={styles.paginationStyle}
                dotStyle={styles.dotStyle}
                activeDotStyle={styles.activeDotStyle}>
                {moviesData.map((item, index) => {
                    const movie = item?.movie;
                    const title = item?.title;
                    const source = item?.image_url;
                    return (
                        <TouchableWithoutFeedback key={item?.id || index} onPress={() => goToMovieDetail(movie)}>
                            <ImageBackground style={styles.posterImage} resizeMode="cover" source={{ uri: source }}>
                                <LinearGradient
                                    style={styles.picBt}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 0, y: 0 }}
                                    colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.picText} numberOfLines={1}>
                                            {title}
                                        </Text>
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        </TouchableWithoutFeedback>
                    );
                })}
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    posterContent: {
        marginHorizontal: pixel(14),
        height: POSTER_HEIGHT,
        borderRadius: pixel(5),
        backgroundColor: '#f4f4f4',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.24,
                shadowRadius: pixel(5),
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
    swiperStyle: {
        height: POSTER_HEIGHT,
    },
    paginationStyle: {
        position: 'absolute',
        right: pixel(10),
        bottom: pixel(6),
        justifyContent: 'flex-end',
    },
    dotStyle: {
        width: pixel(6),
        height: pixel(6),
        borderRadius: pixel(3),
        backgroundColor: '#fff',
    },
    activeDotStyle: {
        width: pixel(6),
        height: pixel(6),
        borderRadius: pixel(3),
        backgroundColor: Theme.primaryColor,
    },
    posterImage: {
        position: 'relative',
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        borderRadius: pixel(5),
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    picBt: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: pixel(15),
        paddingBottom: pixel(6),
        paddingLeft: pixel(10),
        paddingRight: POSTER_WIDTH * 0.25,
    },
    picText: {
        color: '#fff',
        lineHeight: font(20),
        fontSize: font(16),
        fontWeight: 'bold',
    },
});
