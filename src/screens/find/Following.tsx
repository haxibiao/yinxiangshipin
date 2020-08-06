import React, { useContext, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, Placeholder, StatusView, DynamicItem, Footer } from '@src/components';
import { GQL, useQuery, useLazyQuery } from '@src/apollo';
import StoreContext, { observer, appStore, userStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDetainment } from '@src/common';
import { observable } from 'mobx';

export default observer((props: any) => {
    const navigation = useNavigation();
    // useDetainment(navigation);
    const { me } = userStore;
    let currentPage = 0;
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.followedArticlesQuery, {
        variables: { page: currentPage, user_id: me.id },
    });

    let followedArticles = useMemo(() => Helper.syncGetter('followedArticles.data', data), [data]);
    currentPage = useMemo(() => Helper.syncGetter('followedArticles.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('followedArticles.paginatorInfo.hasMorePages', data), [data]);
    const fetchMoreArticles = useCallback(() => {
        if (hasMorePages) {
            fetchMore({
                variables: {
                    page: currentPage + 1,
                },
                updateQuery: (prev: any, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                        followedArticles: Object.assign({}, fetchMoreResult.followedArticles, {
                            data: [...prev.followedArticles.data, ...fetchMoreResult.followedArticles.data],
                        }),
                    });
                },
            });
        }
    }, [hasMorePages, currentPage]);
    if (Array.isArray(followedArticles)) {
        followedArticles = observable(followedArticles);
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={followedArticles}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                renderItem={({ item, index }) => <DynamicItem post={item} />}
                refreshing={loading}
                onRefresh={refetch}
                onEndReachedThreshold={0.01}
                onEndReached={fetchMoreArticles}
                ListEmptyComponent={() => <StatusView.EmptyView />}
                ListFooterComponent={() => (hasMorePages ? <Placeholder quantity={1} /> : <Footer finished={true} />)}
                ItemSeparatorComponent={() => <View style={{ height: pixel(1), backgroundColor: '#EAEAEA' }} />}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
