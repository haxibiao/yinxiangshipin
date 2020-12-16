import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Iconfont } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery, useMutation, errorMessage } from '@src/apollo';
import { observable } from 'mobx';
import MovieItem from './MovieItem';
import MovieInfoModal from './MovieInfoModal';
import movieStore from '../store';

export default function VideoContent({ movie }) {
    const navigation = useNavigation();
    const { id, name, count_series, data, favorited } = movie;
    const { loading, error, data: recommendData, fetchMore, refetch } = useQuery(GQL.recommendMovieQuery, {
        fetchPolicy: 'network-only',
    });
    const recommendMovies = useMemo(() => Helper.syncGetter('recommendMovie', recommendData), [recommendData]);

    const [currentEpisode, setEpisode] = useState(0);
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
        ],
    });
    const toggleFavoriteOnPress = __.debounce(async function () {
        if (TOKEN) {
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
                    style={[styles.episodeBox, currentEpisode === index && { borderColor: '#92CAEE' }]}
                    onPress={() => setEpisode(index)}>
                    <Text style={[styles.episodeText, currentEpisode === index && { color: '#92CAEE' }]}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            );
        },
        [currentEpisode],
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.areaStyle} onPress={() => movieStore.setMovieData(movie)}>
                <Text style={styles.title}>{name}</Text>
                <Text numberOfLines={1} style={styles.description}>
                    <Text style={{ color: '#F3583F' }}>🔥4564</Text>
                    ·更新至第{count_series}集·简介
                    <Iconfont name="zuojiantou" color={'#BBBBBB'} size={pixel(12)} />
                </Text>
                <View style={[styles.header, { marginTop: pixel(10) }]}>
                    <View style={styles.row}>
                        <Image source={require('@app/assets/images/ic_comment.png')} style={styles.operationIcon} />
                        <Text style={[styles.description, { marginLeft: pixel(3) }]}>0人参与讨论</Text>
                    </View>
                    <TouchableOpacity onPress={toggleFavoriteOnPress}>
                        <Image
                            source={
                                favorited
                                    ? require('@app/assets/images/ic_collected.png')
                                    : require('@app/assets/images/ic_collect.png')
                            }
                            style={styles.operationIcon}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            {/* 选集 */}
            <View style={{ marginBottom: pixel(20) }}>
                <TouchableOpacity
                    style={[styles.header, { marginBottom: pixel(10) }]}
                    onPress={() => movieStore.setMovieData(movie)}>
                    <Text style={styles.episodeTitle}>选集</Text>
                    <View style={styles.right}>
                        <Text numberOfLines={1} style={styles.description}>
                            每周三、周四更新一集
                        </Text>
                        <Iconfont name="zuojiantou" color={'#BBBBBB'} size={pixel(12)} />
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
                />
            </View>
            <MovieInfoModal />
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
        lineHeight: pixel(17),
        color: '#BBBBBB',
    },
    operationIcon: {
        width: pixel(25),
        height: pixel(25),
        resizeMode: 'contain',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: pixel(Theme.itemSpace),
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
    right: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: pixel(10),
        justifyContent: 'flex-end',
    },
    episodeBox: {
        minWidth: pixel(50),
        height: pixel(40),
        paddingHorizontal: pixel(10),
        borderWidth: 1,
        borderColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: pixel(5),
        marginRight: pixel(5),
    },
    episodeText: {
        fontSize: font(14),
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

const recommendData = [
    {
        id: 0,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 1,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 2,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 3,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 4,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 5,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
];
