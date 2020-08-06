import React, { Component, useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import {
    PostItem,
    PageContainer,
    StatusView,
    SpinnerLoading,
    Footer,
    Placeholder,
    CustomRefreshControl,
    ItemSeparator,
} from '@src/components';
import { Query, GQL, useQuery } from '@src/apollo';
import { userStore } from '@src/store';
import { observable } from 'mobx';

export default (props: any) => {
    const { me } = userStore;
    const [observableArticles, setArticles] = useState(null);

    const { loading, error, data: userLikedArticlesQueryResult, refetch, fetchMore } = useQuery(
        GQL.userLikedArticlesQuery,
        {
            variables: { user_id: me.id },
            fetchPolicy: 'network-only',
        },
    );
    const articles = useMemo(() => Helper.syncGetter('likes.data', userLikedArticlesQueryResult), [
        userLikedArticlesQueryResult,
    ]);

    const hasMorePages = useMemo(
        () => Helper.syncGetter('likes.paginatorInfo.hasMorePages', userLikedArticlesQueryResult),
        [userLikedArticlesQueryResult],
    );
    const currentPage = useMemo(
        () => Helper.syncGetter('likes.paginatorInfo.currentPage', userLikedArticlesQueryResult),
        [userLikedArticlesQueryResult],
    );

    useEffect(() => {
        if (Array.isArray(articles)) {
            setArticles(observable(articles));
        }
    }, [articles]);

    if (loading || !observableArticles) return <SpinnerLoading />;
    console.log('loading', loading);
    console.log('!observableArticles', observableArticles);

    return (
        <PageContainer title="我的喜欢">
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={styles.contentContainer}
                    bounces={false}
                    data={observableArticles}
                    refreshing={loading}
                    refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEventThrottle={16}
                    renderItem={(item: any) => {
                        if (Helper.syncGetter('item.article', item)) {
                            return <PostItem post={item.item.article} />;
                        }
                    }}
                    ListEmptyComponent={
                        <StatusView.EmptyView imageSource={require('@app/assets/images/default_empty.png')} />
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
                    ListFooterComponent={() => (hasMorePages ? <Placeholder quantity={1} /> : null)}
                />
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.skinColor || '#FFF',
        flex: 1,
    },
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
    },
});
