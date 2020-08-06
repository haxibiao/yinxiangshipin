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

    const { loading, error, data: userVisitsQueryResult, refetch, fetchMore } = useQuery(GQL.userVisitsQuery, {
        variables: { user_id: me.id },
        fetchPolicy: 'network-only',
    });
    const articles = useMemo(() => Helper.syncGetter('visits.data', userVisitsQueryResult), [userVisitsQueryResult]);

    const hasMorePages = useMemo(() => Helper.syncGetter('visits.paginatorInfo.hasMorePages', userVisitsQueryResult), [
        userVisitsQueryResult,
    ]);
    const currentPage = useMemo(() => Helper.syncGetter('visits.paginatorInfo.currentPage', userVisitsQueryResult), [
        userVisitsQueryResult,
    ]);

    console.log('浏览记录：', userVisitsQueryResult);

    useEffect(() => {
        if (Array.isArray(articles)) {
            setArticles(observable(articles));
        }
    }, [articles]);

    if (loading || !observableArticles) return <SpinnerLoading />;
    // console.log("loading",loading);
    // console.log("!observableArticles",observableArticles);
    console.log('要是有事也是一样啥意思呀', Theme.groundColour);

    return (
        <PageContainer title="浏览记录">
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
                        if (item && item.item && item.item.article) {
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
                                    if (more && more.visits) {
                                        return {
                                            visits: {
                                                ...more.visits,
                                                data: [...prev.visits.data, ...more.visits.data],
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
        backgroundColor: '#fff',
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
});
