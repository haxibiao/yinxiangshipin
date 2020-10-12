import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observable, observer } from '@src/store';
import { QueryList, ContentStatus } from '@src/content';
import { MasonryList, ListFooter } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import PostItem from './components/PostItem';

const itemWidth = (Device.WIDTH - pixel(6) * 3) / 2;
const minVideoHeight = itemWidth * 0.6;
const maxVideoHeight = itemWidth * 1.4;

function calculatorHeight({ item }) {
    if (item.video && item.video.width) {
        if (item.video.width >= item.video.height) {
            return Math.max(minVideoHeight, (itemWidth / item.video.width) * item.video.height);
        } else {
            return Math.min(maxVideoHeight, (itemWidth / item.video.width) * item.video.height);
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
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.publicPostsQuery, {
        variables: { page: 1, count: 10 },
        fetchPolicy: 'network-only',
    });
    const currentPage = useMemo(() => data?.publicPosts?.paginatorInfo?.currentPage, [data]);
    const hasMorePages = useMemo(() => data?.publicPosts?.paginatorInfo?.hasMorePages, [data]);
    const publicPosts = useMemo(() => {
        const posts = data?.publicPosts?.data;
        if (posts?.length > 0) {
            return observable(posts);
        }
        return [];
    }, [data]);
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

    const renderFooterComponent = useCallback(() => {
        return <ListFooter hidden={loading} finished={!hasMorePages} />;
    }, [loading, hasMorePages]);

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
        return <PostItem post={item} itemWidth={itemWidth} itemHeight={calculatorHeight({ item })} />;
    }, []);

    return (
        <MasonryList
            data={publicPosts}
            numColumns={2}
            style={styles.masonryStyle}
            contentContainerStyle={styles.container}
            columnSpace={{ marginRight: pixel(6) }}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
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
        backgroundColor: '#f6f6f6',
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: pixel(6),
        paddingBottom: pixel(Theme.BOTTOM_HEIGHT),
        paddingTop: pixel(10),
    },
});
