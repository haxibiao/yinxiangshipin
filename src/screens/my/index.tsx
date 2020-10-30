import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer, adStore, userStore, notificationStore } from '@src/store';
import { PageContainer, Iconfont, Row, Avatar, SafeText, FocusAwareStatusBar, Badge } from '@src/components';
import { GQL, useQuery, useApolloClient } from '@src/apollo';

export default observer((props: any) => {
    const client = useApolloClient();
    const navigation = useNavigation();
    // 个人信息
    const { data } = useQuery(GQL.MeMetaQuery, {
        fetchPolicy: 'network-only',
        skip: !userStore.login,
    });
    const userProfile = useMemo(() => Object.assign({}, userStore.me, data?.me), [data]);

    const authNavigator = useCallback(
        (route, params?) => {
            if (userStore.login) {
                navigation.navigate(route, params);
            } else {
                navigation.navigate('Login');
            }
        },
        [userStore.login],
    );

    // useEffect(() => {
    //     const navFocusListener = navigation.addListener('focus', () => {
    //         if (userStore.login) {
    //             refetch();
    //         }
    //     });

    //     return () => {
    //         navFocusListener();
    //     };
    // }, [refetch]);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <View style={styles.parallaxHeader}>
                <Image
                    style={styles.parallaxHeaderBg}
                    source={require('@app/assets/images/default/user_detail_bg.jpg')}
                />
            </View>
            <TouchableOpacity
                style={styles.positionSetting}
                onPress={() => authNavigator('Setting', { user: userProfile })}>
                <Iconfont name="shezhi1" size={font(22)} color="#fff" />
            </TouchableOpacity>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                bounces={false}
                showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={() => authNavigator('User', { user: userProfile })}>
                    <View style={styles.profileContainer}>
                        <View style={styles.userInfo}>
                            <Avatar
                                source={userProfile.avatar || require('@app/assets/images/default_avatar.png')}
                                style={styles.userAvatar}
                            />
                            <View>
                                <SafeText style={styles.userName} numberOfLines={1}>
                                    {userStore.login ? userProfile.name : '登录/注册'}
                                </SafeText>
                                <Text style={styles.userIntroduction} numberOfLines={1}>
                                    {userStore.login
                                        ? userProfile.introduction || '这个人很懒，啥都没留下'
                                        : '欢迎来到' + Config.AppName}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.metaWrap}>
                            <TouchableOpacity
                                onPress={() => authNavigator('Works', { user: userProfile })}
                                activeOpacity={1}
                                style={styles.metaItem}>
                                <Text style={styles.metaName} numberOfLines={1}>
                                    发布
                                </Text>
                                <SafeText style={styles.metaCount} numberOfLines={1}>
                                    {Helper.count(userProfile.count_articles)}
                                </SafeText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => authNavigator('Society', { user: userProfile })}
                                activeOpacity={1}
                                style={styles.metaItem}>
                                <Text style={styles.metaName} numberOfLines={1}>
                                    关注
                                </Text>
                                <SafeText style={styles.metaCount} numberOfLines={1}>
                                    {Helper.count(userProfile.count_followings)}
                                </SafeText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => authNavigator('Society', { user: userProfile, follower: true })}
                                activeOpacity={1}
                                style={styles.metaItem}>
                                <Text style={styles.metaName} numberOfLines={1}>
                                    粉丝
                                </Text>
                                <SafeText style={styles.metaCount} numberOfLines={1}>
                                    {Helper.count(userProfile.count_followers)}
                                </SafeText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.columnItemsWrap}>
                    {adStore.enableWallet && (
                        <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('NotificationCenter')}>
                            <View style={styles.columnItemLeft}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@app/assets/images/icons/ic_mine_notification.png')}
                                />
                                <Text style={styles.columnName}>消息通知</Text>
                            </View>
                            <View style={styles.columnItemRight}>
                                <Badge count={notificationStore.unreadMessages} />
                                <Iconfont
                                    name="right"
                                    size={pixel(16)}
                                    color="#969696"
                                    style={{ marginLeft: pixel(5) }}
                                />
                            </View>
                        </TouchableOpacity>
                    )}
                    {adStore.enableWallet && (
                        <TouchableOpacity
                            style={styles.columnItem}
                            onPress={() => authNavigator(userStore.login ? 'Wallet' : 'Login')}>
                            <View style={styles.columnItemLeft}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@app/assets/images/icons/ic_mine_wallet.png')}
                                />
                                <Text style={styles.columnName}>我的钱包</Text>
                            </View>
                            <Iconfont name="right" size={pixel(16)} color="#969696" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => authNavigator('我的合集', { user: userProfile })}>
                        <View style={styles.columnItemLeft}>
                            <Image
                                style={styles.columnIcon}
                                source={require('@app/assets/images/icons/ic_mine_collect.png')}
                            />
                            <Text style={styles.columnName}>我的合集</Text>
                        </View>
                        <Iconfont name="right" size={pixel(16)} color="#969696" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => authNavigator('喜欢', { user: userProfile })}>
                        <View style={styles.columnItemLeft}>
                            <Image
                                style={styles.columnIcon}
                                source={require('@app/assets/images/icons/ic_mine_like.png')}
                            />
                            <Text style={styles.columnName}>我的喜欢</Text>
                        </View>
                        <Iconfont name="right" size={pixel(16)} color="#969696" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => authNavigator('Enshrined', { user: userProfile })}>
                        <View style={styles.columnItemLeft}>
                            <Image
                                style={styles.columnIcon}
                                source={require('@app/assets/images/icons/ic_mine_enshrine.png')}
                            />
                            <Text style={styles.columnName}>我的收藏</Text>
                        </View>
                        <Iconfont name="right" size={pixel(16)} color="#969696" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('浏览记录')}>
                        <View style={styles.columnItemLeft}>
                            <Image
                                style={styles.columnIcon}
                                source={require('@app/assets/images/icons/ic_mine_history.png')}
                            />
                            <Text style={styles.columnName}>浏览记录</Text>
                        </View>
                        <Iconfont name="right" size={pixel(16)} color="#969696" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('Feedback')}>
                        <View style={styles.columnItemLeft}>
                            <Image
                                style={styles.columnIcon}
                                source={require('@app/assets/images/icons/ic_mine_feedback.png')}
                            />
                            <Text style={styles.columnName}>帮助与反馈</Text>
                        </View>
                        <Iconfont name="right" size={pixel(16)} color="#969696" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => authNavigator('Setting', { user: userProfile })}>
                        <View style={styles.columnItemLeft}>
                            <Image
                                style={styles.columnIcon}
                                source={require('@app/assets/images/icons/ic_mine_setting.png')}
                            />
                            <Text style={styles.columnName}>设置</Text>
                        </View>
                        <Iconfont name="right" size={pixel(16)} color="#969696" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
});

