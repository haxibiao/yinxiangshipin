import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView as HScrollView } from '@app/src/components/ScrollHeadTabView';
import { Iconfont, StatusView } from '@app/src/components';
import { observer, userStore } from '@src/store';
import { GQL, useQuery } from '@src/apollo';
import CollectionItem, { POSTER_WIDTH } from './CollectionItem';
import MovieHistory from './MovieHistory';
import MovieFollows from './MovieFollows';

const SPACE = pixel(14);

export default observer(({ user, ...props }) => {
    const isSelf = userStore.me.id === user.id;
    const navigation = useNavigation();
    const { data: userCollections } = useQuery(GQL.collectionsQuery, {
        variables: { user_id: user.id },
        fetchPolicy: 'network-only',
    });
    const userCollectionData = useMemo(() => userCollections?.collections?.data || new Array(10).fill({}), [
        userCollections,
    ]);

    const { data: followedCollection } = useQuery(GQL.followedCollectionsQuery, {
        variables: { user_id: user.id, followed_type: 'collections' },
        fetchPolicy: 'network-only',
    });
    const followedCollectionData = useMemo(() => followedCollection?.follows?.data || new Array(10).fill({}), [
        followedCollection,
    ]);

    return (
        <HScrollView {...props}>
            <View style={styles.secContainer}>
                <View style={styles.secHead}>
                    <View style={styles.headLeft}>
                        <Iconfont name="wenji" color="#909090" size={font(15)} />
                        <Text style={styles.secTitle}>创建的合集</Text>
                    </View>
                    {userCollectionData?.length > 3 && (
                        <Pressable
                            style={styles.headRight}
                            onPress={() => navigation.navigate('UserCollection', { user })}>
                            <Text style={styles.secAll}>查看全部</Text>
                            <Iconfont name="right" style={{ marginTop: font(1) }} size={font(12)} color={'#909090'} />
                        </Pressable>
                    )}
                </View>
                <ScrollView style={{ marginRight: -SPACE }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {userCollectionData.map((item, index) => {
                        return <CollectionItem key={item?.id || index} collection={item} navigation={navigation} />;
                    })}
                    {isSelf && (
                        <View style={styles.createBtnWrap}>
                            <Pressable
                                style={styles.createBtn}
                                onPress={() => {
                                    navigation.navigate('CreateCollection');
                                }}>
                                <Iconfont name="iconfontadd" size={font(28)} color={'#fff'} />
                            </Pressable>
                            <View style={{ marginTop: pixel(5) }}>
                                <Text style={styles.createText} numberOfLines={1}>
                                    新建合集
                                </Text>
                            </View>
                        </View>
                    )}
                    {!isSelf && userCollectionData.length === 0 && (
                        <View style={styles.emptyView}>
                            <Image
                                style={styles.emptyImage}
                                source={require('@app/assets/images/default/common_empty_default.png')}
                            />
                            <Text style={styles.emptyText}>此处空空如也</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
            <View style={styles.secContainer}>
                <View style={styles.secHead}>
                    <View style={styles.headLeft}>
                        <Iconfont name="wenji" color="#909090" size={font(15)} />
                        <Text style={styles.secTitle}>关注的合集</Text>
                    </View>
                    {followedCollectionData?.length > 3 && (
                        <Pressable
                            style={styles.headRight}
                            onPress={() => navigation.navigate('FavoriteCollection', { user })}>
                            <Text style={styles.secAll}>查看全部</Text>
                            <Iconfont name="right" style={{ marginTop: font(1) }} size={font(12)} color={'#909090'} />
                        </Pressable>
                    )}
                </View>
                <ScrollView style={{ marginRight: -SPACE }} horizontal={true} showsHorizontalScrollIndicator={false}>
                    {followedCollectionData.map((item, index) => {
                        return (
                            <CollectionItem
                                key={item?.collection?.id || index}
                                collection={item.collection}
                                navigation={navigation}
                            />
                        );
                    })}
                    {followedCollectionData.length === 0 && (
                        <View style={styles.emptyView}>
                            <Image
                                style={styles.emptyImage}
                                source={require('@app/assets/images/default/common_empty_default.png')}
                            />
                            <Text style={styles.emptyText}>此处空空如也</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
            {isSelf ? <MovieHistory /> : <MovieFollows user={user} />}
        </HScrollView>
    );
});

const styles = StyleSheet.create({
    secContainer: {
        padding: SPACE,
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    secHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: pixel(10),
    },
    headLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secTitle: {
        fontSize: font(15),
        color: '#404040',
        marginLeft: pixel(4),
    },
    headRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secAll: {
        fontSize: font(13),
        color: '#909090',
        marginRight: font(-1),
    },
    createBtnWrap: {
        width: POSTER_WIDTH,
    },
    createBtn: {
        width: POSTER_WIDTH,
        height: POSTER_WIDTH,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
        borderRadius: pixel(5),
    },
    createText: {
        color: '#202020',
        lineHeight: font(20),
        fontSize: font(14),
    },
    emptyView: {
        width: Device.WIDTH,
        height: POSTER_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        width: POSTER_WIDTH - font(20),
        height: POSTER_WIDTH - font(20),
    },
    emptyText: {
        color: '#909090',
        fontSize: font(13),
        lineHeight: font(20),
    },
});
