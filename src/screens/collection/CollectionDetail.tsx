import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native';
import { observer, appStore, userStore } from '@src/store';
import { NavBarHeader, SafeText, Iconfont, Row, Loading } from '@src/components';
import { syncGetter, count, mergeProperty } from '@src/common';
import { GQL, useQuery, useFollowMutation, useMutation } from '@src/apollo';
import { ContentStatus, QueryList } from '@src/content';
import { observable } from 'mobx';
import { useRoute, useNavigation } from '@react-navigation/native';
import PostItem from './components/PostItem';
import { Overlay } from 'teaset';
import { ApolloProvider } from '@apollo/react-hooks';
import AddedToCollection from './components/AddedToCollection';
import StashVideoStore from './store';

export default observer((props: any) => {
    const navigation = useNavigation();
    const route = useRoute();
    let collection = route?.params?.collection;
    let tagData = collection;
    const isSelf = useMemo(() => tagData?.user.id === userStore.me.id, [tagData]);

    const scrollAnimateValue = useRef(new Animated.Value(0));
    const onScroll = useMemo(() => {
        return Animated.event([{ nativeEvent: { contentOffset: { y: scrollAnimateValue.current } } }], {
            useNativeDriver: false,
        });
    }, []);
    const titleOpacity = scrollAnimateValue.current.interpolate({
        inputRange: [pixel(50), percent(50)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

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
        tagData.followed = tagData.followed === 1 ? 0 : 1;
        toggleFollow();
    }, [tagData]);

    const listHeader = useCallback(
        (data) => {
            collection = data?.collection || collection;
            return (
                <View>
                    <View style={styles.header}>
                        <Image style={styles.tagLogoWrap} source={{ uri: tagData?.logo }} />
                        <View style={styles.tagInfo}>
                            <SafeText style={styles.tagName}>#{tagData?.name}</SafeText>
                            <Text style={styles.tagCount}>
                                {`${count(tagData?.count_plays || Math.round(Math.random() * 100))}次播放`}
                                {`· @${tagData?.user?.name}`}
                            </Text>
                            <View style={styles.tagInfoBottom}>
                                <Text style={styles.tagCount}>
                                    {tagData?.updated_to_episode > 0
                                        ? `更新至第${tagData?.updated_to_episode || 0}集`
                                        : ``}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={1} style={styles.collectBtn} onPress={() => toggleFollowOnPress()}>
                        <Iconfont
                            name={tagData?.followed > 0 ? 'xihuanfill' : 'xihuan'}
                            size={font(15)}
                            color={tagData?.followed > 0 ? Theme.primaryColor : '#fff'}
                        />
                        <Text style={[styles.contentText, { marginLeft: pixel(3) }]}>
                            {tagData?.followed > 0 ? '已收藏' : '收藏合集'}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.lineStyle} />
                </View>
            );
        },
        [tagData],
    );

    // 合集中批量添加/删除动态操作
    const [moveInCollection, { loading: addLoading, error: addError }] = useMutation(GQL.moveInCollectionsMutation);
    const [moveOutCollection, { loading: deleteLoading, error: deleteError }] = useMutation(
        GQL.moveOutCollectionsMutation,
    );

    // 选择合集
    const [collections, setCollections] = useState(route.params?.collection ? [route.params?.collection] : []);
    const overlayKey = useRef();

    const closeCollection = useCallback(() => {
        Overlay.hide(overlayKey.current);
    }, []);

    const addCollection = useCallback((value) => {
        setCollections([value]);
        closeCollection();
    }, []);

    const deleteCollection = useCallback(() => {
        setCollections([]);
        closeCollection();
    }, []);
    const confirmBtn = useCallback(({ operation, collection_id }) => {
        closeCollection();
        if (operation === '添加') {
            moveInCollection({
                variables: {
                    collection_id: collection_id,
                    collectable_ids: StashVideoStore.stashAddVideo.map((item) => {
                        return item.post_id;
                    }),
                },
                refetchQueries: () => [
                    {
                        query: GQL.CollectionQuery,
                        variables: { collection_id: collection_id },
                        fetchPolicy: 'network-only',
                    },
                ],
            });
        } else {
            moveOutCollection({
                variables: {
                    collection_id: collection_id,
                    collectable_ids: StashVideoStore.stashDeleteVideo.map((item) => {
                        return item.post_id;
                    }),
                },
                refetchQueries: () => [
                    {
                        query: GQL.CollectionQuery,
                        variables: { collection_id: collection_id },
                        fetchPolicy: 'network-only',
                    },
                ],
            });
        }
    }, []);
    useEffect(() => {
        if (addLoading || deleteLoading) {
            Loading.show();
        } else {
            Loading.hide();
        }
    }, [addLoading, deleteLoading, addError, deleteError]);

    const showCollection = useCallback((operation) => {
        const Operation = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}>
                <ApolloProvider client={appStore.client}>
                    <AddedToCollection
                        onClose={closeCollection}
                        onClick={addCollection}
                        navigation={navigation}
                        operation={operation}
                        collection={collection}
                        confirmBtn={confirmBtn}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        StashVideoStore.setStashAddVideo([]);
        StashVideoStore.setStashDeleteVideo([]);
        overlayKey.current = Overlay.show(Operation);
    }, []);

    return (
        <View style={styles.container}>
            <NavBarHeader
                isTransparent
                hasSearchButton={true}
                onPressSearch={() => navigation.push('SearchVideo', { collection_id: collection.id })}
                centerStyle={{ opacity: titleOpacity }}
                title={collection?.name}
            />
            <QueryList
                gqlDocument={GQL.CollectionQuery}
                dataOptionChain="collection.posts.data"
                paginateOptionChain="collection.posts.paginatorInfo"
                options={{
                    variables: {
                        collection_id: collection.id,
                    },
                    fetchPolicy: 'network-only',
                }}
                contentContainerStyle={styles.contentContainer}
                onScroll={onScroll}
                renderItem={({ item, index, data, page }) => (
                    <PostItem item={item} index={index} collection={collection} listData={data} nextPage={page} />
                )}
                ListHeaderComponent={({ data }) => listHeader(data)}
            />
            {isSelf && (
                <View style={styles.bottomOperation}>
                    <Text style={styles.btnText}>合集操作</Text>
                    <View style={styles.rightView}>
                        <TouchableOpacity style={styles.btnStyle} onPress={() => showCollection('添加')}>
                            <Text style={styles.btnText}>批量添加</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btnStyle, { marginLeft: pixel(15) }]}
                            onPress={() => showCollection('删除')}>
                            <Text style={styles.btnText}>批量删除</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161924',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    navTitle: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: pixel(40),
    },
    title: {
        fontSize: font(18),
        color: '#fff',
    },
    header: {
        flexDirection: 'row',
        padding: pixel(15),
        paddingTop: pixel(5),
        paddingBottom: pixel(20),
    },
    tagLogoWrap: {
        width: percent(25),
        height: percent(25),
        borderRadius: pixel(2),
    },
    tagInfo: {
        flex: 1,
        marginLeft: pixel(15),
        justifyContent: 'space-around',
    },
    tagInfoBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tagName: {
        marginBottom: pixel(5),
        fontSize: font(18),
        fontWeight: 'bold',
        color: '#fff',
    },
    tagCount: {
        fontSize: font(14),
        color: '#b2b2b2',
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterIcon: {
        width: pixel(15),
        height: pixel(15),
        marginRight: pixel(2),
    },
    filterBtnName: {
        fontSize: font(14),
        color: '#b2b2b2',
    },
    collectBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#666',
        borderRadius: pixel(2),
        marginHorizontal: pixel(Theme.itemSpace),
        paddingVertical: pixel(10),
        marginBottom: pixel(20),
    },
    contentText: {
        fontSize: font(14),
        color: '#fff',
    },
    lineStyle: {
        height: pixel(0.5),
        backgroundColor: '#666',
        marginBottom: pixel(Theme.itemSpace) / 2,
    },
    listFooter: {
        paddingVertical: pixel(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooterText: {
        fontSize: font(13),
        color: '#b4b4b4',
    },
    bottomOperation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#161924',
        zIndex: 999,
        bottom: Theme.HOME_INDICATOR_HEIGHT,
        paddingVertical: pixel(10),
        paddingHorizontal: pixel(Theme.itemSpace),
        borderTopColor: '#666',
        borderTopWidth: pixel(1),
    },
    rightView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnStyle: {
        backgroundColor: '#666',
        borderRadius: pixel(5),
        padding: pixel(10),
    },
    btnText: {
        fontSize: font(12),
        color: '#fff',
    },
});
