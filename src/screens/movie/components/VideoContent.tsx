import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Iconfont, Placeholder } from '@src/components';
import { PlayerStore } from '@src/components/MoviePlayer';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery, useMutation, errorMessage } from '@src/apollo';
import { userStore } from '@src/store';
import { observable } from 'mobx';
import MovieItem from './MovieItem';
import MovieInfoModal from './MovieInfoModal';
import movieStore from '../store';

export default function VideoContent({ movie }) {
    const navigation = useNavigation();
    const {
        id,
        name,
        count_series,
        count_comments,
        count_favorites,
        data,
        favorited,
        region,
        year,
        style,
        producer,
        actors,
    } = movie;
    const { loading, error: recommendError, data: recommendData, fetchMore, refetch } = useQuery(
        GQL.recommendMovieQuery,
        {
            variables: { count: 6 },
            fetchPolicy: 'network-only',
        },
    );
    const recommendMovies = useMemo(() => Helper.syncGetter('recommendMovie', recommendData), [recommendData]);

    const [currentEpisode, setEpisode] = useState(data?.[0]);
    const [toggleFavorite] = useMutation(GQL.toggleFavoriteMutation, {
        variables: {
            id: id,
            type: 'movies',
        },
        refetchQueries: () => [
            {
                query: GQL.movieQuery,
                variables: { movie_id: id },
            },
            {
                query: GQL.favoritedMoviesQuery,
                variables: { user_id: userStore.me.id, type: 'movies' },
            },
        ],
    });
    const toggleFavoriteOnPress = __.debounce(async function () {
        if (TOKEN) {
            movie.favorited ? movie.count_favorites-- : movie.count_favorites++;
            movie.favorited = !movie?.favorited;
            const [error, result] = await Helper.exceptionCapture(toggleFavorite);
            if (error) {
                Toast.show({ content: errorMessage(error) || '操作失败' });
            } else if (result) {
                Toast.show({ content: result?.data?.toggleFavorite?.favorited ? '已收藏' : '已取消收藏' });
            }
        } else {
            navigation.navigate('Login');
        }
    }, 200);

    const episodeItem = useCallback(
        (item, index) => {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.episodeBox, currentEpisode.url === item.url && { borderColor: '#37B7FB' }]}
                    onPress={() => {
                        PlayerStore.setCurrentEpisode(item);
                        setEpisode(item);
                    }}>
                    <Text style={[styles.episodeText, currentEpisode.url === item.url && { color: '#37B7FB' }]}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            );
        },
        [currentEpisode],
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.areaStyle, { marginRight: pixel(Theme.itemSpace) }]}
                onPress={() => movieStore.setMovieData(movie)}>
                <Text style={styles.title}>
                    {name}
                    {(region || year || style) && (
                        <Text style={[styles.description, { color: '#F3583F' }]}>
                            &emsp;[{region && `${region}`}
                            {year && `·${year}`}
                            {style && `·${style}`}]
                        </Text>
                    )}
                </Text>
                {producer && <Text style={styles.description}>导演：{producer}</Text>}
                {actors && <Text style={styles.description}>演员：{actors}</Text>}
                <Text numberOfLines={1} style={styles.description}>
                    更新至第{count_series}集·简介
                    <Iconfont name="right" color={'#333'} size={pixel(12)} />
                </Text>
                <View style={[styles.header, { marginTop: pixel(8) }]}>
                    <View style={styles.row}>
                        <Image
                            source={require('@app/assets/images/movie/ic_comment.png')}
                            style={styles.operationIcon}
                        />
                        <Text style={styles.info}>{count_comments}人参与讨论</Text>
                    </View>
                    <TouchableOpacity onPress={toggleFavoriteOnPress} style={styles.row}>
                        <Image
                            source={
                                favorited
                                    ? require('@app/assets/images/movie/ic_collected.png')
                                    : require('@app/assets/images/movie/ic_collect.png')
                            }
                            style={styles.operationIcon}
                        />
                        <Text style={styles.info}>{count_favorites}人收藏</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            {/* 选集 */}
            <View style={{ marginBottom: pixel(20) }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[styles.header, { marginBottom: pixel(10), marginRight: pixel(Theme.itemSpace) }]}
                    onPress={() => movieStore.setMovieData(Object.assign({}, { ...movie }, { selectEpisode: true }))}>
                    <Text style={styles.episodeTitle}>选集</Text>
                    <View style={styles.right}>
                        <Iconfont name="right" color={'#000'} size={pixel(14)} />
                    </View>
                </TouchableOpacity>
                <FlatList
                    contentContainerStyle={styles.episodesContentStyle}
                    data={data}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => episodeItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            {/* 推荐 */}
            <View style={styles.areaStyle}>
                <Text style={styles.title}>为你推荐</Text>
                <FlatList
                    numColumns={3}
                    data={recommendMovies}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => <MovieItem movie={item} boxStyle={styles.boxStyle} />}
                    keyExtractor={(item, index) => item.id.toString()}
                    ListFooterComponent={() =>
                        loading ? (
                            <View style={{ flexDirection: 'row' }}>
                                <Placeholder type={'movie'} quantity={6} />
                            </View>
                        ) : null
                    }
                />
            </View>
            <MovieInfoModal setEpisode={setEpisode} currentEpisode={currentEpisode} />
        </ScrollView>
    );
}

const itemWidth = (Device.WIDTH - pixel(Theme.itemSpace) * 2 - pixel(20)) / 3;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: pixel(15),
    },
    title: {
        fontSize: font(16),
        fontWeight: 'bold',
        marginBottom: pixel(10),
    },
    areaStyle: {
        marginBottom: pixel(20),
        paddingLeft: pixel(Theme.itemSpace),
    },
    description: {
        fontSize: font(12),
        lineHeight: pixel(18),
        color: '#333',
        fontWeight: 'normal',
        marginTop: pixel(8),
    },
    operationIcon: {
        width: pixel(25),
        height: pixel(25),
        resizeMode: 'cover',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    episodeTitle: {
        fontSize: font(16),
        fontWeight: 'bold',
        paddingLeft: pixel(Theme.itemSpace),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        fontSize: font(12),
        lineHeight: pixel(18),
        color: '#333',
        fontWeight: 'normal',
        marginLeft: pixel(3),
        alignSelf: 'flex-end',
    },
    right: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: pixel(10),
        justifyContent: 'flex-end',
    },
    episodeBox: {
        minWidth: pixel(50),
        height: pixel(45),
        paddingHorizontal: pixel(10),
        borderWidth: 1,
        borderColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: pixel(5),
        marginRight: pixel(5),
    },
    episodeText: {
        fontSize: font(13),
        lineHeight: pixel(18),
        color: '#333',
    },
    episodesContentStyle: {
        paddingRight: pixel(9),
        paddingLeft: pixel(Theme.itemSpace),
    },
    boxStyle: {
        width: itemWidth,
        marginRight: pixel(10),
        marginBottom: pixel(10),
    },
});
