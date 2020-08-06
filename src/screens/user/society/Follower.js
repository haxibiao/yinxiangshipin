/*
 * @flow
 * created by wyk made in 2019-03-22 14:03:29
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

class Follower extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finished: false,
            firstFetch: true
        };
    }

    render() {
        const { navigation, user } = this.props;
        return (
            <Query query={GQL.userFollowersQuery} variables={{ user_id: user.id }} fetchPolicy="network-only">
                {({ loading, error, data, refetch, fetchMore }) => {
                    const followers = Helper.syncGetter('followers.data', data);
                    console.log("粉丝数据结果 : ",followers);
                    if(this.state.firstFetch){
                        var hasMorePages = Helper.syncGetter('followers.paginatorInfo.hasMorePages', data);
                        console.log("第一次取hasMorePages : ",hasMorePages);
                    }
                    let currentPage = Helper.syncGetter('followers.paginatorInfo.currentPage', data);
                    const empty = followers && followers.length === 0;
                    loading = !followers;
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
                                data={followers}
                                keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                                refreshControl={
                                    <CustomRefreshControl
                                        onRefresh={refetch}
                                        reset={() => this.setState({ finished: false })}
                                    />
                                }
                                renderItem={({ item, index }) => <UserItem navigation={navigation} user={item.user} />}
                                onEndReachedThreshold={0.1}
                                onEndReached={() => {
                                    console.log('hasMorePages', hasMorePages);
                                    if (hasMorePages) {
                                        fetchMore({
                                            variables: {
                                                page: ++currentPage,
                                            },
                                            updateQuery: (prev, { fetchMoreResult: more }) => {
                                                this.setState({firstFetch: false});
                                                console.log("重新请求拿到的数据 : ",more);
                                                hasMorePages = Helper.syncGetter('followers.paginatorInfo.hasMorePages', more);
                                                return {
                                                    followers: {
                                                        ...prev.followers,
                                                        data: [...prev.followers.data, ...more.followers.data],
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

export default Follower;
