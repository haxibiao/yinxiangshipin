import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ImageBackground, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { Iconfont, DebouncedPressable } from '@src/components';
import MovieItem, { SPACE } from '../components/MovieItem';

interface Props {
    categoryName: string;
    count?: number;
}

export default ({ count = 6, categoryName }: Props) => {
    const { data, refetch, loading } = useQuery(GQL.categoryMovieQuery, {
        variables: { region: 'JIESHUO', count },
        fetchPolicy: 'network-only',
    });
    const moviesData = useMemo(() => data?.categoryMovie?.data || new Array(count).fill({}), [data]);
    const navigation = useNavigation();

    return (
        <View style={styles.secContainer}>
            <Pressable onPress={() => navigation.navigate('CategoriesTab', { category: 'JIESHUO' })}>
                <ImageBackground
                    style={styles.secHeadBg}
                    resizeMode="cover"
                    source={require('@app/assets/images/movie/bg_film.jpeg')}>
                    <View style={styles.headerContent}>
                        <Text style={styles.secTitle}>精彩解说 ￨ 唯有电影永不散场</Text>
                        <TouchableOpacity
                            style={styles.moreBtn}
                            onPress={() => navigation.navigate('CategoriesTab', { category: 'JIESHUO' })}>
                            <Text style={styles.moreText}>查看全部解说</Text>
                        </TouchableOpacity>
                        <View style={styles.arrow} />
                    </View>
                </ImageBackground>
            </Pressable>

            <ScrollView
                style={{ marginLeft: pixel(14) }}
                contentContainerStyle={styles.movieList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {moviesData.map((item, index) => {
                    return (
                        <MovieItem
                            key={item?.id || index}
                            movie={item}
                            navigation={navigation}
                            style={{ marginRight: pixel(9) }}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    secContainer: {
        paddingTop: pixel(20),
        marginBottom: pixel(10),
        marginTop: pixel(-10),
        backgroundColor: '#fff',
    },
    secHeadBg: {
        width: Device.WIDTH,
        height: Device.WIDTH * 0.4,
    },
    headerContent: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#00000044',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrow: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: pixel(16),
        height: pixel(16),
        backgroundColor: '#fff',
        transform: [
            {
                translateX: -pixel(8),
            },
            {
                translateY: pixel(8),
            },
            {
                rotateZ: '45deg',
            },
        ],
    },
    secTitle: {
        fontSize: font(18),
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: pixel(12),
    },
    moreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: pixel(14),
        paddingHorizontal: pixel(10),
        backgroundColor: '#000000AA',
    },
    moreText: {
        fontSize: font(11),
        lineHeight: font(28),
        color: '#ffffffDD',
    },
    movieList: {
        paddingTop: pixel(10),
        paddingRight: pixel(8),
    },
});
