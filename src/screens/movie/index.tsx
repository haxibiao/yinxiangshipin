import React, { Component } from 'react';
import { View, Text, StyleSheet, AppRegistry, FlatList, ScrollView } from 'react-native';
import MovieSwiper from './components/MovieSwiper';
import ApplicationMenu from './components/ApplicationMenu';
import CategoryList from './components/CategoryList';
import MyFavorite from './components/MyFavorite';
import CategoryListColum from './components/CategoryListColum';

const index = () => {
    const categoryData = [
        {
            movieTitle: '寒战1',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://mahuapic.com/upload/vod/2020-01-14/15789346381.jpg',
            description: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            movieTitle: '寒战1',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://cdn-youku-com.diudie.com/app/image/image-5fad1ea94e2d30.19733746.jpg',
            description: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            movieTitle: '寒战1',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://mahuapic.com/upload/vod/2020-12-05/16071649900.jpg',
            description: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            movieTitle: '龙骑士',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://cdn-iqiyi-com.diudie.com/app/image/image-5fbdbf14b27073.21885558.jpg',
            description: '爱德华·斯皮伊尔斯,杰瑞米·艾恩斯,西耶娜·盖尔利',
        },
    ];
    const categoryData_three = [
        {
            movieTitle: '寒战1',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://mahuapic.com/upload/vod/2020-01-14/15789346381.jpg',
            description: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            movieTitle: '寒战2',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://cdn-youku-com.diudie.com/app/image/image-5fad1ea94e2d30.19733746.jpg',
            description: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
        {
            movieTitle: '寒战3',
            movieUrl: 'https://neihandianying.com/movie/52188',
            cover: 'https://mahuapic.com/upload/vod/2020-12-05/16071649900.jpg',
            description: '疯狂仙三大队撒平静的劈开,劈开了撒娇都是仿佛能看到失联飞机阿里斯顿啦什么',
        },
    ];
    const swiperData = [
        { cover: 'https://p2.ssl.qhimgs1.com/bdr/460__/t01ad0e9f6b314c4c52.jpg', description: '这是一首简单的小情歌~' },
        {
            cover: 'https://p5.ssl.qhimgs1.com/bdr/460__/t013d81a7107ae6c95f.jpg',
            description: '你像个人气高居不下的天后~',
        },
        {
            cover: 'https://p2.ssl.qhimgs1.com/bdr/460__/t0154d135d0cadd778c.jpg',
            description: '太多的、太重的、太伤心的话~',
        },
        {
            cover: 'https://p0.ssl.qhimgs1.com/bdr/460__/t01a3b565741a40064a.webp',
            description: '你想要的、我却不能够、给你我所有!',
        },
        // 'https://p3.ssl.qhimgs1.com/bdr/460__/t01c84d6ed1c7db21dd.webp',
        // 'https://p0.ssl.qhimgs1.com/bdr/460__/t01ef8b1b1ac9c7db96.webp',
        // 'https://p0.ssl.qhimgs1.com/bdr/460__/t014cac9bd90230a2e6.webp',
        // 'https://p2.ssl.qhimgs1.com/bdr/460__/t0146ad6054c6fa4a42.webp',
    ];
    const FavoriteData = [
        {
            title: '姜子牙',
            image: 'https://mahuapic.com/upload/vod/2020-10-03/16017027451.jpg',
            favoriteType: '独家',
            movieType: '会员专享',
        },
        {
            title: '近邻小王子',
            image: 'http://images.cnblogsc.com/pic/upload/vod/2019-09/15681978341.jpg',
            favoriteSeriesTime: '0.46.5',
            movieType: '免费看',
        },
        {
            title: '乌托邦',
            image: 'https://cdn-iqiyi-com.diudie.com/app/image/image-5fad28a94d43f3.83440744.jpg',
            favoriteType: '新系列开播',
            movieType: '超前点播',
        },
        {
            title: '这份爱是罪恶吗',
            image: 'https://cdn-xigua-com.diudie.com/app/image/image-5fb62fe62de6b8.87702995.jpg',
            favoriteSeriesTime: '0.46.5',
            movieType: '会员专享',
        },
        {
            title: '猫屎妈妈(粤语版)',
            image: 'https://cdn-v-qq-com.diudie.com/app/image/image-5fbdd05ade6351.37282826.jpg',
            favoriteSeriesTime: '0.46.5',
            movieType: '免费看',
        },
    ];
    return (
        <View style={styles.pageView}>
            {/* <FlatList /> */}
            <ScrollView
                contentContainerStyle={styles.page}
                style={styles.pageList}
                showsVerticalScrollIndicator={false}>
                {/* <View style={styles.page}>
                    
                </View> */}
                <MovieSwiper swiperDataList={swiperData} />
                <ApplicationMenu />
                <MyFavorite favoriteList={FavoriteData} />
                <CategoryList
                    categoryData={categoryData_three}
                    refetchMore={() => console.log(1)}
                    pageViewStyle={{ marginTop: pixel(-12) }}
                />
                <CategoryListColum
                    refetchMore={() => console.log(1)}
                    pageViewStyle={{ borderTopWidth: pixel(0) }}
                    categoryData={categoryData}
                    hasMore={true}
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
