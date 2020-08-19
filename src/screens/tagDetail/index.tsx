import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Animated } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { observer, appStore } from '@src/store';
import { Header } from '@src/components';
import { syncGetter } from '@src/common';
import { GQL, MediaItem, ContentStatus, mergeProperty } from '@src/content';
import { observable } from 'mobx';
import { useRoute } from '@react-navigation/native';

export default observer((props: any) => {
    const route = useRoute();
    const tag = route?.params?.tag;
    const [hot, setHot] = useState(false);

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
    //
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.tagPostsQuery, {
        variables: {
            tag_id: 24 || tag?.id,
            count: 10,
            visibility: 'all',
        },
    });
    const listData = useMemo(() => syncGetter('tag.posts.data', data), [data]);
    const nextPage = useMemo(() => syncGetter('tag.posts.paginatorInfo.currentPage', data) + 1 || 2, [data]);
    const hasMore = useMemo(() => syncGetter('tag.posts.paginatorInfo.hasMorePages', data), [data]);
    const isLoading = useRef(false);
    const onEndReached = useCallback(() => {
        if (!isLoading.current && hasMore) {
            isLoading.current = true;
            fetchMore({
                variables: {
                    page: nextPage,
                },
                updateQuery: (prev: any, { fetchMoreResult }) => {
                    isLoading.current = false;
                    if (!fetchMoreResult) return prev;
                    return mergeProperty(prev, fetchMoreResult);
                },
            });
        }
    }, [nextPage, hasMore, fetchMore]);

    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <View style={styles.itemWrap}>
                    <MediaItem media={item} tag={tag} initData={listData} itemIndex={index} page={nextPage} />
                </View>
            );
        },
        [tag, listData, nextPage],
    );

    const header = useMemo(() => {
        return (
            <View style={styles.header}>
                <View style={styles.tagLogoWrap}>
                    <Image style={styles.tagLogo} source={require('@app/assets/images/icons/ic_tag_red.png')} />
                </View>
                <View style={styles.tagData}>
                    <View style={styles.tagInfo}>
                        <Text style={styles.tagName}>#{tag?.name}</Text>
                        <Text style={styles.tagCountHits}>{`${
                            tag?.count_hits || Number(Math.random() * 10).toFixed(2)
                        }w播放`}</Text>
                    </View>
                    {/* <TouchableOpacity style={styles.filterBtn} onPress={() => setHot((h) => !h)} activeOpacity={1}>
                        <Image
                            style={styles.filterIcon}
                            source={require('@app/assets/images/icons/ic_order_gray.png')}
                        />
                        <Text style={styles.filterBtnName}>{hot ? '最多点赞' : '最新发布'}</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={styles.favoriteBtn}>
                        <Iconfont name="favorite" size={font(18)} color={tag?.favorite ? '#FE1966' : '#fff'} />
                        <Text style={styles.favoriteBtnName}>{tag?.favorite ? '取消收藏' : '收藏'}</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }, [hot, tag]);

    const listFooter = useCallback(() => {
        let footer = null;
        if (!loading && hasMore) {
            footer = <ContentStatus status="loadMore" />;
        }
        if (listData?.length > 0 && !hasMore) {
            footer = (
                <View style={styles.listFooter}>
                    <Text style={styles.listFooterText}>底都被你看光了</Text>
                </View>
            );
        }
        return footer;
    }, [loading, listData, hasMore]);

    const listEmpty = useCallback(() => {
        let status = '';
        switch (true) {
            case error:
                status = 'error';
                break;
            case loading:
                status = 'loading';
                break;
            case listData?.length === 0:
                status = 'empty';
                break;
            default:
                break;
        }
        if (status) {
            return <ContentStatus status={status} refetch={status === 'error' ? refetch : undefined} />;
        } else {
            return null;
        }
    }, [loading, listData, error, refetch]);

    return (
        <View style={styles.container}>
            <Header
                lightBar
                centerComponent={
                    <Animated.View style={[styles.navTitle, { opacity: titleOpacity }]}>
                        <Text style={styles.title}>{tag?.name}</Text>
                    </Animated.View>
                }
            />
            <FlatList
                data={listData}
                onScroll={onScroll}
                contentContainerStyle={styles.contentContainer}
                columnWrapperStyle={styles.columnWrapperStyle}
                numColumns={3}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(item.id || index)}
                ListHeaderComponent={header}
                ListFooterComponent={listFooter}
                ListEmptyComponent={listEmpty}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
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
        paddingBottom: pixel(30),
    },
    tagLogoWrap: {
        width: percent(25),
        height: percent(25),
        borderRadius: pixel(2),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    tagLogo: {
        width: '50%',
        height: '50%',
    },
    tagData: {
        flex: 1,
        marginLeft: pixel(15),
        // justifyContent: 'center',
        justifyContent: 'space-between',
    },
    tagInfo: {},
    tagName: {
        fontSize: font(20),
        fontWeight: 'bold',
        color: '#fff',
    },
    tagCountHits: {
        marginTop: pixel(5),
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
        marginRight: pixel(4),
    },
    filterBtnName: {
        fontSize: font(14),
        color: '#b2b2b2',
    },
    itemWrap: {
        width: '33.33%',
        height: percent(33.33) * 1.4,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: '#2b2b2b',
        backgroundColor: '#2b2b2b',
    },
    columnWrapperStyle: {
        borderWidth: StyleSheet.hairlineWidth,
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
