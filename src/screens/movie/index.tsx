import React, { useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { FocusAwareStatusBar } from '@src/components';
import { observer, adStore } from '@src/store';
import CategoryMenu from './parts/CategoryMenu';
import MoviesPoster from './parts/MoviesPoster';
import MovieFollows from './parts/MovieFollows';
import MovieRecommend from './parts/MovieRecommend';
import MovieCategory from './parts/MovieCategory';
import MovieNarration from './parts/MovieNarration';
import { ad } from 'react-native-ad';

export default observer(() => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" />
            <View style={styles.topSection}>
                <MoviesPoster />
                <CategoryMenu />
            </View>
            <MovieFollows />
            <MovieRecommend categoryName="今日推荐" />
            <MovieCategory type="MEI" categoryName="热门美剧" />
            <ad.Feed visible={adStore.enableAd} codeid={adStore.codeid_feed_image_three} adWidth={Device.width} />
            <MovieCategory type="HAN" categoryName="精选韩剧" />
            <MovieNarration />
            <MovieCategory type="RI" categoryName="精选日剧" />
            <MovieCategory type="GANG" categoryName="怀旧港剧" />
            <ad.Feed visible={adStore.enableAd} codeid={adStore.codeid_feed_video} adWidth={Device.width} />
            <View style={styles.footer}>
                <Text style={styles.footerContent}>╰(๑•́₃ •̀๑)╯再往下就没有啦</Text>
            </View>
        </ScrollView>
    );
});

const MENU_WIDTH = (Device.width - pixel(80)) / 5;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Device.tabBarHeight,
        backgroundColor: '#ffffff',
    },
    topSection: {
        paddingVertical: pixel(14),
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    footer: {
        marginTop: pixel(-2),
        paddingVertical: pixel(14),
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    footerContent: {
        fontSize: font(12),
        color: '#909090',
    },
});