const parallaxBgHeight = (Device.WIDTH * 651) / 1125;
const taskEntryWidth = Device.WIDTH - pixel(40);
const taskEntryHeight = (taskEntryWidth * 180) / 700;
const scrollTop = parallaxBgHeight - (Device.isFullScreenDevice ? pixel(30) : pixel(60));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    parallaxHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
    },
    parallaxHeaderBg: {
        height: parallaxBgHeight,
        width: Device.WIDTH,
    },
    positionSetting: {
        position: 'absolute',
        right: pixel(15),
        padding: pixel(5),
        top: Theme.statusBarHeight + pixel(5),
        zIndex: 2,
    },
    contentContainer: {
        flexGrow: 1,
        backgroundColor: '#fff',
        marginTop: scrollTop,
        paddingBottom: Theme.BOTTOM_HEIGHT + Theme.HOME_INDICATOR_HEIGHT + scrollTop,
        borderTopLeftRadius: pixel(20),
        borderTopRightRadius: pixel(20),
        overflow: 'hidden',
    },
    profileContainer: {
        paddingHorizontal: pixel(20),
        borderTopLeftRadius: pixel(20),
        borderTopRightRadius: pixel(20),
        overflow: 'hidden',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: pixel(20),
    },
    userAvatar: {
        height: pixel(60),
        width: pixel(60),
        borderRadius: pixel(30),
        backgroundColor: '#fff',
        marginRight: pixel(20),
    },
    userName: {
        color: '#2b2b2b',
        fontSize: font(20),
        lineHeight: font(28),
        fontWeight: 'bold',
    },
    userIntroduction: {
        color: '#b2b2b2',
        fontSize: font(14),
        lineHeight: font(20),
        marginTop: pixel(10),
    },
    metaWrap: {
        flexDirection: 'row',
        marginTop: pixel(20),
    },
    metaItem: {
        flexDirection: 'row',
        marginRight: pixel(20),
    },
    metaName: {
        color: '#2b2b2b',
        fontSize: font(13),
        lineHeight: font(22),
        marginRight: pixel(4),
    },
    metaCount: {
        color: '#2b2b2b',
        fontSize: font(20),
        lineHeight: font(22),
        fontWeight: 'bold',
    },
    columnItemsWrap: {
        marginTop: pixel(20),
        backgroundColor: '#fff',
    },
    columnItem: {
        padding: pixel(15),
        paddingLeft: pixel(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    columnItemLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(15),
    },
    columnItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    columnIcon: {
        height: pixel(24),
        width: pixel(24),
        resizeMode: 'contain',
    },
    columnName: {
        color: '#2b2b2b',
        fontSize: font(16),
        marginLeft: pixel(15),
    },
});
