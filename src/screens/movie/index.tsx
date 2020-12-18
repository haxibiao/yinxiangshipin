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
    console.log('mayLikeData', mayLikeData, mayLikeList);

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
    const categoryData = [
        {
            name: '寒战1',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://mahuapic.com/upload/vod/2020-01-14/15789346381.jpg',
            introduction: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            name: '寒战1',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://cdn-youku-com.diudie.com/app/image/image-5fad1ea94e2d30.19733746.jpg',
            introduction: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            name: '寒战1',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://mahuapic.com/upload/vod/2020-12-05/16071649900.jpg',
            introduction: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            name: '龙骑士',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://cdn-iqiyi-com.diudie.com/app/image/image-5fbdbf14b27073.21885558.jpg',
            introduction: '爱德华·斯皮伊尔斯,杰瑞米·艾恩斯,西耶娜·盖尔利',
        },
    ];
    const categoryData_three = [
        {
            name: '寒战1',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://mahuapic.com/upload/vod/2020-01-14/15789346381.jpg',
            introduction: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            name: '寒战2',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://cdn-youku-com.diudie.com/app/image/image-5fad1ea94e2d30.19733746.jpg',
            introduction: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            name: '寒战3',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://mahuapic.com/upload/vod/2020-12-05/16071649900.jpg',
            introduction: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
    ];
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
                    {/* <View style={styles.page}>

                </View> */}
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
                    <CategoryListColum
                        refetchMore={() => console.log(1)}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                        categoryData={categoryData}
                        hasMore={true}
                        moduleTitle="2333"
                        // checkStyleName="2333爱看"
                        // checkNameColor="gold"
                    />
                    <CategoryList
                        categoryData={categoryData_three}
                        refetchMore={() => console.log(1)}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                        moduleTitle="家有儿女"
                        hasMore={true}
                        checkStyleName="2333爱看"
                        checkNameColor="gold"
                    />
                    <CategoryListColum
                        refetchMore={() => console.log(1)}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                        categoryData={categoryData}
                        hasMore={true}
                        moduleTitle="2333"
                    />
                    <CategoryList
                        categoryData={categoryData_three}
                        refetchMore={() => console.log(1)}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                    />
                    <CategoryListColum
                        refetchMore={() => console.log(1)}
                        pageViewStyle={{ borderTopWidth: pixel(0) }}
                        categoryData={categoryData}
                    />
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
