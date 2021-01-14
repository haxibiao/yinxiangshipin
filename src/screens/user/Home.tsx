import React, { useState, useMemo, useCallback, useRef } from 'react';
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
import ScrollQueryList from './components/ScrollQueryList';
import FavoritesPost from './components/FavoritesPost';
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
    const route = useRoute();
    const navigation = useNavigation();
    const user = route.params?.user || userStore.me;
    const isSelf = useMemo(() => userStore.me.id === user.id, [userStore.me.id, user]);

    const [modalVisible, setModalVisible] = useState(false);
    const [addUserBlock] = useMutation(GQL.addUserBlockMutation, {
        variables: {
            id: user.id,
        },
        refetchQueries: () => [
            {
                query: GQL.publicPostsQuery,
                fetchPolicy: 'network-only',
            },
        ],
        onCompleted: () => {
            Toast.show({ content: '拉黑成功，系统将屏蔽此用户的内容！' });
        },
        onError: () => {
            Toast.show({ content: errorMessage(error) });
        },
    });

    const addUserBlockHandler = useCallback(() => {
        setModalVisible(true);
        if (userStore.login) {
            addUserBlock();
        } else {
            navigation.navigate('Login');
        }
    }, [addUserBlock]);

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
                        <Pressable
                            style={styles.navBarButton}
                            onPress={() => {
                                navigation.goBack();
                            }}>
                            <Iconfont name="fanhui" color={'#202020'} size={font(21)} />
                        </Pressable>
                        <Animated.View style={styles.navBarTitle}>
                            <Text style={styles.userName} numberOfLines={1}>
                                {user?.name}
                            </Text>
                        </Animated.View>
                        <View style={styles.rightButtons}>
                            {isSelf ? (
                                <Pressable style={styles.navBarButton} onPress={goToSearch}>
                                    <SvgIcon name={SvgPath.search} size={font(22)} color={'#202020'} />
                                </Pressable>
                            ) : (
                                <Pressable style={styles.navBarButton} onPress={() => setModalVisible(true)}>
                                    <Iconfont name="daohanggengduoanzhuo" size={font(22)} color={'#202020'} />
                                </Pressable>
                            )}
                        </View>
                    </View>
                </BoxShadow>
            </Animated.View>
        );
    }, []);

    const _renderScrollHeader = useCallback(() => {
        return (
            <View onLayout={headerOnLayout}>
                <UserInfo user={user} operateHandler={() => setModalVisible(true)} />
            </View>
        );
    }, [user]);

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
                <ScrollQueryList
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
                    renderItem={({ item }) => {
                        return <PostItem data={item} />;
                    }}
                />
                <ScrollQueryList
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
                {isSelf && <FavoritesPost tabLabel="收藏" user={user} />}
                <More tabLabel="更多" user={user} />
            </ScrollTabView>
            <AutonomousModal visible={modalVisible} onToggleVisible={setModalVisible} style={styles.modalContainer}>
                {(visible, changeVisible) => {
                    return (
                        <View style={styles.modalBody}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{user.name}</Text>
                                <Text style={styles.modalSubText} numberOfLines={2}>
                                    {user.description || '这个人很懒，一点介绍都没留下'}
                                </Text>
                            </View>
                            <Pressable style={styles.actionItem} onPress={addUserBlockHandler}>
                                <Text style={styles.actionName}>拉黑</Text>
                            </Pressable>
                            <Pressable
                                style={styles.actionItem}
                                onPress={() => {
                                    changeVisible(false);
                                    notificationStore.sendReportNotice({ target: user, type: 'user' });
                                }}>
                                <Text style={styles.actionName}>举报</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.actionItem, styles.actionCloseItem]}
                                onPress={() => changeVisible(false)}>
                                <Text style={styles.actionName}>取消</Text>
                            </Pressable>
                        </View>
                    );
                }}
            </AutonomousModal>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
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
    modalContainer: {
        justifyContent: 'flex-end',
    },
    modalBody: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(10),
        borderTopRightRadius: pixel(10),
    },
    modalHeader: {
        padding: pixel(25),
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#212121',
        fontSize: font(20),
        fontWeight: 'bold',
    },
    modalSubText: {
        color: '#b2b2b2',
        fontSize: font(12),
        marginTop: pixel(4),
    },
    actionItem: {
        paddingVertical: pixel(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    actionCloseItem: {
        borderTopWidth: pixel(8),
        borderColor: '#eee',
    },
    actionName: {
        color: '#212121',
        fontSize: font(16),
    },
});
