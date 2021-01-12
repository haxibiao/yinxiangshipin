import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BoxShadow } from 'react-native-shadow';
import { Iconfont, Avatar, FocusAwareStatusBar, SvgIcon, SvgPath } from '@src/components';
import { AutonomousModal } from '@src/components/modal';
import { ScrollTabView } from '@app/src/components/ScrollHeadTabView';
import { PostItem } from '@src/content';
import { observer, adStore, userStore, notificationStore } from '@src/store';
import { GQL, useMutation } from '@src/apollo';
import UserInfo from './components/UserInfo';
import PostQueryList from './components/PostQueryList';
import More from './components/More';

const NAV_BAR_HEIGHT = pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight);
const tabWidth = Device.WIDTH / 2;
const tabUnderlineWidth = pixel(20);
const shadowSetting = {
    width: Device.WIDTH,
    height: NAV_BAR_HEIGHT,
    color: '#E8E8E8',
    border: pixel(5),
    radius: pixel(15),
    opacity: 0.5,
    x: 0,
    y: 0,
};

export default observer(() => {
    const user = userStore.me;
    const navigation = useNavigation();
    const goToSearch = useCallback(() => {
        navigation.push('SearchVideo', {
            user_id: user.id,
        });
    }, []);

    const [headerHeight, setHeaderHeight] = useState(pixel(418));
    const headerOnLayout = useCallback((event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    }, []);

    const contentOffset = useRef(new Animated.Value(0)).current;
    const _onContentScroll = useCallback((e) => {
        contentOffset.setValue(e.value);
    }, []);
    const navBarOpacity = contentOffset.interpolate({
        inputRange: [0, NAV_BAR_HEIGHT / 10, NAV_BAR_HEIGHT],
        outputRange: [0, 0, 1],
    });
    const navBarScale = contentOffset.interpolate({
        inputRange: [0, NAV_BAR_HEIGHT / 10],
        outputRange: [0.1, 1],
        extrapolate: 'clamp',
    });
    const _renderNavBar = useCallback((): React.ReactElement => {
        return (
            <Animated.View style={[styles.navBarWrap, { opacity: navBarOpacity, transform: [{ scale: navBarScale }] }]}>
                <BoxShadow setting={shadowSetting}>
                    <View style={styles.navBarContainer}>
                        <View style={styles.navBarButton}></View>
                        <Animated.View style={styles.navBarTitle}>
                            <Text style={styles.userName} numberOfLines={1}>
                                个人主页
                            </Text>
                        </Animated.View>
                        <View style={styles.rightButtons}>
                            <Pressable style={styles.navBarButton} onPress={goToSearch}>
                                <SvgIcon name={SvgPath.search} size={font(22)} color={'#202020'} />
                            </Pressable>
                        </View>
                    </View>
                </BoxShadow>
            </Animated.View>
        );
    }, []);

    const _renderScrollHeader = useCallback(() => {
        return (
            <View onLayout={headerOnLayout}>
                <UserInfo isTopStack />
            </View>
        );
    }, []);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" />
            {_renderNavBar()}
            <ScrollTabView
                onContentScroll={_onContentScroll}
                insetValue={NAV_BAR_HEIGHT}
                headerHeight={headerHeight}
                renderScrollHeader={_renderScrollHeader}
                tabBarTabUnderlineWidth={pixel(24)}
                tabBarStyle={styles.tabBarStyle}>
                <PostQueryList
                    tabLabel="发布"
                    gqlDocument={GQL.userPostsQuery}
                    dataOptionChain="userPosts.data"
                    paginateOptionChain="userPosts.paginatorInfo"
                    options={{
                        variables: {
                            user_id: user.id,
                            filter: 'all',
                        },
                        fetchPolicy: 'network-only',
                    }}
                />
                <PostQueryList
                    tabLabel="喜欢"
                    gqlDocument={GQL.userLikedArticlesQuery}
                    dataOptionChain="likes.data"
                    paginateOptionChain="likes.paginatorInfo"
                    options={{
                        variables: {
                            user_id: user.id,
                        },
                        fetchPolicy: 'network-only',
                    }}
                    renderItem={({ item }) => {
                        return <PostItem data={item?.article} />;
                    }}
                />
                <PostQueryList
                    tabLabel="收藏"
                    gqlDocument={GQL.userPostsQuery}
                    dataOptionChain="userPosts.data"
                    paginateOptionChain="userPosts.paginatorInfo"
                    options={{
                        variables: {
                            user_id: user.id,
                            filter: 'spider',
                        },
                        fetchPolicy: 'network-only',
                    }}
                />
                <More user={user} tabLabel="更多" />
            </ScrollTabView>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Theme.BOTTOM_HEIGHT,
    },
    navBarWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        height: NAV_BAR_HEIGHT,
    },
    navBarContainer: {
        flex: 1,
        paddingTop: pixel(Theme.statusBarHeight),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    rightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navBarButton: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: pixel(12),
    },
    navBarTitle: {
        position: 'absolute',
        top: pixel(Theme.statusBarHeight),
        bottom: 0,
        left: pixel(100),
        right: pixel(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        color: '#202020',
        fontSize: font(17),
    },
    tabBarStyle: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: 0,
        backgroundColor: '#fff',
    },
});
