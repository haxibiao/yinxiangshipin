import React, { useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, RefreshControl } from 'react-native';
import { FlatList } from '@app/src/components/ScrollHeadTabView';
import { StatusView, Placeholder } from '@src/components';
import { ContentStatus, PostItem } from '@src/content';
import { syncGetter, mergeProperty } from '@src/common';
import { useQuery } from '@src/apollo';

export default ({ gqlDocument, options, dataOptionChain, paginateOptionChain, ...props }: any) => {
    const { loading, error, data, fetchMore, refetch } = useQuery(gqlDocument, options);
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

    return (
        <FlatList
            bounces={false}
            data={listData}
            keyExtractor={(item, index) => String(item.id || index)}
            refreshControl={
                <RefreshControl onRefresh={refetch} refreshing={!!listData && loading} colors={[Theme.primaryColor]} />
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            ListEmptyComponent={
                !loading &&
                listData && (
                    <StatusView.EmptyView
                        title="此处空空如也"
                        imageSource={require('@app/assets/images/default/common_empty_default.png')}
                    />
                )
            }
            ListFooterComponent={() => (hasMore || loading ? <Placeholder quantity={1} /> : null)}
            renderItem={({ item }) => {
                return <PostItem data={item} />;
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
