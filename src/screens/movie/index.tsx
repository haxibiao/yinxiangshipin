import React, { Component } from 'react';
import { View, Text, StyleSheet, AppRegistry, FlatList, ScrollView } from 'react-native';
import MovieSwiper from './components/MovieSwiper';
import ApplicationMenu from './components/ApplicationMenu';
import CategoryList from './components/CategoryList';

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
    return (
        <View style={styles.pageView}>
            {/* <FlatList /> */}
            <ScrollView
                contentContainerStyle={styles.page}
                style={styles.pageList}
                showsVerticalScrollIndicator={false}>
                {/* <View style={styles.page}>
                    
                </View> */}
                <MovieSwiper />
                <ApplicationMenu />
                <CategoryList pageViewStyle={{ marginTop: pixel(-12) }} />
                <CategoryList
                    pageViewStyle={{ borderTopWidth: pixel(0) }}
                    pageColum={true}
                    categoryData={categoryData}
                    hasMore={true}
                />
                <CategoryList pageViewStyle={{ borderTopWidth: pixel(0) }} />
                <CategoryList
                    pageViewStyle={{ borderTopWidth: pixel(0) }}
                    pageColum={true}
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
