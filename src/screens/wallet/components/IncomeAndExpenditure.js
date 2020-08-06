/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */

import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, RefreshControl } from 'react-native';
import { Footer, SpinnerLoading, LoadingError, StatusView } from '@src/components';

import { Query, GQL } from '@src/apollo';

import { userStore } from '@src/store';

import IncomeAndExpenditureItem from './IncomeAndExpenditureItem';

class IntegralDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            fetching: false,
        };
    }

    render() {
        let { me: user } = userStore;
        return (
            <View style={{ flex: 1 }}>
                <Query query={GQL.goldsHistoryQuery} variables={{ user_id: user.id }}>
                    {({ loading, error, data, fetchMore, refetch }) => {
                        if (loading) return <SpinnerLoading />;
                        if (error) return <LoadingError reload={() => refetch()} />;
                        let {
                            data: items,
                            paginatorInfo: { currentPage, hasMorePages },
                        } = data.golds;
                        console.log(data);
                        if (items.length < 1) return <StatusView.EmptyView />;

                        return (
                            <FlatList
                                data={items}
                                keyextractor={index => index.toString()}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
                                renderItem={({ item }) => {
                                    return <IncomeAndExpenditureItem item={item} />;
                                }}
                                onEndReachedThreshold={0.1}
                                onEndReached={() => {
                                    if (!this.state.fetching && hasMorePages) {
                                        // this.setState({ fetching: true });
                                        fetchMore({
                                            variables: {
                                                page: ++currentPage,
                                            },
                                            updateQuery: (prev, { fetchMoreResult: more }) => {
                                                // this.setState({ fetching: false });
                                                return {
                                                    golds: {
                                                        ...more.golds,
                                                        data: [...prev.golds.data, ...more.golds.data],
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
    }
}

export default IntegralDetail;
