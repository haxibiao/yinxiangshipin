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
import { NavBarHeader, SafeText, Iconfont, Row } from '@src/components';
import { syncGetter, count, mergeProperty } from '@src/common';
import { GQL, useQuery, useFollowCollectionMutation, useMutation } from '@src/apollo';
import { ContentStatus, QueryList } from '@src/content';
import { observable } from 'mobx';
import { useRoute, useNavigation } from '@react-navigation/native';
import PostItem from './components/PostItem';

export default observer((props: any) => {
    const navigation = useNavigation();
    const route = useRoute();
    let collection = route?.params?.collection;
    let tagData = collection;

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

    const toggleFollow = useFollowCollectionMutation({
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
                            <Text style={styles.tagName}>#{tagData?.name}</Text>
                            <Text style={styles.tagCount}>
                                {`${count(tagData?.count_plays || 0.0)}次播放`}
                                {`· @${tagData?.user?.name}`}
                            </Text>
                            <View style={styles.tagInfoBottom}>
                                <Text style={styles.tagCount}>{`更新至第${tagData?.posts.paginatorInfo.total}集`}</Text>
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
    // itemWrap: {
    //     width: Device.WIDTH,
    //     flexDirection: 'row',
    //     paddingHorizontal: pixel(Theme.itemSpace),
    //     marginVertical: pixel(Theme.itemSpace) / 2,
    // },
    // videoCover: {
    //     width: percent(18),
    //     height: percent(18) * 1.4,
    //     marginRight: pixel(10),
    //     borderRadius: pixel(2),
    // },
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
});
