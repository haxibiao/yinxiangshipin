/*
 * @flow
 * created by wyk made in 2019-03-22 14:03:42
 */

import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, FlatList } from 'react-native';
import {
    PageContainer,
    UserItem,
    TouchFeedback,
    Iconfont,
    Placeholder,
    StatusView,
    ListFooter,
    CustomRefreshControl,
} from '@src/components';
import { Query, GQL } from '@src/apollo';

class Following extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
        };
    }

    render() {
        const { navigation, user } = this.props;
        return (
            <Query query={GQL.followedUsersQuery} variables={{ user_id: user.id }} fetchPolicy="network-only">
                {({ loading, error, data, refetch, fetchMore }) => {
                    const follows = Helper.syncGetter('follows.data', data);
                    const hasMorePages = Helper.syncGetter('followers.paginatorInfo.hasMorePages', data);
                    let currentPage = Helper.syncGetter('followers.paginatorInfo.currentPage', data);
                    const empty = follows && follows.length === 0;
                    loading = !follows;
                    return (
                        <PageContainer
                            hiddenNavBar
                            refetch={refetch}
                            error={error}
                            loading={loading}
                            empty={empty}
                            loadingSpinner={<Placeholder quantity={10} type="list" />}>
                            <FlatList
                                style={{ flex: 1 }}
                                data={follows}
                                keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                                refreshControl={
                                    <CustomRefreshControl
                                        onRefresh={refetch}
                                        reset={() => this.setState({ finished: false })}
                                    />
                                }
                                renderItem={({ item, index }) => (
                                    <UserItem navigation={navigation} user={item.people} />
                                )}
                                onEndReachedThreshold={0.3}
                                onEndReached={() => {
                                    if (hasMorePages) {
                                        fetchMore({
                                            variables: {
                                                page: ++currentPage,
                                            },
                                            updateQuery: (prev, { fetchMoreResult: more }) => {
                                                return {
                                                    notifications: {
                                                        ...more.notifications,
                                                        data: [...prev.notifications.data, ...more.notifications.data],
                                                    },
                                                };
                                            },
                                        });
                                    } else {
                                        this.setState({ finished: true });
                                    }
                                }}
                                ListFooterComponent={() => <ListFooter finished={this.state.finished} />}
                            />
                        </PageContainer>
                    );
                }}
            </Query>
        );
    }
}

const styles = StyleSheet.create({});

export default Following;
