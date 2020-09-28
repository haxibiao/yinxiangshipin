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
    const initialIndex = useMemo(() => (post?.current_episode % VIDEO_QUERY_COUNT) - 1, [post]);
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
    const [prevPageData, setPrevPageData] = useState();
    const [nextPageData, setNextPageData] = useState();
    const [loading, setLoading] = useState(true);
    const paginationInfo = useRef(
        (() => {
            const currentPage = Math.ceil(post?.current_episode / VIDEO_QUERY_COUNT);
            const lastPage = Math.ceil(collection?.updated_to_episode / VIDEO_QUERY_COUNT);
            return {
                loadingPrevPage: false,
                loadingNextPage: false,
                hasPrevPage: currentPage > 1,
                hasNextPage: currentPage <= lastPage,
                prevPage: currentPage - 1 || -1,
                nextPage: currentPage,
                error: false,
                lastPage,
            };
        })(),
    );
    const client = useApolloClient();
    const collectionQuery = useCallback(
        async ({ page, next }) => {
            function query() {
                return client.query({
                    query: GQL.CollectionQuery,
                    variables: {
                        collection_id: collection?.id,
                        page,
                        count: VIDEO_QUERY_COUNT,
                    },
                });
            }

            const [err, result] = await exceptionCapture(query);
            if (err) {
                paginationInfo.current.error = true;
            }
            console.log(next ? 'bottom' : 'top', page, result?.data?.collection?.posts?.data);
            return result?.data?.collection?.posts?.data;
        },
        [client],
    );

    // 加载更多
    const onTopReached = useCallback(async () => {
        if (!paginationInfo.current.loadingPrevPage && paginationInfo.current.hasPrevPage) {
            // console.log('====================================');
            // console.log('onTopReached', paginationInfo.current.prevPage);
            // console.log('====================================');
            paginationInfo.current.loadingPrevPage = true;
            const fetchMoreResult = await collectionQuery({ page: paginationInfo.current.prevPage });
            paginationInfo.current.prevPage--;
            if (paginationInfo.current.prevPage <= 0) {
                paginationInfo.current.hasPrevPage = false;
            }
            paginationInfo.current.loadingPrevPage = false;
            if (Array.isArray(fetchMoreResult)) {
                setPrevPageData((prevData) => {
                    if (Array.isArray(prevData)) {
                        return [...fetchMoreResult, ...prevData].reverse();
                    }
                    return [...fetchMoreResult].reverse();
                });
            }
        }
    }, []);
    const onEndReached = useCallback(async () => {
        if (!paginationInfo.current.loadingNextPage && paginationInfo.current.hasNextPage) {
            // console.log('====================================');
            // console.log('onEndReached', paginationInfo.current.nextPage);
            // console.log('====================================');
            paginationInfo.current.loadingNextPage = true;
            const fetchMoreResult = await collectionQuery({ page: paginationInfo.current.nextPage, next: true });
            paginationInfo.current.nextPage++;
            if (paginationInfo.current.nextPage > paginationInfo.current.lastPage) {
                paginationInfo.current.hasNextPage = false;
            }
            paginationInfo.current.loadingNextPage = false;
            if (Array.isArray(fetchMoreResult)) {
                setNextPageData((nextData) => {
                    if (Array.isArray(nextData)) {
                        return [...nextData, ...fetchMoreResult];
                    }
                    return fetchMoreResult;
                });
            }
        }
    }, []);

    useEffect(() => {
        async function init() {
            await onEndReached();
            await onTopReached();
            setLoading(false);
        }
        init();
    }, []);

    const renderItem = useCallback(
        ({ item, index, topList }) => {
            let data = [...nextPageData];
            if (Array.isArray(prevPageData)) {
                data = [...prevPageData, ...data];
            }
            return (
                <TouchableWithoutFeedback
                    onPress={() => {
                        onClose();
                        DeviceEventEmitter.emit('JumpPlayCollectionVideo', {
                            data,
                            index: topList ? index : prevPageData?.length + index,
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
        [prevPageData, nextPageData],
    );
    // 加载状态UI
    // const ListHeaderComponent = useCallback(() => {
    //     let header = null;
    //     if (prevPageData?.length > 0 && paginationInfo.current.hasPrevPage) {
    //         header = <ContentStatus status="loadMore" />;
    //     }
    //     console.log('====================================');
    //     console.log(prevPageData?.length, paginationInfo.current.hasPrevPage);
    //     console.log('====================================');
    //     return header;
    // }, [prevPageData]);

    const ListFooterComponent = useCallback(() => {
        let footer = null;
        if (nextPageData?.length > 0) {
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
    }, [loading, nextPageData]);

    const ListEmptyComponent = useCallback(() => {
        let status = '';
        switch (true) {
            case paginationInfo.current.error:
                status = 'error';
                break;
            case loading:
                status = 'loading';
                break;
            case nextPageData?.length === 0:
                status = 'empty';
                break;
            default:
                break;
        }
        console.log('status', status);
        if (status) {
            return (
                <ContentStatus status={status} refetch={status === 'error' ? nextCollectionData?.refetch : undefined} />
            );
        } else {
            return null;
        }
    }, [loading, nextPageData]);

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
                // loading={!loading && !prevPageData && !nextPageData}
                contentHeight={(Device.HEIGHT * 2) / 3}
                prevPageData={prevPageData}
                nextPageData={nextPageData}
                renderItem={renderItem}
                onTopReached={onTopReached}
                onEndReached={onEndReached}
                // ListHeaderComponent={ListHeaderComponent}
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

// // 上一页数据
// const prevCollectionData = useQuery(GQL.CollectionQuery, {
//     variables: {
//         collection_id: collection?.id,
//         page: paginationInfo.current.prevPage,
//         count: VIDEO_QUERY_COUNT,
//     },
//     skip: !paginationInfo.current.hasPrevPage,
// });
// const prevPageData = useMemo(() => prevCollectionData?.data?.collection.posts.data, [prevCollectionData]);
// // 下一页数据
// const nextCollectionData = useQuery(GQL.CollectionQuery, {
//     variables: {
//         collection_id: collection?.id,
//         page: paginationInfo.current.nextPage,
//         count: VIDEO_QUERY_COUNT,
//     },
// });
// const nextPageData = useMemo(() => nextCollectionData?.data?.collection.posts.data, [nextCollectionData]);

// const [prevPageData, setPrevPageData] = useState(null);
// const [nextPageData, setNextPageData] = useState(null);
// const client = useApolloClient();
// const collectionQuery = useCallback(
//     async ({ page, count, next }) => {
//         function query() {
//             client.query({
//                 query: GQL.CollectionQuery,
//                 variables: {
//                     page,
//                     count,
//                 },
//             });
//         }

//         const [err, result] = await exceptionCapture(query);
//         const postsData = result?.data?.collection?.posts?.data;
//         if (paginationInfo.current.lastPage) {
//             paginationInfo.current.lastPage = result?.data?.collection?.posts?.paginatorInfo?.lastPage;
//         }
//         if (next) {
//             paginationInfo.current.nextPage = page + 1;
//             if (paginationInfo.current.nextPage > paginationInfo.current.lastPage) {
//                 paginationInfo.current.hasNextPage = false;
//             }
//             if (postsData) {
//             }
//         } else {
//             paginationInfo.current.prevPage = page - 1;
//             if (paginationInfo.current.nextPage <= 0) {
//                 paginationInfo.current.hasPrevPage = false;
//             }
//         }
//     },
//     [client],
// );
