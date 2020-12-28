import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import { observer, appStore, userStore } from '@src/store';
import { NavBarHeader, ScrollTabBar } from '@src/components';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation } from '@react-navigation/native';
import RecommendVideos from './RecommendVideos';
import EnshrinedVideos from './EnshrinedVideos';
import FriendShipVideos from './FriendShipVideos';

export default observer(({}) => {
    const navigation = useNavigation();
    const currentPage = useRef(1);
    const visibility = useRef(false);
    const onChangeTab = useCallback((e) => {
        currentPage.current = e.i;
        DeviceEventEmitter.emit('onChangeVideoTab', visibility.current ? currentPage.current : -1);
    }, []);

    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        appStore.viewportHeight = height;
    }, []);

    // 视频播放事件处理
    useEffect(() => {
        // 监听视频分栏切换，暂停/播放视频
        const navWillFocusListener = navigation.addListener('focus', () => {
            visibility.current = true;
            DeviceEventEmitter.emit('onChangeVideoTab', currentPage.current);
        });
        const navWillBlurListener = navigation.addListener('blur', () => {
            visibility.current = false;
            DeviceEventEmitter.emit('onChangeVideoTab', -1);
        });
        return () => {
            navWillFocusListener();
            navWillBlurListener();
        };
    }, []);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <ScrollableTabView
                contentProps={{ keyboardShouldPersistTaps: 'always' }}
                tabBarPosition="overlayTop"
                initialPage={1}
                onChangeTab={onChangeTab}
                renderTabBar={(tabBarProps: any) => (
                    <ScrollTabBar
                        {...tabBarProps}
                        tabWidth={pixel(74)}
                        tabBarStyle={styles.tabBarStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <EnshrinedVideos tabLabel="收藏" page={0} />
                <RecommendVideos tabLabel="推荐" page={1} />
                <FriendShipVideos tabLabel="关注" page={2} />
            </ScrollableTabView>
            <NavBarHeader
                navBarStyle={styles.navBarStyle}
                hasGoBackButton={false}
                isTransparent={true}
                hasSearchButton={true}
                StatusBarProps={{ barStyle: 'light-content' }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: pixel(60),
    },
    tabBarStyle: {
        width: '100%',
        height: pixel(42),
        paddingHorizontal: pixel(42),
        marginTop: Theme.statusBarHeight,
        borderWidth: 0,
        justifyContent: 'center',
    },
    underlineStyle: {
        width: pixel(24),
        left: (Device.WIDTH - pixel(74) * 3) / 2 + pixel(25),
        marginBottom: pixel(4),
        backgroundColor: '#fff',
    },
    activeTextStyle: {
        color: '#ffffff',
        fontSize: font(19),
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
    },
    tintTextStyle: {
        color: '#ddd',
        fontSize: font(19),
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
    },
});
