import React, { Component, useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl } from 'react-native';
// import { ErrorView, LoadingSpinner, EmptyView, } from '@src/components';
import { Footer, SpinnerLoading, LoadingError, StatusView } from '@src/components';

import { Query, GQL, useQuery } from '@src/apollo';
import { userStore } from '@src/store';
import ContributionLogItem from './ContributionLogItem';

const ContributionLog = (props: any) => {
    const { navigation } = props;
    let { me: user } = userStore;
    let lod_page = 0;

    return (
        <View style={{ flex: 1 }}>
            <Query query={GQL.userContributesQuery} variables={{ user_id: user.id }}>
                {(e: any) => {
                    const { loading, error, data, fetchMore, refetch } = e;
                    if (loading) return <SpinnerLoading />;
                    if (error) return <LoadingError reload={() => refetch()} />;
                    let {
                        data: items,
                        paginatorInfo: { currentPage, hasMorePages },
                    } = data.contributes;

                    if (items.length < 1) return <StatusView.EmptyView />;
                    console.log(`${Config.limitAlias}明细：`,items);
                    
                    return (
                        <FlatList
                            data={items}
                            keyextractor={(index: any) => index.toString()}
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
                            renderItem={({ item }) => {
                                return <ContributionLogItem item={item} navigation={navigation} />;
                            }}
                            onEndReachedThreshold={0.1}
                            onEndReached={() => {
                                console.log("页面",lod_page);    
                                if (currentPage !== lod_page && hasMorePages) {
                                    lod_page = currentPage;
                                    fetchMore({
                                        variables: {
                                            page: ++currentPage,
                                        },
                                        updateQuery: (prev: any, { fetchMoreResult: more }) => {
                                            return {
                                                contributes: {
                                                    ...more.contributes,
                                                    data: [...prev.contributes.data, ...more.contributes.data],
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

export default ContributionLog;
