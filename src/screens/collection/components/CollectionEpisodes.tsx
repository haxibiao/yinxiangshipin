import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QueryList, ContentStatus, BidirectionalList } from '@src/content';
import { Iconfont, SafeText } from '@src/components';
import { GQL, useFollowMutation, useApolloClient, useQuery } from '@src/apollo';
import { userStore } from '@src/store';
import { exceptionCapture, mergeProperty } from '@src/common';

const VIDEO_QUERY_COUNT = 10;

export default ({ collection, post, onClose, navigation }) => {
    // 收藏合集
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
            collection.followed = collection.followed === 1 ? 0 : 1;
            toggleFollow();
        } else {
            onClose();
            navigation.navigate('Login');
        }
    }, [collection]);
    // 合集信息
    const listRef = useRef();
    const currentPage = useMemo(() => Math.ceil(post?.current_episode / VIDEO_QUERY_COUNT), [post]);
    const paginationInfo = useRef(
        (() => {
            const lastPage = Math.ceil(collection?.updated_to_episode / VIDEO_QUERY_COUNT);
            return {
                loadingPrevPage: false,
                loadingNextPage: false,
                hasPrevPage: currentPage > 1,
                hasNextPage: currentPage < lastPage,
                prevPage: currentPage - 1 || -1,
                nextPage: currentPage + 1,
                lastPage,
            };
        })(),
    );
    const initialIndex = useMemo(() => {
        const index = (post?.current_episode % VIDEO_QUERY_COUNT) - 1;
        if (paginationInfo.current.hasPrevPage && !paginationInfo.current.hasNextPage) {
            return VIDEO_QUERY_COUNT + index;
        }
        return VIDEO_QUERY_COUNT;
    }, [post]);
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.CollectionQuery, {
        variables: {
            collection_id: collection?.id,
            count: VIDEO_QUERY_COUNT,
            page: currentPage,
        },
    });
    const episodeData = useMemo(() => data?.collection?.posts?.data, [data]);
    useEffect(() => {
        async function init() {
            if (fetchMore && paginationInfo.current.hasPrevPage && !paginationInfo.current.hasNextPage) {
                await onTopReached();
            }
        }
        init();
    }, [fetchMore]);
    // 加载更多
    const onTopReached = useCallback(
        async (callback) => {
            if (!paginationInfo.current.loadingPrevPage && paginationInfo.current.hasPrevPage) {
                paginationInfo.current.loadingPrevPage = true;
                fetchMore({
                    variables: {
                        page: paginationInfo.current.prevPage,
                    },
                    updateQuery: (prev: any, { fetchMoreResult }: any) => {
                        paginationInfo.current.prevPage--;
                        if (paginationInfo.current.prevPage <= 0) {
                            paginationInfo.current.hasPrevPage = false;
                        }
                        paginationInfo.current.loadingPrevPage = false;
                        if (!fetchMoreResult) return prev;
                        if (callback instanceof Function) {
                            callback();
                        }
                        return mergeProperty(prev, fetchMoreResult, { prepend: true });
                    },
                });
            }
        },
        [fetchMore],
    );

    const onEndReached = useCallback(async (callback) => {
        if (!paginationInfo.current.loadingNextPage && paginationInfo.current.hasNextPage) {
            paginationInfo.current.loadingNextPage = true;
            fetchMore({
                variables: {
                    page: paginationInfo.current.nextPage,
                },
                updateQuery: (prev: any, { fetchMoreResult }: any) => {
                    paginationInfo.current.nextPage++;
                    if (paginationInfo.current.nextPage > paginationInfo.current.lastPage) {
                        paginationInfo.current.hasNextPage = false;
                    }
                    paginationInfo.current.loadingNextPage = false;
                    if (!fetchMoreResult) return prev;
                    if (callback instanceof Function) {
                        callback();
                    }
                    return mergeProperty(prev, fetchMoreResult);
                },
            });
        }
    }, []);

    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <TouchableWithoutFeedback
                    onPress={() => {
                        onClose();
                        DeviceEventEmitter.emit('JumpPlayCollectionVideo', {
                            index,
                            data: episodeData,
                            page: paginationInfo.current.nextPage,
                        });
                    }}>
                    <View
                        style={[
                            styles.postItem,
                            post?.id === item?.id && { backgroundColor: 'rgba(222,222,222,0.3)' },
                        ]}>
                        <Image style={styles.postCover} source={{ uri: item?.video?.cover }} />
                        <View style={styles.postInfo}>
                            <View style={styles.introduction}>
                                <Text style={styles.postName} numberOfLines={2}>
                                    {`第${item?.current_episode || index}集￨${item?.description}`}
                                </Text>
                            </View>
                            <View style={styles.postMeta}>
                                <SafeText style={[styles.metaText, { marginRight: pixel(15) }]}>
                                    {Helper.moment(item?.video?.duration)}
                                </SafeText>
                                <Iconfont
                                    name={item?.liked ? 'xihuanfill' : 'xihuan'}
                                    size={pixel(13)}
                                    color={item?.liked ? '#FE2C54' : '#e4e4e4'}
                                    style={{ marginRight: pixel(4) }}
                                />
                                <SafeText style={styles.metaText}>{Helper.count(item?.count_likes)}</SafeText>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        },
        [episodeData],
    );

    // 加载状态UI
    const ListHeaderComponent = useCallback(() => {
        let header = null;
        if (episodeData?.length > 0 && paginationInfo.current.hasPrevPage && paginationInfo.current.loadingPrevPage) {
            header = <ContentStatus status="loadMore" />;
        }
        return header;
    }, [episodeData]);

    const ListFooterComponent = useCallback(() => {
        let footer = null;
        if (episodeData?.length > 0) {
            if (paginationInfo.current.hasNextPage) {
                footer = <ContentStatus status="loadMore" />;
            } else {
                footer = (
                    <View style={styles.listFooter}>
                        <Text style={styles.listFooterText}>底都被你看光了</Text>
                    </View>
                );
            }
        }
        return footer;
    }, [episodeData]);

    const ListEmptyComponent = useCallback(() => {
        let status = '';
        switch (true) {
            case !!error:
                status = 'error';
                break;
            case loading:
                status = 'loading';
                break;
            case episodeData?.length === 0:
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
    }, [error, loading, refetch, episodeData]);

    return (
        <View style={styles.container}>
            <View style={styles.windowHeader}>
                <Text style={styles.headerText}>
                    {collection?.name}
                    {collection?.updated_to_episode > 0 && ' · 更新至第' + collection?.updated_to_episode + '集'}
                </Text>
                <TouchableOpacity style={styles.closeWindow} onPress={onClose}>
                    <Iconfont name="guanbi1" size={pixel(16)} color="#fff" />
                </TouchableOpacity>
            </View>
            <BidirectionalList
                ref={listRef}
                contentHeight={(Device.HEIGHT * 2) / 3}
                data={episodeData}
                renderItem={renderItem}
                onTopReached={onTopReached}
                onEndReached={onEndReached}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                ListEmptyComponent={ListEmptyComponent}
            />
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerBtn} onPress={toggleFollowOnPress}>
                    <Iconfont name="biaoxingfill" size={pixel(16)} color={collection?.followed ? '#FE2C54' : '#fff'} />
                    <Text style={styles.btnText}>{collection?.followed ? '已收藏' : '收藏合集'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: (Device.HEIGHT * 2) / 3,
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        backgroundColor: 'rgba(0,0,0,0.6)',
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
    },
    windowHeader: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    headerText: {
        color: '#ffffff',
        fontSize: pixel(15),
    },
    closeWindow: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: pixel(44),
        height: pixel(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        paddingHorizontal: pixel(12),
        paddingVertical: pixel(15),
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    footerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pixel(42),
        borderRadius: pixel(4),
        backgroundColor: '#333333',
    },
    btnText: {
        fontSize: font(15),
        color: '#ffffff',
        marginLeft: pixel(3),
    },
    postItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: pixel(12),
        paddingHorizontal: pixel(15),
        overflow: 'hidden',
    },
    postCover: {
        width: pixel(70),
        height: pixel(90),
        borderRadius: pixel(4),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    postInfo: {
        flex: 1,
        marginLeft: pixel(12),
        justifyContent: 'space-between',
    },
    introduction: {
        marginBottom: pixel(8),
    },
    postName: {
        fontSize: font(15),
        lineHeight: font(20),
        color: '#ffffff',
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: font(12),
        color: '#e4e4e4',
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
