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

function CollectionItem({ collection, onPress, style, index }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={[styles.postItem, style]}>
                <Image style={styles.postCover} source={{ uri: collection?.video?.cover }} />
                <View style={styles.postInfo}>
                    <View style={styles.introduction}>
                        <Text style={styles.postName} numberOfLines={2}>
                            {`第${collection?.current_episode || index}集￨${collection?.description}`}
                        </Text>
                    </View>
                    <View style={styles.postMeta}>
                        <SafeText style={[styles.metaText, { marginRight: pixel(15) }]}>
                            {Helper.moment(collection?.video?.duration)}
                        </SafeText>
                        <Iconfont
                            name={collection?.liked ? 'xihuanfill' : 'xihuan'}
                            size={pixel(13)}
                            color={collection?.liked ? '#FE2C54' : '#e4e4e4'}
                            style={{ marginRight: pixel(4) }}
                        />
                        <SafeText style={styles.metaText}>{Helper.count(collection?.count_likes)}</SafeText>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

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
                lastPage,
            };
        })(),
    );

    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.CollectionQuery, {
        variables: {
            collection_id: collection?.id,
            count: VIDEO_QUERY_COUNT,
            page: currentPage,
        },
    });
    const hasMore = useMemo(() => data?.collection?.posts?.paginatorInfo?.hasMorePages, [data]);
    const episodeData = useMemo(() => data?.collection?.posts?.data, [data]);
    const nextPage = useMemo(
        () => Math.ceil(episodeData?.[episodeData?.length - 1]?.current_episode / VIDEO_QUERY_COUNT) + 1,
        [data],
    );
    const prvPage = useMemo(() => Math.ceil(episodeData?.[0]?.current_episode / VIDEO_QUERY_COUNT) - 1, [episodeData]);
    // console.log('paginatorInfo', hasMore, nextPage, prvPage);

    // 加载更多
    const [isLoadingPrevPage, setLoadingPrevPage] = useState(false);
    const initFetchPrevPage = useRef(true);
    const onTopReached = useCallback(
        async (callback) => {
            if (prvPage >= 1 && !paginationInfo.current.loadingPrevPage && paginationInfo.current.hasPrevPage) {
                initFetchPrevPage.current = false;
                paginationInfo.current.loadingPrevPage = true;
                setLoadingPrevPage(true);
                fetchMore({
                    variables: {
                        page: prvPage,
                    },
                    updateQuery: (prev: any, { fetchMoreResult }: any) => {
                        setLoadingPrevPage(false);
                        if (prvPage - 1 <= 0) {
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
        [prvPage],
    );
    useEffect(() => {
        async function init() {
            await onTopReached();
        }
        if (initFetchPrevPage.current) {
            init();
        }
    }, [onTopReached]);

    const onEndReached = useCallback(
        async (callback) => {
            if (hasMore && paginationInfo.current.hasNextPage && !paginationInfo.current.loadingNextPage) {
                paginationInfo.current.loadingNextPage = true;
                fetchMore({
                    variables: {
                        page: nextPage,
                    },
                    updateQuery: (prev: any, { fetchMoreResult }: any) => {
                        if (nextPage + 1 > paginationInfo.current.lastPage) {
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
        },
        [fetchMore, hasMore, nextPage],
    );

    const renderItem = useCallback(
        ({ item, index }) => {
            return (
                <CollectionItem
                    index={index}
                    collection={item}
                    style={post?.id === item?.id && { backgroundColor: 'rgba(222,222,222,0.3)' }}
                    onPress={() => {
                        onClose();
                        DeviceEventEmitter.emit('JumpPlayCollectionVideo', {
                            index,
                            data: episodeData,
                            page: paginationInfo.current.nextPage,
                        });
                    }}
                />
            );
        },
        [episodeData],
    );

    // 加载状态UI
    const ListHeaderComponent = useCallback(() => {
        let header = null;
        if (isLoadingPrevPage) {
            header = <ContentStatus status="loadMore" />;
        }
        return header;
    }, [isLoadingPrevPage]);

    const ListFooterComponent = useCallback(() => {
        let footer = null;
        if (hasMore !== undefined) {
            if (hasMore && paginationInfo.current.hasNextPage) {
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
    }, [hasMore]);

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
