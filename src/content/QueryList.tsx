import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, FlatListProperties, ViewStyle, RefreshControl } from 'react-native';
import { QueryHookOptions } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import { GQL, useQuery } from '@src/apollo';
import { syncGetter } from '@src/common';
import { mergeProperty } from './helper';
import ContentStatus from './ContentStatus';

interface Props extends FlatListProperties {
    gqlDocument?: DocumentNode;
    dataOptionChain?: string;
    paginateOptionChain?: string;
    style?: ViewStyle;
    options?: QueryHookOptions;
}

export default React.forwardRef(function ContentList(
    {
        gqlDocument,
        dataOptionChain = 'publicPosts.data',
        paginateOptionChain = 'publicPosts.paginatorInfo',
        options,
        renderItem,
        ListFooterComponent,
        ListEmptyComponent,
        ...contentProps
    }: Props,
    listRef,
): JSX.Element {
    const { loading, error, data, fetchMore, refetch } = useQuery(gqlDocument || GQL.publicPostsQuery, options);
    const listData = useMemo(() => syncGetter(dataOptionChain, data), [data]);
    const nextPage = useMemo(() => syncGetter(paginateOptionChain + '.currentPage', data) + 1 || 2, [data]);
    const hasMore = useMemo(() => syncGetter(paginateOptionChain + '.hasMorePages', data), [data]);
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
    }, [nextPage, hasMore]);

    const renderItemComponent = useCallback(
        ({ item, index }) => {
            if (renderItem instanceof Function) {
                return renderItem({ item, index, data: listData, page: nextPage });
            }
            return null;
        },
        [renderItem, listData, nextPage],
    );

    const listFooter = useCallback(() => {
        let footer = null;
        if (ListFooterComponent instanceof Function) {
            footer = ListFooterComponent({ loading, hasMore, data: listData });
        }
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
    }, [ListFooterComponent, loading, listData, hasMore]);

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
        if (ListEmptyComponent instanceof Function) {
            return ListEmptyComponent({ status });
        } else if (status) {
            return <ContentStatus status={status} refetch={status === 'error' ? refetch : undefined} />;
        } else {
            return null;
        }
    }, [ListEmptyComponent, loading, listData, error, refetch]);
    // console.log('listData,', data, listData);
    return (
        <FlatList
            contentContainerStyle={styles.container}
            ref={listRef}
            data={listData}
            keyExtractor={(item, index) => String(item.id || index)}
            refreshControl={
                <RefreshControl onRefresh={refetch} refreshing={!!listData && loading} colors={[Theme.primaryColor]} />
            }
            renderItem={renderItemComponent}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            ListFooterComponent={listFooter}
            ListEmptyComponent={listEmpty}
            {...contentProps}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
