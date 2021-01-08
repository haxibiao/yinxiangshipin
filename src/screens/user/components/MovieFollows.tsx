import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { Iconfont } from '@src/components';
import { observer, adStore } from '@src/store';
import MovieItemWithTime from '@src/screens/movie/components/MovieItemWithTime';

interface Props {
    user: any;
    categoryName?: string;
}

export default ({ user, categoryName = 'TA最近在看' }: Props) => {
    const { data, refetch, loading } = useQuery(GQL.favoritedMoviesQuery, {
        variables: { user_id: user.id, type: 'movies' },
        fetchPolicy: 'network-only',
    });
    const moviesData = useMemo(() => data?.myFavorite?.data, [data]);
    const navigation = useNavigation();

    if (!adStore.enableMovie || !moviesData?.length) {
        return null;
    }

    return (
        <View style={styles.secContainer}>
            <View style={styles.secHead}>
                <View style={styles.secHeadLeft}>
                    <Iconfont name="shizhongfill" style={{ marginTop: font(1) }} size={font(16)} color={'#909090'} />
                    <Text style={styles.secTitle}>{categoryName}</Text>
                </View>
                {/* <TouchableOpacity
                    style={styles.headRight}
                    onPress={() => navigation.navigate('MovieFavorites', { user })}>
                    <Text style={styles.secAll}>查看全部</Text>
                    <Iconfont name="right" style={{ marginTop: font(1) }} size={font(12)} color={'#909090'} />
                </TouchableOpacity> */}
            </View>
            <ScrollView
                contentContainerStyle={styles.movieList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {moviesData.map((item, index) => {
                    const movie = item?.movie || {};
                    return (
                        <MovieItemWithTime
                            showLastWatch={false}
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
