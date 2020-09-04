import React from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { ErrorView, LoadingSpinner, EmptyView, } from '@src/components';
import { Footer, SpinnerLoading, LoadingError, StatusView } from '@src/components';

import { Query, GQL, useQuery } from '@src/apollo';
import { userStore } from '@src/store';
import WithdrawLogItem from './WithdrawLogItem';

const WithdrawLog = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [finished, setFinished] = React.useState(false);
    const [fetching, setFetching] = React.useState(false);

    const wallet_id = route.params?.wallet_id;
    if (!wallet_id) {
        return (
            <View style={{ flex: 1 }}>
                <StatusView.EmptyView />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Query query={GQL.userWithdraws} variables={{ wallet_id }} fetchPolicy="network-only">
                {(res: { loading: any, error: any, data: any, refetch: any, fetchMore: any }) => {
                    const { loading, error, data, refetch, fetchMore } = res;
                    if (loading) return <SpinnerLoading />;
                    if (error) return <LoadingError reload={() => refetch()} />;
                    let {
                        data: items,
                        paginatorInfo: { currentPage, hasMorePages },
                    } = data.withdraws;

                    // console.log('data', data);

                    if (items.length < 1) return <StatusView.EmptyView />;
                    return (
                        <FlatList
                            data={items}
                            keyExtractor={(index: any) => index.toString()}
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
                            renderItem={({ item }) => {
                                return <WithdrawLogItem item={item} navigation={navigation} />;
                            }}
                            onEndReachedThreshold={0.1}
                            onEndReached={() => {
                                if (!fetching && hasMorePages) {
                                    setFetching(true);
                                    fetchMore({
                                        variables: {
                                            page: ++currentPage,
                                        },
                                        updateQuery: (prev: any, { fetchMoreResult: more }) => {
                                            setFetching(false);
                                            return {
                                                withdraws: {
                                                    ...more.withdraws,
                                                    data: [...prev.withdraws.data, ...more.withdraws.data],
                                                },
                                            };
                                        },
                                    });
                                }
                            }}
                            ListFooterComponent={() => <Footer finished={!hasMorePages} />}
                        />
                    );
                }}
            </Query>
        </View>
    );
};

export default WithdrawLog;

const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
});
