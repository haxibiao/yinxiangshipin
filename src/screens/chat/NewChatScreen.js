import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { Colors } from '@src/common';
import {
    Screen,
    SearchTypeHeader,
    Button,
    UserGroup,
    LoadingError,
    SpinnerLoading,
    BlankContent,
} from '@src/components';

import { Query, GQL } from '@src/apollo';
import store from '@src/store';

class NewChatScreen extends Component {
    constructor(props) {
        super(props);
        this.keywords = '';
        this.state = {
            search: false,
        };
    }

    render() {
        let { me: user } = store;
        let { search } = this.state;
        return (
            <Screen header>
                <View style={styles.container}>
                    <SearchTypeHeader
                        placeholder="搜索用户昵称"
                        keywords={this.keywords}
                        changeKeywords={this.changeKeywords.bind(this)}
                        handleSearch={() => this.handleSearch(this.keywords)}
                    />
                    {search ? (
                        <Query query={GQL.searchUsersQuery} variables={{ keyword: this.keywords }}>
                            {({ loading, error, data, refetch, fetchMore }) => {
                                if (loading || error) return null;
                                let {
                                    data: items,
                                    paginatorInfo: { currentPage, hasMorePages },
                                } = data.searchUsers;
                                return (
                                    <FlatList
                                        data={items}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={this._renderFriendItem}
                                        onEndReached={() => {
                                            hasMorePages &&
                                                fetchMore({
                                                    variables: {
                                                        page: ++currentPage,
                                                    },
                                                    updateQuery: (prev, { fetchMoreResult: more }) => {
                                                        return Object.assign({}, prev, {
                                                            users: [...prev.users, ...fetchMoreResult.users],
                                                        });
                                                    },
                                                });
                                        }}
                                        getItemLayout={(data, index) => ({
                                            length: 77,
                                            offset: 77 * index,
                                            index,
                                        })}
                                    />
                                );
                            }}
                        </Query>
                    ) : (
                        <Query query={GQL.userFriendsQuery} variables={{ user_id: user.id }}>
                            {({ loading, error, data, refetch, fetchMore }) => {
                                if (error) return <LoadingError reload={() => refetch()} />;
                                if (loading) return <SpinnerLoading />;
                                if (data.friends.length < 1) {
                                    return <BlankContent />;
                                }
                                return (
                                    <FlatList
                                        ListHeaderComponent={this.listHeader}
                                        data={data.friends}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={this._renderFriendItem}
                                        getItemLayout={(data, index) => ({
                                            length: 77,
                                            offset: 77 * index,
                                            index,
                                        })}
                                    />
                                );
                            }}
                        </Query>
                    )}
                </View>
            </Screen>
        );
    }

    _renderFriendItem = ({ item }) => {
        let { navigation } = this.props;
        let user = item;
        return (
            <View style={styles.friendItem}>
                <UserGroup
                    navigation={navigation}
                    user={user}
                    rightButton={
                        <View style={{ width: 56, height: 28 }}>
                            <Button
                                outline
                                fontSize={13}
                                name="写信"
                                handler={() =>
                                    navigation.navigate('聊天页', {
                                        withUser: user,
                                    })
                                }
                            />
                        </View>
                    }
                />
            </View>
        );
    };

    listHeader() {
        return (
            <View style={styles.follows}>
                <Text
                    style={{
                        fontSize: font(13),
                        color: Colors.lightFontColor,
                    }}>
                    你关注的人
                </Text>
            </View>
        );
    }

    changeKeywords(keywords) {
        this.keywords = keywords;
        if (this.keywords.length < 1) {
            this.setState({ search: false });
        }
    }

    handleSearch(keywords) {
        this.keywords = keywords;
        if (this.keywords.length > 0) {
            this.setState({
                search: true,
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.skinColor,
    },
    follows: {
        paddingLeft: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightBorderColor,
    },
    friendItem: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightBorderColor,
    },
});

export default NewChatScreen;
