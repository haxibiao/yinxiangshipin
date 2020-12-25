import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollTabBar, Iconfont, StatusView, SpinnerLoading, NavBarHeader } from '@src/components';
import { MoviePlayer, PlayerStore } from '@src/components/MoviePlayer';
import { useStatusBarHeight } from '@src/common';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { appStore, userStore } from '@src/store';
import VideoContent from './components/VideoContent';
import CommentContent from './components/CommentContent';

export default function MovieDetail() {
    const topInset = useStatusBarHeight();
    const navigation = useNavigation();
    const route = useRoute();
    const movieInfo = route.params?.movie || Math.round(Math.random() * 10);
    const history = route.params?.history || {
        series_index: movie?.last_watch_series,
        progress: movie?.last_watch_progress,
    };
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.movieQuery, {
        variables: {
            movie_id: movieInfo?.id,
        },
    });
    const movie = useMemo(() => data?.movie, [data]);

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

    const saveWatchProgress = useCallback(
        ({ index, progress }) => {
            if (userStore.login) {
                appStore.client.mutate({
                    mutation: GQL.saveWatchProgressMutation,
                    variables: {
                        movie,
                        series_index: index,
                        progress,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.showMovieHistoryQuery,
                        },
                    ],
                });
            }
        },
        [movie],
    );

    if (error) return <StatusView.ErrorView onPress={refetch} error={error} />;
    if (loading) return <SpinnerLoading />;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.backButton, { top: topInset + pixel(10) }]}
                onPress={() => navigation.goBack()}>
                <Iconfont style={styles.backIcon} name="fanhui" size={font(18)} color={'#fff'} />
            </TouchableOpacity>
            <MoviePlayer
                style={{ paddingTop: topInset }}
                movie={movie}
                history={history}
                onBeforeDestroy={saveWatchProgress}
            />
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
                <VideoContent tabLabel="视频" movie={movie} />
                <CommentContent tabLabel="讨论" movie={movie} />
            </ScrollableTabView>
        </View>
    );
}

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
