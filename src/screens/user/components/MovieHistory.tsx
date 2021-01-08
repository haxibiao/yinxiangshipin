import React, { useRef, useState, useMemo, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { Iconfont } from '@src/components';
import { observer, adStore, userStore } from '@src/store';
import MovieItemWithTime from '@src/screens/movie/components/MovieItemWithTime';

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

export default observer(() => {
    const { data, refetch, loading } = useQuery(GQL.showMovieHistoryQuery, {
        variables: { user_id: userStore.me.id, type: 'movies' },
        fetchPolicy: 'network-only',
    });
    const moviesData = useMemo(() => data?.showMovieHistory?.data, [data]);
    const navigation = useNavigation();

    if (!adStore.enableMovie || !moviesData?.length) {
        return null;
    }

    return (
        <View style={styles.secContainer}>
            <View style={styles.secHead}>
                <View style={styles.secHeadLeft}>
                    <Iconfont name="shizhongfill" style={{ marginTop: font(1) }} size={font(16)} color={'#909090'} />
                    <Text style={styles.secTitle}>播放记录</Text>
                </View>
                {moviesData?.length > 3 && (
                    <TouchableOpacity style={styles.headRight} onPress={() => navigation.navigate('MovieHistories')}>
                        <Text style={styles.secAll}>查看全部</Text>
                        <Iconfont name="right" style={{ marginTop: font(1) }} size={font(12)} color={'#909090'} />
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView
                style={{ marginLeft: pixel(14) }}
                contentContainerStyle={styles.movieList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {moviesData.map((item, index) => {
                    const movie = item?.movie || {};
                    return (
                        <MovieItemWithTime
                            style={styles.itemWrap}
                            key={movie?.id || index}
                            movie={movie}
                            navigation={navigation}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    secContainer: {
        paddingTop: pixel(14),
        paddingVertical: pixel(14),
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    secHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: pixel(14),
    },
    secHeadLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secTitle: {
        fontSize: font(15),
        color: '#404040',
        marginLeft: pixel(4),
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
        paddingTop: pixel(10),
        paddingRight: pixel(14),
    },
    itemWrap: {
        marginRight: pixel(14),
    },
});
