import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { StatusView, UserItem } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { observer } from '@src/store';
import { observable } from 'mobx';

const index = observer(({ keyword }) => {
    const navigation = useNavigation();
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.searchUsersQuery, {
        variables: { keyword, type: 'POST', page: 1 },
        fetchPolicy: 'network-only',
    });
    let articles = useMemo(() => Helper.syncGetter('searchUsers.data', data), [data]);
    if (Array.isArray(articles)) {
        articles = observable(articles);
    }
    const currentPage = useMemo(() => Helper.syncGetter('searchUsers.paginatorInfo.currentPage', data) || 1, [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('searchUsers.paginatorInfo.hasMorePages', data), [data]);
    const fetchMoreArticles = useCallback(() => {
        if (hasMorePages) {
            fetchMore({
                variables: {
                    page: currentPage + 1,
                },
                updateQuery: (prev: any, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return Object.assign({}, prev, {
                        searchUsers: Object.assign({}, fetchMoreResult.searchUsers, {
                            data: [...prev.searchUsers.data, ...fetchMoreResult.searchUsers.data],
                        }),
                    });
                },
            });
        }
    }, [hasMorePages, currentPage]);

    const FooterComponent = useMemo(() => {
        const hasData = articles && articles.length > 0;
        if (loading || hasMorePages) {
            return (
                <View style={styles.listFooter}>
                    <ActivityIndicator size="small" color={Theme.primaryColor} />
                </View>
            );
        }
        if (hasData && !hasMorePages) {
            return (
                <View style={styles.listFooter}>
                    <Text style={styles.listFooterText}>没有更多了</Text>
                </View>
            );
        }
        return <StatusView.EmptyView style={{ marginVertical: pixel(20) }} />;
    }, [loading, articles, hasMorePages]);

    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                data={articles}
                keyExtractor={(item, i) => String(item.id || i)}
                renderItem={({ item }) => <UserItem user={item} navigation={navigation} />}
                onEndReachedThreshold={0.1}
                onEndReached={fetchMoreArticles}
                ListFooterComponent={FooterComponent}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,1)',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Device.bottomInset,
    },
    listFooter: {
        borderTopWidth: pixel(1),
        borderTopColor: '#f0f0f0',
        paddingVertical: pixel(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooterText: {
        fontSize: font(13),
        color: Theme.subTextColor,
    },
});

export default index;
