import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { HPageViewHoc } from 'components/ScrollHeaderTabView';
import { PostItem, StatusView, Placeholder, CustomRefreshControl, SpinnerLoading } from '@src/components';
import { observer, userStore } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';
import { observable } from 'mobx';

const HFlatList = HPageViewHoc(FlatList);

export default (props: any) => {
    const [observableArticles, setArticles] = useState(null);

    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.userLikedArticlesQuery, {
        variables: { user_id: props.user.id },
        fetchPolicy: 'network-only',
    });
    const articles = useMemo(() => Helper.syncGetter('likes.data', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('likes.paginatorInfo.hasMorePages', data), [data]);
    const currentPage = useMemo(() => Helper.syncGetter('likes.paginatorInfo.currentPage', data), [data]);

    useEffect(() => {
        if (Array.isArray(articles)) {
            setArticles(observable(articles));
        }
    }, [articles]);

    const renderItem = useCallback(({ item }) => {
        if (Helper.syncGetter('article', item)) {
            return <PostItem post={item.article} />;
        }
    }, []);

    return (
        <HFlatList
            {...props}
            bounces={false}
            data={observableArticles}
            refreshing={loading}
            refreshControl={<CustomRefreshControl onRefresh={refetch} />}
            keyExtractor={(item, index) => String(item.id || index)}
            renderItem={renderItem}
            ListEmptyComponent={
                !loading &&
                observableArticles && (
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
                            if (more && more.articles) {
                                return {
                                    articles: {
                                        ...more.articles,
                                        data: [...prev.articles.data, ...more.articles.data],
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
