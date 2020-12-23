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
    const movie_id = route.params?.movie_id || Math.round(Math.random() * 10);
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.movieQuery, {
        variables: {
            movie_id: movie_id,
        },
    });
    const movie = useMemo(() => Helper.syncGetter('movie', data), [data]);

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
                        movie_id: movie.id,
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
        <View style={[styles.container, { paddingTop: topInset }]}>
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.backButton, { top: topInset }]}
                onPress={() => navigation.goBack()}>
                <Iconfont style={styles.backIcon} name="fanhui" size={font(18)} color={'#fff'} />
            </TouchableOpacity>
            <MoviePlayer movie={movie} onBeforeDestroy={saveWatchProgress} />
            <ScrollableTabView
                contentProps={{ keyboardShouldPersistTaps: 'always' }}
                style={{ flex: 1, backgroundColor: '#fff' }}
                renderTabBar={(props) => (
                    <ScrollTabBar
                        {...props}
                        tabWidth={pixel(60)}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#010101',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        width: pixel(40),
        height: Theme.NAVBAR_HEIGHT,
        paddingLeft: pixel(15),
        zIndex: 2,
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
        width: pixel(20),
        left: pixel(Theme.itemSpace) + pixel(5),
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
