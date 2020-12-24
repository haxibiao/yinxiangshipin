import React, { useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Animated } from 'react-native';
import { NavBarHeader, ScrollTabBar, FocusAwareStatusBar } from '@src/components';
import { observer, adStore, userStore } from '@src/store';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import FollowedPosts from './FollowedPosts';
import Collections from './Collections';
import RecommendPosts from './RecommendPosts';
import MovieCenter from '../../screens/movie';

export default observer(() => {
    const scrollTabRef = useRef();
    const navigation = useNavigation();
    const route = useRoute();
    const initPage = route?.params?.initPage;
    useEffect(() => {
        if (initPage && scrollTabRef.current?.goToPage) {
            scrollTabRef.current.goToPage(initPage);
            navigation.setParams({ initPage: 0 });
        }
    }, [initPage]);
    const goSearchCenter = useCallback(() => {
        navigation.navigate('Search');
    }, []);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" />
            <Image style={styles.headerBg} source={require('@app/assets/images/movie/bg_find_header.png')} />
            <ScrollableTabView
                contentProps={{ keyboardShouldPersistTaps: 'always' }}
                initialPage={0}
                ref={scrollTabRef}
                renderTabBar={(tabBarProps: any) => (
                    <ScrollTabBar
                        {...tabBarProps}
                        tabWidth={TAB_WIDTH}
                        tabBarStyle={styles.tabBarStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <MovieCenter tabLabel="影视" />
                <Collections tabLabel="合集" />
                <RecommendPosts tabLabel="精选" />
                <FollowedPosts tabLabel="动态" />
            </ScrollableTabView>
            <TouchableWithoutFeedback onPress={goSearchCenter}>
                <View style={styles.searchButton}>
                    <Image source={require('@app/assets/images/icons/ic_search_b.png')} style={styles.buttonIcon} />
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
});

const TAB_WIDTH = pixel(54);
const UNDER_LINE_WIDTH = pixel(12);
// const UNDER_LINE_LEFT = (Device.WIDTH - TAB_WIDTH * 4) / 2 + (TAB_WIDTH - UNDER_LINE_WIDTH) / 2;
const UNDER_LINE_LEFT = (TAB_WIDTH - UNDER_LINE_WIDTH) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Theme.statusBarHeight,
        backgroundColor: '#fff',
    },
    headerBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Device.WIDTH,
        height: (Device.WIDTH * 18) / 56,
    },
    taskButton: {
        position: 'absolute',
        top: Theme.statusBarHeight,
        right: pixel(20),
        width: pixel(50),
        height: Theme.NAVBAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    searchButton: {
        position: 'absolute',
        top: Theme.statusBarHeight,
        right: pixel(20),
        width: pixel(50),
        height: Theme.NAVBAR_HEIGHT,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    buttonIcon: {
        height: pixel(22),
        width: pixel(22),
        resizeMode: 'cover',
    },
    tabBarStyle: {
        height: Theme.NAVBAR_HEIGHT,
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
    },
    underlineStyle: {
        width: UNDER_LINE_WIDTH,
        height: pixel(3),
        left: UNDER_LINE_LEFT,
        bottom: pixel(5),
        backgroundColor: Theme.primaryColor,
    },
    activeTextStyle: {
        color: '#202020',
        fontSize: font(19),
        fontWeight: 'bold',
    },
    tintTextStyle: {
        color: '#525252',
        fontSize: font(16),
    },
});
