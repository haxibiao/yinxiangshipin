import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    ScrollView,
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
import { observer, adStore, userStore } from '@src/store';
import MovieItemWithTime from '../components/MovieItemWithTime';

export default observer(() => {
    const { data, refetch, loading } = useQuery(GQL.favoritedMoviesQuery, {
        variables: { user_id: userStore.me.id, type: 'movies' },
        fetchPolicy: 'network-only',
        skip: !userStore.login,
    });
    const moviesData = useMemo(() => data?.myFavorite?.data, [data]);
    const navigation = useNavigation();

    if (!userStore.login || !moviesData?.length) {
        return null;
    }

    return (
        <View style={styles.secContainer}>
            <View style={styles.secHead}>
                <Text style={styles.secTitle}>我的追剧</Text>
                {moviesData?.length > 3 && (
                    <TouchableOpacity
                        style={styles.headRight}
                        onPress={() => navigation.navigate('MovieFavorites', { user: userStore.me })}>
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
                            key={movie?.id || index}
                            style={styles.itemWrap}
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
        paddingTop: pixel(15),
        paddingRight: pixel(14),
    },
    itemWrap: {
        marginRight: pixel(14),
    },
});
