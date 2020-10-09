import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavBarHeader, Avatar, Badge, Row, SafeText, StatusView, FocusAwareStatusBar } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { observer, userStore, appStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import Chats from './components/Chats';

const notifyTypes = ['unread_comments', 'unread_likes', 'unread_follows', 'unread_others', 'unread_chat'];

export default observer((props: any) => {
    const navigation = useNavigation();
    const isLogin = Helper.syncGetter('login', userStore);
    const user = Helper.syncGetter('me', userStore);
    const userId = Helper.syncGetter('id', user);

    const { data: notifyData, refetch: fetchUnreadQuery } = useQuery(GQL.unreadsQuery, {
        fetchPolicy: 'network-only',
    });

    const { data: chatsData, refetch: fetchChatsQuery, loading } = useQuery(GQL.chatsQuery, {
        fetchPolicy: 'network-only',
        variables: { user_id: userId },
        skip: !userId,
    });

    const unreadNotify = useMemo(() => Helper.syncGetter('me', notifyData) || {}, [notifyData, userStore.login]);
    const chats = useMemo(() => (userStore.login ? Helper.syncGetter('chats.data', chatsData) : null), [
        chatsData,
        userStore.login,
    ]);
    appStore.unreadMessages = useMemo(() => {
        let count = 0;
        if (unreadNotify) {
            notifyTypes.forEach((type) => {
                if (unreadNotify.hasOwnProperty(type)) {
                    count += unreadNotify[type];
                }
            });
        }
        return count;
    }, [unreadNotify]);

    useEffect(() => {
        if (userId) {
            const navBlurListener = props.navigation.addListener('focus', (payload) => {
                fetchUnreadQuery && fetchUnreadQuery();
                fetchChatsQuery && fetchChatsQuery();
            });
            return () => {
                navBlurListener();
            };
        }
    }, [userId, fetchUnreadQuery, fetchChatsQuery]);

    const authNavigator = useCallback(
        (route, params) => {
            if (isLogin) {
                navigation.navigate(route, params);
            } else {
                navigation.navigate('Login');
            }
        },
        [isLogin],
    );

    const PageFooter = useMemo(() => {
        if (Array.isArray(chats)) {
            if (chats.length < 1) {
                return (
                    <StatusView.EmptyView
                        title="若不寻人聊，只能待佳音"
                        imageSource={require('@app/assets/images/default_chat.png')}
                    />
                );
            }

            return (
                <View style={styles.footerView}>
                    <Text style={styles.footerViewText}>--end--</Text>
                </View>
            );
        } else if (!loading) {
            return (
                <StatusView.EmptyView
                    title="加入我们，认识更多小伙伴吧"
                    imageSource={require('@app/assets/images/default_chat.png')}
                />
            );
        }
    }, [chats, loading]);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" />
            <NavBarHeader
                title="消息"
                centerStyle={{ marginHorizontal: pixel(12), justifyContent: 'flex-start' }}
                titleStyle={{ fontSize: font(18) }}
                hasGoBackButton={false}
            />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.notifyList}>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => authNavigator('CommentNotification', { user })}>
                        <Image
                            style={styles.notifyIcon}
                            source={require('@app/assets/images/icons/ic_message_comment.png')}
                        />
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>评论</SafeText>
                        </View>
                        <View style={styles.pstBadge}>
                            <Badge count={unreadNotify.unread_comments} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => authNavigator('BeLikedNotification', { user })}>
                        <Image
                            style={styles.notifyIcon}
                            source={require('@app/assets/images/icons/ic_message_like.png')}
                        />
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>点赞</SafeText>
                        </View>
                        <View style={styles.pstBadge}>
                            <Badge count={unreadNotify.unread_likes} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => authNavigator('FollowNotification', { user })}>
                        <Image
                            style={styles.notifyIcon}
                            source={require('@app/assets/images/icons/ic_message_follower.png')}
                        />
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>粉丝</SafeText>
                        </View>
                        <View style={styles.pstBadge}>
                            <Badge count={unreadNotify.unread_follows} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => authNavigator('OtherRemindNotification', { user })}>
                        <Image
                            style={styles.notifyIcon}
                            source={require('@app/assets/images/icons/ic_message_notify.png')}
                        />
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>通知</SafeText>
                        </View>
                        <View style={styles.pstBadge}>
                            <Badge count={unreadNotify.unread_others} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Chats chats={chats} />
                {PageFooter}
            </ScrollView>
        </View>
    );
});

/* <StatusView.EmptyView
    title="若不寻人聊，只能待佳音"
    imageSource={require('@app/assets/images/default_chat.png')}
/> */

/* <StatusView.EmptyView
    title="加入我们，认识更多小伙伴吧"
    imageSource={require('@app/assets/images/default_chat.png')}
/>; */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        backgroundColor: Theme.groundColour,
        flexGrow: 1,
        paddingBottom: pixel(Theme.BOTTOM_HEIGHT),
    },
    notifyList: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f4f4f4',
    },
    notifyItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'column',
        padding: pixel(Theme.itemSpace),
    },
    notifyIcon: {
        width: pixel(42),
        height: pixel(42),
    },
    itemContent: {
        marginTop: pixel(10),
    },
    pstBadge: {
        position: 'absolute',
        top: pixel(8),
        right: pixel(10),
    },
    itemName: {
        color: Theme.defaultTextColor,
        fontSize: font(14),
    },
    footerView: {
        alignItems: 'center',
        flexDirection: 'row',
        height: pixel(40),
        justifyContent: 'center',
    },
    footerViewText: {
        color: '#a0a0a0',
        fontSize: font(14),
    },
});
