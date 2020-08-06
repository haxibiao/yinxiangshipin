import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { HPageViewHoc } from 'components/ScrollHeaderTabView';
import { StatusView, Placeholder, CustomRefreshControl, SpinnerLoading } from '@src/components';
import { PostItem } from '@src/content';
import { observer, userStore } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';
import { observable } from 'mobx';

const HFlatList = HPageViewHoc(FlatList);

export default (props: any) => {
    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.postsQuery, {
        variables: { user_id: props.user.id },
    });
    const posts = useMemo(() => Helper.syncGetter('posts.data', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('posts.paginatorInfo.hasMorePages', data), [data]);
    const currentPage = useMemo(() => Helper.syncGetter('posts.paginatorInfo.currentPage', data), [data]);

    const renderItem = useCallback(({ item }) => {
        return <PostItem data={item} />;
    }, []);

    return (
        <HFlatList
            {...props}
            bounces={false}
            data={posts}
            refreshing={loading}
            refreshControl={<CustomRefreshControl onRefresh={refetch} />}
            keyExtractor={(item: any, index: number) => String(index || item.id)}
            renderItem={renderItem}
            ListEmptyComponent={
                !loading &&
                posts && (
                    <StatusView.EmptyView
                        title="TA还没有作品"
                        imageSource={require('@app/assets/images/default_empty.png')}
                    />
                )
            }
            onEndReached={() => {
                if (hasMorePages) {
                    fetchMore({
                        variables: {
                            page: currentPage + 1,
                        },
                        updateQuery: (prev: any, { fetchMoreResult: more }) => {
                            if (more && more.posts) {
                                return {
                                    posts: {
                                        ...more.posts,
                                        data: [...prev.posts.data, ...more.posts.data],
                                    },
                                };
                            }
                        },
                    });
                }
            }}
            ListFooterComponent={() => (hasMorePages || loading ? <Placeholder quantity={1} /> : null)}
        />
    );
};
