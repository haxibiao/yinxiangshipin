import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Animated } from 'react-native';
import { NavBarHeader, ScrollTabBar, FocusAwareStatusBar } from '@src/components';
import { observer, adStore, userStore } from '@src/store';
import { useCirculationAnimation } from '@src/common';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import FollowedPosts from './FollowedPosts';
import Collections from './Collections';
import RecommendPosts from './RecommendPosts';

export default observer(() => {
    const navigation = useNavigation();
    const route = useRoute();
    const goSearchCenter = useCallback(() => {
        navigation.navigate('Search');
    }, []);
    const goTaskCenter = useCallback(() => {
        navigation.navigate(userStore.login ? 'TaskCenter' : 'Login');
    }, []);
    const animation = useCirculationAnimation({ duration: 3000, start: true });
    const scale = animation.interpolate({
        inputRange: [0, 0.1, 0.2, 0.3, 0.4, 1],
        outputRange: [1, 1.3, 1.1, 1.3, 1, 1],
    });
    // const rotate = animation.interpolate({
    //     inputRange: [0.4, 0.],
    //     outputRange: [1, 1.3, 1.1, 1.3, 1, 1],
    // });
    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" />
            <ScrollableTabView
                contentProps={{ keyboardShouldPersistTaps: 'always' }}
                initialPage={2}
                renderTabBar={(tabBarProps: any) => (
                    <ScrollTabBar
                        {...tabBarProps}
                        tabWidth={pixel(66)}
                        tabBarStyle={styles.tabBarStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <FollowedPosts tabLabel="关注" />
                <RecommendPosts tabLabel="推荐" />
                <Collections tabLabel="合集" />
            </ScrollableTabView>
            {adStore.enableWallet ? (
                <TouchableWithoutFeedback onPress={goTaskCenter}>
                    <View style={styles.taskButton}>
                        <Animated.Image
                            source={require('@app/assets/images/record_reward.png')}
                            style={[styles.buttonIcon, { transform: [{ scale }] }]}
                        />
                    </View>
                </TouchableWithoutFeedback>
            ) : (
                <TouchableWithoutFeedback onPress={goSearchCenter}>
                    <View style={styles.searchButton}>
                        <Image source={require('@app/assets/images/icons/ic_search_b.png')} style={styles.buttonIcon} />
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Theme.statusBarHeight,
        backgroundColor: '#fff',
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
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
        justifyContent: 'center',
    },
    underlineStyle: {
        width: pixel(26),
        height: pixel(3),
        left: (Device.WIDTH - pixel(66) * 3) / 2 + pixel(20),
        bottom: pixel(5),
    },
    activeTextStyle: {
        color: '#323232',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    tintTextStyle: {
        color: '#525252',
        fontSize: font(16),
    },
});
