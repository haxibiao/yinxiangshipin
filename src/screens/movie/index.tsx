import React, { Component, useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, AppRegistry, FlatList, ScrollView } from 'react-native';
import MovieSwiper from './components/MovieSwiper';
import ApplicationMenu from './components/ApplicationMenu';
import CategoryList from './components/CategoryList';
import MyFavorite from './components/MyFavorite';
import CategoryListColum from './components/CategoryListColum';
import { GQL, useQuery, useMutation } from '@src/apollo';
import { userStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';

const index = () => {
    const navigation = useNavigation();
    const route = useRoute();
    // 轮播图接口
    const { data: swiperData, refetch: swiperRefetch, fetchMore: swiperFetchMore, loading: swiperLoading } = useQuery(
        GQL.movieSwiper,
        {
            fetchPolicy: 'network-only',
        },
    );
    const swiperList = useMemo(() => Helper.syncGetter('activities.data', swiperData), [swiperData]);
    // 我的收藏接口
    const {
        data: favoriteData,
        fetchMore: favoriteFetch,
        refetch: favoriteRefetch,
        loading: favoriteLoading,
    } = useQuery(GQL.favoritedMoviesQuery, {
        fetchPolicy: 'network-only',
        variables: { user_id: userStore.me.id, type: 'movies' },
    });
    const favoriteList = useMemo(() => Helper.syncGetter('myFavorite.data', favoriteData), [favoriteData]);
    const currentPage = useMemo(() => Helper.syncGetter('myFavorite.paginatorInfo.currentPage', favoriteData), [
        favoriteData,
    ]);
    const hasMoreFavorite = useMemo(() => Helper.syncGetter('myFavorite.paginatorInfo.hasMorePages', favoriteData), [
        favoriteData,
    ]);
    const onEndReached = useCallback(() => {
        if (hasMoreFavorite && favoriteLoading) {
            favoriteFetch({
                fetchPolicy: 'network-only',
                variables: {
                    user_id: userStore.me.id,
                    type: 'movies',
                    // count: 5,
                    page: currentPage + 1,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (fetchMoreResult && fetchMoreResult.myFavorite) {
                        return Object.assign({}, prev, {
                            myFavorite: Object.assign({}, prev.myFavorite, {
                                paginatorInfo: fetchMoreResult.myFavorite.paginatorInfo,
                                data: [...prev.myFavorite.data, ...fetchMoreResult.myFavorite.data],
                            }),
                        });
                    }
                },
            });
        }
    }, [hasMoreFavorite, currentPage]);

    // 猜你喜欢的接口
    const { data: mayLikeData, fetchMore: mayLikeFetch, refetch: mayLikeRefetch, loading: mayLikeLoading } = useQuery(
        GQL.recommendMovieQuery,
        {
            variables: { count: 4 },
            fetchPolicy: 'network-only',
        },
    );
    const mayLikeList = useMemo(() => Helper.syncGetter('recommendMovie', mayLikeData), [mayLikeData]);

    // 分类列表,热门分类
    // 韩剧
    const { data: hanJuData, fetchMore: hanJuFetchMore, refetch: hanJuRefetch, loading: hanJuLoading } = useQuery(
        GQL.categoryMovieQuery,
        {
            fetchPolicy: 'network-only',
            variables: { region: 'HAN', count: 3 },
        },
    );
    const hanJuList = useMemo(() => Helper.syncGetter('categoryMovie.data', hanJuData), [hanJuData]);
    // 美剧
    const { data: meiJuData, fetchMore: meiJuFetchMore, refetch: meiJuRefetch, loading: meiJuLoading } = useQuery(
        GQL.categoryMovieQuery,
        {
            fetchPolicy: 'network-only',
            variables: { region: 'MEI', count: 3 },
        },
    );
    const meiJuList = useMemo(() => Helper.syncGetter('categoryMovie.data', meiJuData), [meiJuData]);
    // 日剧
    const { data: riJuData, fetchMore: riJuFetchMore, refetch: riJuRefetch, loading: riJuLoading } = useQuery(
        GQL.categoryMovieQuery,
        {
            fetchPolicy: 'network-only',
            variables: { region: 'RI', count: 3 },
        },
    );
    const riJuList = useMemo(() => Helper.syncGetter('categoryMovie.data', riJuData), [riJuData]);
    // 港剧
    const { data: gangJuData, fetchMore: gangJuFetchMore, refetch: gangJuRefetch, loading: gangJuLoading } = useQuery(
        GQL.categoryMovieQuery,
        {
            fetchPolicy: 'network-only',
            variables: { region: 'GANG', count: 3 },
        },
    );
    const gangJuList = useMemo(() => Helper.syncGetter('categoryMovie.data', gangJuData), [gangJuData]);

    // 轮播图接口跳转
    const swiperToMovie = useCallback((movie_id) => {
        navigation.navigate('MovieDetail', { movie_id });
    }, []);
    // 我的收藏接口跳转
    const favoriteToMovie = useCallback((movie_id) => {
        navigation.navigate('MovieDetail', { movie_id });
    }, []);
    const navigationHandle = useCallback((movie_id) => {
        navigation.navigate('MovieDetail', { movie_id });
    }, []);
    // 我的全部收藏页面跳转
    const favoriteMovieAll = useCallback(() => {
        console.log(1);
    }, []);
    // 首页推荐
    const { data: ApplicationResult } = useQuery(GQL.getFiltersQuery, {
        fetchPolicy: 'network-only',
    });
    const ApplicationData = useMemo(() => Helper.syncGetter('getFilters', ApplicationResult), [ApplicationResult]);
    return (
        !swiperLoading &&
        !favoriteLoading && (
            <View style={styles.pageView}>
                {/* <FlatList /> */}
                <ScrollView
                    contentContainerStyle={styles.page}
                    style={styles.pageList}
                    showsVerticalScrollIndicator={false}>
                    <MovieSwiper swiperDataList={swiperList} swiperToMovie={swiperToMovie} />
                    <ApplicationMenu navigation={navigation} data={ApplicationData} />
                    <MyFavorite
                        favoriteList={favoriteList}
                        favoriteToMovie={favoriteToMovie}
                        refetch={favoriteRefetch}
                        hasMorePage={hasMoreFavorite}
                        checkMore={favoriteMovieAll}
                    />
                    <CategoryListColum
                        refetchMore={mayLikeRefetch}
                        pageViewStyle={{ borderTopWidth: pixel(0.5), marginTop: -pixel(12) }}
                        categoryData={mayLikeList}
                        hasMore={false}
                        moduleTitle="猜你喜欢"
                        navigationItem={navigationHandle}
                    />
                    <CategoryList
                        categoryData={hanJuList}
                        refetchMore={hanJuRefetch}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                        moduleTitle="热门韩剧"
                        hasMore={true}
                        checkStyleName="更多韩剧"
                        checkNameColor="pink"
                    />
                    <CategoryList
                        categoryData={meiJuList}
                        refetchMore={meiJuRefetch}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                        moduleTitle="热门美剧"
                        hasMore={true}
                        checkStyleName="更多美剧"
                        checkNameColor="#FF409F"
                    />
                    <CategoryList
                        categoryData={riJuList}
                        refetchMore={riJuRefetch}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                        moduleTitle="热门日剧"
                        hasMore={true}
                        checkStyleName="更多日剧"
                        checkNameColor="#FF40FF"
                    />
                    <CategoryList
                        categoryData={gangJuList}
                        refetchMore={gangJuRefetch}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                        moduleTitle="热门港剧"
                        hasMore={true}
                        checkStyleName="更多港剧"
                        checkNameColor="gold"
                    />
                    <Text style={{ marginTop: pixel(12), color: '#c7c7c7' }}>底都被你看光了~</Text>
                </ScrollView>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    pageView: {
        flex: 1,
    },
    pageList: {
        // flexGrow: 1,
    },
    page: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: pixel(75),
    },
});

export default index;
