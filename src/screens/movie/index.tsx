import React, { useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { FocusAwareStatusBar } from '@src/components';
import { observer, adStore } from '@src/store';
import CategoryMenu from './parts/CategoryMenu';
import MoviesPoster from './parts/MoviesPoster';
import MovieFollows from './parts/MovieFollows';
import MovieRecommend from './parts/MovieRecommend';
import MovieCategory from './parts/MovieCategory';

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
            <MovieCategory type="HAN" categoryName="精选韩剧" />
            <MovieCategory type="RI" categoryName="精选日剧" />
            <MovieCategory type="GANG" categoryName="怀旧港剧" />
        </ScrollView>
    );
});

const MENU_WIDTH = (Device.WIDTH - pixel(80)) / 5;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.BOTTOM_HEIGHT,
        backgroundColor: '#ffffff',
    },
    topSection: {
        paddingVertical: pixel(14),
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    menuList: {
        marginTop: pixel(14),
        paddingRight: pixel(14),
    },
    menuItem: {
        alignItems: 'center',
        marginRight: pixel(10),
    },
    menuIcon: {
        width: MENU_WIDTH,
        height: MENU_WIDTH * 0.7,
        borderRadius: MENU_WIDTH * 0.35,
        backgroundColor: '#FFE7E3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuName: {
        marginTop: pixel(4),
        fontSize: font(12),
        color: '#909090',
    },
});
