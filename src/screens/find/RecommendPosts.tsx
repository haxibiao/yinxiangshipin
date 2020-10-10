import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observable, observer, userStore } from '@src/store';
import { QueryList, ContentStatus } from '@src/content';
import { MasonryList, ListFooter } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import PostItem from './components/PostItem';

const COVER_WIDTH = Device.WIDTH - pixel(Theme.itemSpace) * 3;
const itemWidth = (Device.WIDTH - pixel(Theme.itemSpace) * 3) / 2;
const minVideoHeight = (itemWidth * 2) / 3;
const maxVideoHeight = (itemWidth * 16) / 9;

function calculatorHeight({ item }) {
    if (item.video && item.video.info && item.video.info.width) {
        if (item.video.info.width >= item.video.info.height) {
            return Math.max(minVideoHeight, (itemWidth / item.video.info.width) * item.video.info.height);
        } else {
            return Math.min(maxVideoHeight, (itemWidth / item.video.info.width) * item.video.info.height);
        }
    } else if (Array.isArray(item.images) && item.images.length > 0) {
        if (item.images[0].width >= item.images[0].height) {
            return Math.max(minVideoHeight, (itemWidth / item.images[0].width) * item.images[0].height);
        } else {
            return Math.min(maxVideoHeight, (itemWidth / item.images[0].width) * item.images[0].height);
        }
    } else {
        return Math.min(maxVideoHeight, itemWidth);
    }
}

export default observer((props: any) => {
    let currentPage = 0;
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.publicPostsQuery, {
        variables: { page: currentPage, count: 10 },
        fetchPolicy: 'network-only',
    });
    currentPage = useMemo(() => Helper.syncGetter('publicPosts.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('publicPosts.paginatorInfo.hasMorePages', data), [data]);
    const publicPosts = useMemo(() => Helper.syncGetter('publicPosts.data', data) || [], [data]);
    const duringFetched = useRef(false);

    const onMomentumScrollBegin = useCallback(() => {
        duringFetched.current = false;
    }, []);

    const onEndReached = useCallback(() => {
        if (!duringFetched.current && hasMorePages) {
            duringFetched.current = true;
            fetchMore({
                variables: {
                    page: currentPage + 1,
                },
                updateQuery: (prev: any, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                        publicPosts: Object.assign({}, prev.publicPosts, {
                            data: [...prev.publicPosts.data, ...fetchMoreResult.publicPosts.data],
                            paginatorInfo: fetchMoreResult.publicPosts.paginatorInfo,
                        }),
                    });
                },
            });
        }
    }, [hasMorePages, currentPage]);

    const hiddenListFooter = publicPosts && publicPosts.length === 0;
    const renderFooterComponent = useCallback(() => {
        return <ListFooter hidden={hiddenListFooter} finished={!hasMorePages} />;
    }, [hiddenListFooter, hasMorePages]);

    const [recommendPosts, setPosts] = useState([]);
    useEffect(() => {
        if (Array.isArray(publicPosts)) {
            setPosts(observable(publicPosts));
        }
    }, [publicPosts]);

    const ListEmptyComponent = useCallback(() => {
        let status = '';
        switch (true) {
            case !!error:
                status = 'error';
                break;
            case loading:
                status = 'loading';
                break;
            case publicPosts?.length === 0:
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
    }, [error, loading, refetch, publicPosts]);

    const renderItem = useCallback(({ item, index }) => {
        return <PostItem post={item} itemWidth={itemWidth} itemHeight={COVER_WIDTH * 0.6} />;
    }, []);

    return (
        <MasonryList
            data={recommendPosts}
            numColumns={2}
            style={styles.masonryStyle}
            contentContainerStyle={styles.container}
            columnSpace={{ marginRight: pixel(Theme.itemSpace) }}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            refreshing={loading}
            onRefresh={refetch}
            ListEmptyComponent={ListEmptyComponent}
            keyExtractor={(item) => `id${item.id}`}
            getHeightForItem={calculatorHeight}
            onEndReachedThreshold={0.1}
            onEndReached={onEndReached}
            onMomentumScrollBegin={onMomentumScrollBegin}
            ListFooterComponent={renderFooterComponent}
        />
    );
});

const styles = StyleSheet.create({
    masonryStyle: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingBottom: pixel(Theme.BOTTOM_HEIGHT),
        paddingTop: pixel(Theme.itemSpace),
    },
});
