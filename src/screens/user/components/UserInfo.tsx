import React, { useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ImageBackground, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { observer, adStore, userStore } from '@src/store';
import { Iconfont, Avatar, FollowButton, SvgIcon, SvgPath } from '@src/components';

const SPACE = pixel(20);
const BG_WIDTH = Device.WIDTH;
const BG_HEIGHT = Device.WIDTH * 0.52;

// '1990-12-02'
function getFullYear(time) {
    return new Date(time).getFullYear() || 2000;
}
function getMonth(time) {
    return new Date(time).getMonth();
}
function getDay(time) {
    return new Date(time).getDay();
}
// 9,1
function getAstro(m, d) {
    return '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯'.substr(
        m * 2 - (d < '102223444433'.charAt(m - 1) - -19) * 2,
        2,
    );
}

interface Props {
    user: any;
    isTopStack?: boolean;
    operateHandler?: () => void;
}

export default observer(({ user: userData = userStore.me, isTopStack, operateHandler }: Props) => {
    const navigation = useNavigation();
    const { data, refetch } = useQuery(GQL.userQuery, {
        variables: { id: userData.id },
        fetchPolicy: 'network-only',
    });
    const user = useMemo(() => data?.user || userData, [userData, data]);
    const isSelf = userStore.me.id === user.id;
    const isNight = useMemo(() => new Date().getHours() > 18 || new Date().getHours() < 6, []);

    const withChat = useCallback(() => {
        if (TOKEN) {
            navigation.navigate('Chat', {
                chat: {
                    withUser: { ...user },
                },
            });
        } else {
            navigation.navigate('Login');
        }
    }, [user]);

    useEffect(() => {
        const navigationFocus = navigation.addListener('focus', () => {
            if (userData.id && refetch) {
                refetch();
            }
        });
        return () => {
            navigationFocus();
        };
    }, [userData.id]);

    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.userBackground}
                source={
                    isNight
                        ? require('@app/assets/images/user/default_bg_night.jpg')
                        : require('@app/assets/images/user/default_bg_noon.jpg')
                }>
                <View style={styles.operationHead}>
                    {isTopStack ? (
                        <>
                            <View />
                            <Pressable style={styles.operateBtn} onPress={() => navigation.navigate('Setting')}>
                                <Iconfont name="shezhi1" size={font(22)} color="#fff" />
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Pressable style={styles.operateBtn} onPress={() => navigation.goBack()}>
                                <Iconfont name="fanhui" size={font(21)} color="#fff" />
                            </Pressable>
                            {isSelf ? (
                                <Pressable
                                    style={styles.operateBtn}
                                    onPress={() =>
                                        navigation.navigate('SearchVideo', {
                                            user_id: user.id,
                                        })
                                    }>
                                    <SvgIcon name={SvgPath.search} size={font(22)} color={'#fff'} />
                                </Pressable>
                            ) : (
                                <Pressable style={styles.operateBtn} onPress={operateHandler}>
                                    <Iconfont name="androidgengduo" size={font(22)} color="#fff" />
                                </Pressable>
                            )}
                        </>
                    )}
                </View>
            </ImageBackground>
            <View style={styles.content}>
                <View style={styles.topInfo}>
                    <Pressable>
                        <Avatar
                            style={styles.userAvatar}
                            source={user?.avatar || require('@app/assets/images/user/default_avatar.png')}
                        />
                    </Pressable>

                    <View style={styles.operations}>
                        {!isSelf && (
                            <>
                                <FollowButton
                                    user={user}
                                    style={{ ...styles.userBtn }}
                                    inactiveStyle={{ backgroundColor: isNight ? '#23C895' : '#F24F0F' }}
                                    textStyle={styles.userBtnText}
                                />
                                <Pressable
                                    style={[styles.userBtn, { backgroundColor: isNight ? '#B5E4B6' : '#FF8C7D' }]}
                                    onPress={withChat}>
                                    <Text style={styles.userBtnText}>私信</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
                <Text style={styles.userName} numberOfLines={1}>
                    {user.name}
                </Text>
                <Pressable
                    style={styles.information}
                    disabled={!isSelf}
                    onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={styles.introduction} numberOfLines={2}>
                        {user.introduction ||
                            (isSelf ? '点击添加简介，让大家更快认识你' : '这个人很懒，一点介绍都没留下')}
                    </Text>
                    <View style={styles.labels}>
                        <Image
                            source={
                                user.gender === '男'
                                    ? require('@app/assets/images/user/gender_boy.png')
                                    : require('@app/assets/images/user/gender_girl.png')
                            }
                            style={styles.genderIcon}
                        />
                        <View style={styles.metaLabel}>
                            <Text style={styles.labelName} numberOfLines={1}>
                                {getFullYear(user.birthday_msg)}
                            </Text>
                        </View>
                        <View style={styles.metaLabel}>
                            <Text style={styles.labelName} numberOfLines={1}>
                                {getAstro(getMonth(user.birthday_msg), getDay(user.birthday_msg))}座
                            </Text>
                        </View>
                        {isSelf && (
                            <View style={styles.metaLabel}>
                                <Text style={styles.labelName}>编辑资料</Text>
                            </View>
                        )}
                    </View>
                </Pressable>
                <View style={styles.metaList}>
                    <Pressable style={styles.metaItem} onPress={() => navigation.navigate('UserPosts', { user })}>
                        <Text style={styles.metaCount} numberOfLines={1}>
                            {Helper.count(user.count_articles)}
                        </Text>
                        <Text style={styles.metaName} numberOfLines={1}>
                            动态
                        </Text>
                    </Pressable>
                    <Pressable style={styles.metaItem} onPress={() => navigation.navigate('Society', { user })}>
                        <Text style={styles.metaCount} numberOfLines={1}>
                            {Helper.count(user.count_followings)}
                        </Text>
                        <Text style={styles.metaName} numberOfLines={1}>
                            关注
                        </Text>
                    </Pressable>
                    <Pressable
                        style={styles.metaItem}
                        onPress={() => navigation.navigate('Society', { user, follower: true })}>
                        <Text style={styles.metaCount} numberOfLines={1}>
                            {Helper.count(user.count_followers)}
                        </Text>
                        <Text style={styles.metaName} numberOfLines={1}>
                            粉丝
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: pixel(10),
    },
    bgMask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    userBackground: {
        width: BG_WIDTH,
        height: BG_HEIGHT,
        paddingTop: pixel(Theme.statusBarHeight),
        position: 'relative',
    },
    operationHead: {
        marginTop: pixel(5),
        paddingHorizontal: SPACE,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    operateBtn: {
        width: font(30),
        height: font(30),
        borderRadius: font(15),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000011',
    },
    content: {
        flex: 1,
        marginTop: -pixel(15),
        paddingHorizontal: SPACE,
        borderTopLeftRadius: pixel(14),
        borderTopRightRadius: pixel(14),
        backgroundColor: '#fff',
    },
    topInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: -pixel(30),
        paddingBottom: pixel(16),
    },
    userAvatar: {
        width: pixel(88),
        height: pixel(88),
        borderRadius: pixel(44),
        backgroundColor: '#f0f0f0',
    },
    operations: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: pixel(10),
    },
    userBtn: {
        marginLeft: pixel(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pixel(34),
        minWidth: pixel(80),
        paddingHorizontal: pixel(16),
        borderRadius: pixel(17),
    },
    userBtnText: {
        color: '#fff',
        fontSize: font(15),
        lineHeight: font(20),
    },
    userName: {
        color: '#303030',
        fontSize: font(20),
        fontWeight: 'bold',
    },
    information: {
        marginVertical: pixel(16),
    },
    introduction: {
        color: '#404040',
        fontSize: font(14),
    },
    labels: {
        marginTop: pixel(6),
        flexDirection: 'row',
        alignItems: 'center',
    },
    genderIcon: {
        width: font(30),
        height: font(30),
        marginLeft: -font(3),
        marginRight: font(3),
    },
    metaLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(6),
        height: font(24),
        paddingHorizontal: font(10),
        borderRadius: pixel(6),
        backgroundColor: '#EEEEEE',
    },
    labelName: {
        color: '#404040',
        fontSize: font(14),
        lineHeight: font(20),
    },
    metaList: {
        flexDirection: 'row',
    },
    metaItem: {
        marginRight: pixel(25),
    },
    metaCount: {
        color: '#202020',
        fontSize: font(16),
        lineHeight: font(20),
        fontWeight: 'bold',
    },
    metaName: {
        color: '#606060',
        marginTop: pixel(2),
        fontSize: font(14),
        lineHeight: font(18),
    },
});
