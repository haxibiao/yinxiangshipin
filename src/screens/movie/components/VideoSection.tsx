import React, { useRef, useCallback, useState, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    InteractionManager,
    Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { adStore, userStore } from '@src/store';
import { GQL, useQuery, errorMessage, useFavoriteMutation } from '@src/apollo';
import { Iconfont, DebouncedPressable } from '@src/components';
import { AutonomousModal } from '@src/components/modal';
import { PlayerStore } from '@src/components/MoviePlayer';
import { useStatusBarHeight } from '@src/common';
import MovieItem, { SPACE } from './MovieItem';
import AnthologyButton from './AnthologyButton';
import { MovieIntroduction, MovieSeriesChooser } from './MovieContent';
import { ad } from 'react-native-ad';

const portraitHeight = Dimensions.get('window').width * 0.58;

export default observer(({ movie }) => {
    const avatarId = useRef(String(movie.id)[movie.id?.length - 1]).current;
    const topInset = useStatusBarHeight();
    const [introModalVisible, setIntroModalVisible] = useState(false);
    const [episodeModalVisible, setEpisodeModalVisible] = useState(false);
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

    const renderEpisode = useCallback(
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
            <TouchableOpacity activeOpacity={1} style={styles.movieInfo} onPress={() => setIntroModalVisible(true)}>
                <Text style={styles.movieName}>{movie?.name}</Text>
                <View style={styles.movieDesc}>
                    {movie?.year && <Text style={styles.description}>{movie.year} · </Text>}
                    {movie?.region && <Text style={styles.description}>{movie.region} · </Text>}
                    {movie?.count_series > 1 && <Text style={styles.description}>{movie.count_series}集全 · </Text>}
                    <Text style={styles.description}>简介</Text>
                    <Iconfont
                        name="right"
                        size={font(12)}
                        style={{ marginTop: font(1), marginLeft: font(2) }}
                        color={'#AEBCC4'}
                    />
                </View>
                <View style={styles.uploaderWrap}>
                    <View style={styles.uploader}>
                        <Image
                            style={styles.avatar}
                            source={{
                                uri: `https://yinxiangshipin-1254284941.cos.ap-guangzhou.myqcloud.com/storage/avatar/avatar-${avatarId}.jpg`,
                            }}
                        />
                        <Text style={styles.uploaderText}>匿名用户</Text>
                    </View>
                </View>
                <View style={styles.operates}>
                    <View style={styles.row}>
                        <Image
                            source={require('@app/assets/images/movie/ic_comment.png')}
                            style={styles.operationIcon}
                        />
                        <Text style={styles.countComments}>{movie?.count_comments}人参与讨论</Text>
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
                        onPress={() => setEpisodeModalVisible(true)}>
                        <Text style={styles.sectionTitle}>选集</Text>
                        <View style={styles.row}>
                            <Text style={styles.metaText}>{movie?.count_series}集全</Text>
                            <Iconfont name="right" color={'#AEBCC4'} size={pixel(14)} />
                        </View>
                    </TouchableOpacity>
                    <FlatList
                        contentContainerStyle={styles.episodes}
                        data={movie?.data}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={renderEpisode}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            )}
            <ad.Feed visible={adStore.enableAd} codeid={adStore.codeid_feed_image_three} adWidth={Device.WIDTH} />
            {/* 推荐 */}
            <View style={{ marginTop: pixel(10) }}>
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
            <AutonomousModal
                style={[styles.modalWrap, { marginTop: topInset + portraitHeight }]}
                visible={introModalVisible}
                onToggleVisible={setIntroModalVisible}>
                {(visible, changeVisible) => {
                    return (
                        <View style={[styles.modalContainer, { flex: 1 }]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>简介</Text>
                                <DebouncedPressable
                                    style={styles.hideModalBtn}
                                    onPress={() => changeVisible(false)}
                                    activeOpacity={1}>
                                    <Iconfont name="guanbi1" size={font(20)} color={'#333'} />
                                </DebouncedPressable>
                            </View>
                            <MovieIntroduction movie={movie} />
                        </View>
                    );
                }}
            </AutonomousModal>
            <AutonomousModal
                style={[styles.modalWrap, { marginTop: topInset + portraitHeight }]}
                visible={episodeModalVisible}
                onToggleVisible={setEpisodeModalVisible}>
                {(visible, changeVisible) => {
                    return (
                        <View style={[styles.modalContainer, { flex: 1 }]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>选集</Text>
                                <DebouncedPressable
                                    style={styles.hideModalBtn}
                                    onPress={() => changeVisible(false)}
                                    activeOpacity={1}>
                                    <Iconfont name="guanbi1" size={font(20)} color={'#333'} />
                                </DebouncedPressable>
                            </View>
                            <MovieSeriesChooser seriesData={movie?.data} />
                        </View>
                    );
                }}
            </AutonomousModal>
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        paddingTop: pixel(14),
        paddingBottom: pixel(Theme.bottomInset) + pixel(20),
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
    uploaderWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: pixel(10),
    },
    uploader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    uploaderText: {
        fontSize: font(13),
        lineHeight: font(16),
        color: '#AEBCC4',
    },
    avatar: {
        width: pixel(20),
        height: pixel(20),
        borderRadius: pixel(10),
        marginRight: pixel(6),
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
    countComments: {
        fontSize: font(12),
        lineHeight: font(16),
        color: '#AEBCC4',
        marginLeft: pixel(2),
    },
    sectionWrap: {
        marginBottom: pixel(10),
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
    episodes: {
        paddingRight: pixel(14),
        marginLeft: pixel(14),
    },
    movieList: {
        paddingLeft: SPACE,
    },
    modalWrap: {
        flex: 1,
    },
    modalContainer: {
        width: Device.WIDTH,
        backgroundColor: '#fff',
    },
    modalHeader: {
        padding: pixel(20),
        paddingHorizontal: pixel(20),
        paddingVertical: pixel(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    modalTitle: {
        color: '#202020',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    hideModalBtn: {
        paddingHorizontal: pixel(10),
        marginRight: -pixel(20),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
});
