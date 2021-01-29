import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Iconfont, SafeText, DebouncedPressable, HxfButton } from '@src/components';
import { count } from '@src/common';
import { GQL, useFollowMutation } from '@src/apollo';
import { observer, userStore, adStore } from '@src/store';

export default observer(({ style, collection, navigation }) => {
    const movieData = useMemo(() => collection?.movies?.[0], [collection]);
    const isSelf = useMemo(() => collection?.user?.id === userStore.me.id, [collection, userStore.me.id]);

    const toggleFollow = useFollowMutation({
        variables: {
            followed_id: collection.id,
            followed_type: 'collections',
        },
        refetchQueries: () => [
            {
                query: GQL.followedCollectionsQuery,
                variables: { user_id: userStore.me?.id, followed_type: 'collections' },
            },
        ],
    });
    const toggleFollowOnPress = useCallback(() => {
        if (TOKEN) {
            collection.followed = collection?.followed === 1 ? 0 : 1;
            toggleFollow();
        } else {
            navigation.navigate('Login');
        }
    }, [collection]);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.infoWrap}>
                <Image style={styles.cover} source={{ uri: collection?.logo }} />
                <View style={styles.content}>
                    <View>
                        <SafeText style={styles.nameText}>{collection?.name}</SafeText>
                        <SafeText style={styles.metaText}>
                            {`${count((Number(collection?.count_views) + Number(collection?.id)) * 100)}次播放`}
                            {collection?.updated_to_episode > 0
                                ? ` · 更新至第${collection?.updated_to_episode || 0}集`
                                : ``}
                        </SafeText>
                    </View>
                    {collection?.user && (
                        <DebouncedPressable
                            style={styles.userInfo}
                            onPress={() => navigation.navigate('User', { user: collection?.user })}>
                            <Image style={styles.userAvatar} source={{ uri: collection?.user?.avatar }} />
                            <SafeText style={styles.userName}>{`${collection?.user?.name}`}</SafeText>
                        </DebouncedPressable>
                    )}
                </View>
            </View>
            <View>
                <SafeText style={styles.descText} limit={60}>
                    {collection?.description}
                </SafeText>
            </View>
            <View style={styles.operation}>
                {isSelf ? (
                    <DebouncedPressable
                        activeOpacity={0.8}
                        style={styles.operateBtn}
                        onPress={() => navigation.navigate('EditCollection', { collection })}>
                        <Text style={styles.buttonName}>编辑合集</Text>
                    </DebouncedPressable>
                ) : (
                    <View style={{ flex: 1, opacity: collection?.followed > 0 ? 0.4 : 1 }}>
                        <DebouncedPressable activeOpacity={0.8} style={styles.operateBtn} onPress={toggleFollowOnPress}>
                            <Iconfont
                                name={'xihuanfill'}
                                size={font(15)}
                                color={collection?.followed > 0 ? Theme.primaryColor : '#fff'}
                            />
                            <Text style={styles.buttonName}>{collection?.followed > 0 ? '已收藏' : '收藏合集'}</Text>
                        </DebouncedPressable>
                    </View>
                )}
                {adStore.enableMovie && movieData && (
                    <>
                        <View style={{ width: pixel(Theme.edgeDistance) * 1.2, height: 1 }} />
                        <DebouncedPressable
                            activeOpacity={0.8}
                            style={styles.operateBtn}
                            onPress={() => navigation.navigate('MovieDetail', { movie: movieData })}>
                            <Iconfont name="bofang1" size={font(13)} color={Theme.primaryColor} />
                            <Text style={styles.buttonName}>播放影片</Text>
                        </DebouncedPressable>
                    </>
                )}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: pixel(Theme.edgeDistance),
        paddingVertical: pixel(Theme.edgeDistance) * 1.2,
        backgroundColor: '#301514',
    },
    infoWrap: {
        flexDirection: 'row',
    },
    cover: {
        width: percent(25),
        height: percent(25),
        borderRadius: pixel(5),
    },
    content: {
        flex: 1,
        marginLeft: pixel(14),
        justifyContent: 'space-between',
    },
    nameText: {
        color: '#ffffff',
        fontSize: font(18),
        fontWeight: 'bold',
        marginBottom: pixel(5),
    },
    metaText: {
        color: '#c4c4c4',
        fontSize: font(13),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: pixel(12),
    },
    userAvatar: {
        width: pixel(20),
        height: pixel(20),
        borderRadius: pixel(10),
        marginRight: pixel(8),
        backgroundColor: '#f0f0f0',
    },
    userName: {
        color: '#ffffff',
        fontSize: font(13),
    },
    descText: {
        color: '#c4c4c4',
        lineHeight: font(18),
        fontSize: font(14),
        marginTop: pixel(Theme.edgeDistance) * 1.2,
    },
    operation: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(44),
        marginTop: pixel(Theme.edgeDistance) * 1.2,
    },
    operateBtn: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pixel(4),
        backgroundColor: '#786663',
    },
    buttonName: {
        color: '#ffffff',
        fontSize: font(15),
        marginLeft: pixel(3),
    },
});
