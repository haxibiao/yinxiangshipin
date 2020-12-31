import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollTabBar, Iconfont, FocusAwareStatusBar } from '@src/components';
import { MoviePlayer, PlayerStore } from '@src/components/MoviePlayer';
import { observer, appStore, userStore } from '@src/store';
import { GQL, useQuery } from '@src/apollo';
import { useStatusBarHeight } from '@src/common';
import VideoSection from './components/VideoSection';
import CommentSection from './components/CommentSection';

export default observer(() => {
    const topInset = useStatusBarHeight();
    const navigation = useNavigation();
    const route = useRoute();
    const movieInfo = route.params?.movie;
    const { loading, error, data, refetch } = useQuery(GQL.movieQuery, {
        variables: {
            movie_id: movieInfo?.id,
        },
        fetchPolicy: 'network-only',
    });
    const movie = useMemo(() => data?.movie, [data?.movie]);
    const saveWatchProgress = useCallback(
        ({ index, progress }) => {
            if (userStore.login) {
                appStore.client.mutate({
                    mutation: GQL.saveWatchProgressMutation,
                    variables: {
                        movie_id: movieInfo?.id,
                        series_index: index,
                        progress,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.showMovieHistoryQuery,
                            fetchPolicy: 'network-only',
                        },
                        {
                            query: GQL.favoritedMoviesQuery,
                            variables: { user_id: userStore.me.id, type: 'movies' },
                            fetchPolicy: 'network-only',
                        },
                    ],
                });
            }
        },
        [movieInfo?.id],
    );

    // 视频播放处理
    useEffect(() => {
        const navWillFocusListener = navigation.addListener('focus', () => {
            PlayerStore.paused = false;
        });
        const navWillBlurListener = navigation.addListener('blur', () => {
            PlayerStore.paused = true;
        });
        return () => {
            navWillFocusListener();
            navWillBlurListener();
        };
    }, []);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            {!PlayerStore.fullscreen && (
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.backButton, { top: topInset + pixel(10) }]}
                    onPress={() => navigation.goBack()}>
                    <Iconfont style={styles.backIcon} name="fanhui" size={font(18)} color={'#ffffffee'} />
                </TouchableOpacity>
            )}
            <MoviePlayer movie={movie} onBeforeDestroy={saveWatchProgress} style={{ paddingTop: topInset }} />
            {!loading && (
                <ScrollableTabView
                    contentProps={{ keyboardShouldPersistTaps: 'always' }}
                    style={{ flex: 1, backgroundColor: '#fff' }}
                    renderTabBar={(props) => (
                        <ScrollTabBar
                            {...props}
                            tabWidth={TAB_WIDTH}
                            style={styles.tabBarStyle}
                            tabStyle={styles.tabStyle}
                            underlineStyle={styles.underlineStyle}
                            activeTextStyle={styles.activeTextStyle}
                            tintTextStyle={styles.tintTextStyle}
                        />
                    )}>
                    <VideoSection tabLabel="视频" movie={movie} />
                    <CommentSection tabLabel="讨论" movie={movie} />
                </ScrollableTabView>
            )}
        </View>
    );
});

const TAB_WIDTH = pixel(58);
const UNDER_LINE_WIDTH = pixel(12);
const UNDER_LINE_LEFT = (TAB_WIDTH - UNDER_LINE_WIDTH) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        width: pixel(40),
        height: Theme.NAVBAR_HEIGHT,
        paddingLeft: pixel(15),
        zIndex: 1,
    },
    backIcon: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
    },
    tabBarStyle: {
        height: pixel(42),
        paddingHorizontal: pixel(Theme.itemSpace),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
    },
    tabStyle: {
        alignItems: 'flex-start',
    },
    underlineStyle: {
        width: UNDER_LINE_WIDTH,
        height: pixel(3),
        left: UNDER_LINE_LEFT,
        bottom: pixel(5),
        backgroundColor: Theme.primaryColor,
    },
    activeTextStyle: {
        color: '#212121',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    tintTextStyle: {
        color: '#666',
        fontSize: font(16),
    },
});
