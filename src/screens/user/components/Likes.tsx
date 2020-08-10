import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { HPageViewHoc } from 'components/ScrollHeaderTabView';
import { StatusView, Placeholder, CustomRefreshControl, SpinnerLoading } from '@src/components';
import { PostItem } from '@src/content';
import { observer, userStore } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';
import { observable } from 'mobx';

const HFlatList = HPageViewHoc(FlatList);

export default (props: any) => {
    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.userLikedArticlesQuery, {
        variables: { user_id: props.user.id },
        fetchPolicy: 'network-only',
    });
    const likesData = useMemo(() => Helper.syncGetter('likes.data', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('likes.paginatorInfo.hasMorePages', data), [data]);
    const currentPage = useMemo(() => Helper.syncGetter('likes.paginatorInfo.currentPage', data), [data]);

    const renderItem = useCallback(({ item }) => {
        if (Helper.syncGetter('article', item)) {
            return <PostItem data={item.article} />;
        }
    }, []);

    return (
        <HFlatList
            {...props}
            bounces={false}
            data={likesData}
            refreshing={loading}
            refreshControl={<CustomRefreshControl onRefresh={refetch} />}
            keyExtractor={(item, index) => String(item.id || index)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
                !loading &&
                likesData && (
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
                            if (more && more.likes) {
                                return {
                                    likes: {
                                        ...more.likes,
                                        data: [...prev.likes.data, ...more.likes.data],
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

const styles = StyleSheet.create({
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
