import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { GQL, errorMessage, useFavoriteMutation } from '@src/apollo';
import { useNavigation } from '@react-navigation/native';
import { userStore } from '@src/store';
import { observer } from 'mobx-react';

const SearchMovieItem = observer(({ movie }) => {
    const navigation = useNavigation();

    const toggleFavorite = useFavoriteMutation({
        variables: {
            id: movie.id,
            type: 'movies',
        },
        refetchQueries: () => [
            {
                query: GQL.movieQuery,
                variables: { movie_id: movie.id },
            },
            {
                query: GQL.favoritedMoviesQuery,
                variables: { user_id: userStore.me.id, type: 'movies' },
            },
        ],
    });

    const toggleFavoriteOnPress = useCallback(() => {
        if (TOKEN) {
            movie.favorited = !movie?.favorited;
            toggleFavorite();
        } else {
            navigation.navigate('Login');
        }
    }, [movie]);

    const toMovieDetail = () => {
        navigation.navigate('MovieDetail', { movie });
    };

    return (
        <TouchableOpacity activeOpacity={1} style={styles.container} onPress={toMovieDetail}>
            <Image source={{ uri: movie?.cover }} style={styles.cover} />
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        // 104：根据内容计算的
                        height: pixel(102),
                        overflow: 'hidden',
                        marginBottom: pixel(36),
                    }}>
                    <Text style={styles.title}>{movie?.name}</Text>
                    <Text style={styles.info} numberOfLines={1}>
                        {movie.region && `${movie.region} · `}
                        {movie.year && `${movie.year} · `}
                        {movie.style && `${movie.style} · `}
                        {movie.count_series && `更新至第${movie.count_series}集`}
                    </Text>
                    {!!movie.producer && (
                        <Text style={styles.info} numberOfLines={1}>
                            导演：{movie.producer}
                        </Text>
                    )}
                    {!!movie.actors && (
                        <Text style={styles.info} numberOfLines={1}>
                            演员：{movie.actors}
                        </Text>
                    )}
                </View>
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: pixel(3) }}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.operation} onPress={toMovieDetail}>
                        <Text style={styles.visit}>立即观看</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.operation, { borderColor: movie.favorited ? '#0C9BFF' : '#9D9FA8' }]}
                        onPress={toggleFavoriteOnPress}>
                        <Image
                            source={
                                movie.favorited
                                    ? require('@app/assets/images/movie/ic_collected.png')
                                    : require('@app/assets/images/movie/ic_collect.png')
                            }
                            style={styles.icon}
                        />
                        <Text style={[styles.visit, { color: movie.favorited ? '#0C9BFF' : '#9D9FA8' }]}>追剧</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: (pixel(Theme.itemSpace) / 3) * 2,
        paddingHorizontal: pixel(Theme.itemSpace),
    },
    cover: {
        width: (Device.WIDTH - pixel(Theme.itemSpace) * 2) * 0.3,
        borderRadius: pixel(4),
        marginRight: pixel(10),
        resizeMode: 'cover',
    },
    title: {
        fontSize: font(15),
        lineHeight: pixel(22),
        fontWeight: 'bold',
        marginBottom: pixel(5),
    },
    info: {
        fontSize: font(12),
        lineHeight: pixel(20),
        color: '#9D9FA8',
        marginBottom: pixel(5),
    },
    operation: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(26),
        paddingHorizontal: pixel(3),
        borderRadius: pixel(3),
        borderWidth: pixel(1),
        borderColor: Theme.primaryColor,
        marginRight: pixel(10),
    },
    visit: {
        fontSize: font(12),
        lineHeight: pixel(20),
        color: Theme.primaryColor,
    },
    icon: {
        width: pixel(18),
        height: pixel(18),
        resizeMode: 'cover',
        marginRight: pixel(2),
    },
});

export default SearchMovieItem;
