import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, StatusView, SpinnerLoading, UserItem } from '@src/components';
import { Query, GQL, useApolloClient } from '@src/apollo';

export default (props: any) => {
    const client = useApolloClient();

    useEffect(() => {
        return () => {
            client.query({
                query: GQL.unreadsQuery,
                fetchPolicy: 'network-only',
            });

            console.log('out');
        };
    }, []);
    return (
        <PageContainer title="新的粉丝">
            <View style={styles.container}>
                <Query query={GQL.followersNotificationsQuery} variables={{ fetchPolicy: 'network-only' }}>
                    {({ loading, error, data, refetch, fetchMore }) => {
                        const items = data?.notifications?.data;
                        if (error) return <StatusView.ErrorView onPress={refetch} error={error} />;
                        if (!items && loading) return <SpinnerLoading />;
                        if (items.length <= 0) return <StatusView.EmptyView />;
                        const { hasMorePages, currentPage } = data?.notifications?.paginatorInfo;
                        return (
                            <FlatList
                                data={items}
                                renderItem={({ item }) => <UserItem user={item.user} />}
                                onEndReached={() => {
                                    if (hasMorePages) {
                                        fetchMore({
                                            variables: {
                                                page: currentPage + 1,
                                            },
                                            updateQuery: (prev, { fetchMoreResult }) => {
                                                if (fetchMoreResult && fetchMoreResult.notifications) {
                                                    return Object.assign({}, prev, {
                                                        notifications: Object.assign({}, prev.notifications, {
                                                            paginatorInfo: fetchMoreResult.notifications.paginatorInfo,
                                                            data: [
                                                                ...prev.notifications.data,
                                                                ...fetchMoreResult.notifications.data,
                                                            ],
                                                        }),
                                                    });
                                                }
                                            },
                                        });
                                    }
                                }}
                            />
                        );
                    }}
                </Query>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.skinColor || '#FFF',
        flex: 1,
    },
});
