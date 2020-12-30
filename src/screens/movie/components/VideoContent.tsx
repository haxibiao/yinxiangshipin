import React, { useCallback, useState, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Iconfont, Placeholder, DebouncedPressable } from '@src/components';
import { PlayerStore } from '@src/components/MoviePlayer';
import { GQL, useQuery, errorMessage, useFavoriteMutation } from '@src/apollo';
import { userStore } from '@src/store';
import MovieItem, { SPACE } from './MovieItem';
import AnthologyButton from './AnthologyButton';
import MovieInfoModal from './MovieInfoModal';
import movieStore from '../store';

export default observer(({ movie }) => {
    const navigation = useNavigation();
    const { data: recommendData } = useQuery(GQL.recommendMovieQuery, {
        variables: { count: 6 },
        fetchPolicy: 'network-only',
    });
    const recommendMovies = useMemo(() => recommendData?.recommendMovie || new Array(6).fill({}), [recommendData]);

    const toggleFavorite = useFavoriteMutation({
        variables: {
            id: movie?.id,
            type: 'movies',
        },
        refetchQueries: () => [
            {
                query: GQL.movieQuery,
                variables: { movie_id: movie?.id },
            },
            {
                query: GQL.favoritedMoviesQuery,
                variables: { user_id: userStore.me.id, type: 'movies' },
            },
        ],
    });

    const toggleFavoriteOnPress = useCallback(() => {
        if (TOKEN) {
            movie.favorited ? movie.count_favorites-- : movie.count_favorites++;
            movie.favorited = !movie.favorited;
            toggleFavorite();
        } else {
            navigation.navigate('Login');
        }
    }, [movie]);

    const episodeItem = useCallback(
        ({ item, index }) => {
            return (
                <AnthologyButton
                    active={PlayerStore.currentEpisodeIndex === index}
                    content={index + 1}
                    onPress={() => {
                        InteractionManager.runAfterInteractions(() => {
                            PlayerStore.setCurrentEpisode(item, index);
                        });
                    }}
                />
            );
        },
        [PlayerStore.currentEpisodeIndex],
    );

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity activeOpacity={1} style={styles.movieInfo} onPress={() => movieStore.setMovieData(movie)}>
                <Text style={styles.movieName}>{movie?.name}</Text>
                <View style={styles.movieDesc}>
                    {movie?.year && <Text style={styles.description}>{movie?.year} · </Text>}
                    {movie?.region && <Text style={styles.description}>{movie?.region} · </Text>}
                    {movie?.count_series > 1 && <Text style={styles.description}>{movie?.count_series}集全 · </Text>}
                    <Text style={styles.description}>简介 </Text>
                    <Iconfont style={{ marginTop: font(1) }} name="right" size={font(12)} color={'#AEBCC4'} />
                </View>
                <View style={styles.operates}>
                    <View style={styles.row}>
                        <Image
                            source={require('@app/assets/images/movie/ic_comment.png')}
                            style={styles.operationIcon}
                        />
                        <Text style={styles.count_comments}>{movie?.count_comments}人参与讨论</Text>
                    </View>
                    <DebouncedPressable onPress={toggleFavoriteOnPress}>
                        <Image
                            source={
                                movie?.favorited
                                    ? require('@app/assets/images/movie/ic_collected.png')
                                    : require('@app/assets/images/movie/ic_collect.png')
                            }
                            style={styles.operationIcon}
                        />
                    </DebouncedPressable>
                </View>
            </TouchableOpacity>
            {/* 选集 */}
            {movie?.count_series > 1 && (
                <View style={styles.sectionWrap}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.sectionHeader}
                        onPress={() =>
                            movieStore.setMovieData(Object.assign({}, { ...movie }, { selectEpisode: true }))
                        }>
                        <Text style={styles.sectionTitle}>选集</Text>
                        <View style={styles.row}>
                            <Text style={styles.metaText}>{movie?.count_series}集全</Text>
                            <Iconfont name="right" color={'#AEBCC4'} size={pixel(14)} />
                        </View>
                    </TouchableOpacity>
                    <FlatList
                        contentContainerStyle={styles.episodesContentStyle}
                        data={movie?.data}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={episodeItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            )}
            {/* 推荐 */}
            <View style={styles.sectionWrap}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>为你推荐</Text>
                </View>
                <FlatList
                    numColumns={3}
                    data={recommendMovies}
                    contentContainerStyle={styles.movieList}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: pixel(15) }} />}
                    renderItem={({ item, index }) => <MovieItem movie={item} />}
                    keyExtractor={(item, index) => (item?.id || index).toString()}
                />
            </View>
            <MovieInfoModal />
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingTop: pixel(14),
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: font(12),
        lineHeight: font(15),
        color: '#AEBCC4',
    },
    movieInfo: {
        marginBottom: pixel(20),
        paddingHorizontal: pixel(14),
    },
    movieName: {
        fontSize: font(16),
        lineHeight: font(20),
        fontWeight: 'bold',
    },
    movieDesc: {
        marginTop: pixel(6),
        flexDirection: 'row',
        alignItems: 'center',
    },
    description: {
        fontSize: font(12),
        lineHeight: font(16),
        color: '#AEBCC4',
    },
    operates: {
        marginTop: pixel(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    operationIcon: {
        width: pixel(25),
        height: pixel(25),
        resizeMode: 'cover',
    },
    count_comments: {
        fontSize: font(12),
        lineHeight: font(16),
        color: '#AEBCC4',
        marginLeft: pixel(2),
    },
    sectionWrap: {
        marginBottom: pixel(20),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: pixel(10),
        marginHorizontal: pixel(14),
    },
    sectionTitle: {
        fontSize: font(16),
        fontWeight: 'bold',
    },
    episodesContentStyle: {
        paddingRight: pixel(14),
        marginLeft: pixel(14),
    },
    episodeBox: {
        minWidth: pixel(50),
        height: pixel(50),
        paddingHorizontal: pixel(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: pixel(1),
        borderColor: '#f0f0f0',
        borderRadius: pixel(5),
        marginRight: pixel(5),
    },
    episodeText: {
        fontSize: font(15),
        lineHeight: font(18),
        fontWeight: '500',
        color: '#202020',
    },
    movieList: {
        paddingLeft: SPACE,
    },
});
