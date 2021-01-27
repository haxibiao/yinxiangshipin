import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { observer } from 'mobx-react';
import { userStore } from '@src/store';
import { GQL, errorMessage, useFavoriteMutation } from '@src/apollo';
import { QueryList } from '@src/content';
import MovieList from './MovieList';

export default function SearchedMovie({ keyword }) {
    const navigation = useNavigation();

    return (
        <MovieList
            gqlDocument={GQL.searchMoviesQuery}
            dataOptionChain="searchMovie.data"
            keyword={keyword}
            paginateOptionChain="searchMovie.paginatorInfo"
            options={{
                variables: {
                    keyword: keyword,
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={({ item }) => <SearchMovieItem movie={item} navigation={navigation} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
}

const SearchMovieItem = observer(({ movie, navigation }) => {
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
        <TouchableOpacity activeOpacity={1} style={styles.movieWrap} onPress={toMovieDetail}>
            <ImageBackground style={styles.movieCover} resizeMode="cover" source={{ uri: movie?.cover }}>
                {movie?.count_series < 2 ? (
                    <ImageBackground
                        style={styles.picLabel}
                        source={require('@app/assets/images/movie/ic_movie_tag_sky.png')}>
                        <Text style={styles.picLabelText} numberOfLines={1}>
                            HD
                        </Text>
                    </ImageBackground>
                ) : movie?.count_series >= 2 && movie?.hits > 0 ? (
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
            <View style={styles.movieContent}>
                <View style={styles.movieInfo}>
                    <Text style={styles.movieName}>{movie?.name}</Text>
                    <Text style={styles.metaInfo} numberOfLines={1}>
                        {movie.region && `${movie.region} · `}
                        {movie.year && `${movie.year}`}
                    </Text>
                    {!!movie.actors && (
                        <Text style={styles.metaInfo} numberOfLines={1}>
                            演员：{movie.actors}
                        </Text>
                    )}
                    <Text style={styles.metaInfo} numberOfLines={2}>
                        {movie?.introduction || ''}
                    </Text>
                </View>
                <View style={styles.operation}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.operateBtn} onPress={toMovieDetail}>
                        <Text style={styles.visit}>立即观看</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.operateBtn, { borderColor: movie.favorited ? '#37B7FB' : '#AEBCC4' }]}
                        onPress={toggleFavoriteOnPress}>
                        <Image
                            source={
                                movie.favorited
                                    ? require('@app/assets/images/movie/ic_collected.png')
                                    : require('@app/assets/images/movie/ic_collect.png')
                            }
                            style={styles.icon}
                        />
                        <Text style={[styles.visit, { color: movie.favorited ? '#37B7FB' : '#AEBCC4' }]}>追剧</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
});

export const SPACE = pixel(15);
const POSTER_WIDTH = (Device.width - SPACE) / 3;
const POSTER_HEIGHT = POSTER_WIDTH * 1.28;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Device.bottomInset,
    },
    separator: {
        marginHorizontal: pixel(Theme.edgeDistance),
        height: pixel(1),
        backgroundColor: '#F4F4F4',
    },
    movieWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACE,
        paddingHorizontal: SPACE,
    },
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
    movieContent: {
        flex: 1,
        marginLeft: pixel(10),
        justifyContent: 'space-between',
    },
    movieInfo: {
        overflow: 'hidden',
        marginBottom: pixel(30),
    },
    movieName: {
        fontSize: font(15),
        lineHeight: pixel(22),
        fontWeight: 'bold',
        marginBottom: pixel(5),
    },
    metaInfo: {
        fontSize: font(12),
        lineHeight: pixel(20),
        color: '#9D9FA8',
        marginBottom: pixel(5),
    },
    operation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    operateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(26),
        paddingHorizontal: pixel(5),
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
        width: pixel(16),
        height: pixel(16),
        resizeMode: 'cover',
        marginRight: pixel(2),
    },
});
