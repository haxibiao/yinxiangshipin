import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { Header, CustomTabBar, Screen, ContentEnd, LoadingError, SpinnerLoading, BlankContent } from '@src/components';
import NotificationItem from './NotificationItem';

import { Query, GQL } from '@src/apollo';
import store from '@src/store';
import { Colors } from '@src/common';

const CategoryScreen = (props: any) => {
    const { user } = props;
    const navigation = useNavigation();
    const route = useRoute();
    const category = route.params?.category || {};
    const [keywords, setKeywords] = React.useState('');
    const [fetchingMore, setFetchingMore] = React.useState(true);

    return (
        <Screen header={<Header routeName={category.name} />}>
            <View style={styles.container}>
                <ScrollableTabView renderTabBar={() => <CustomTabBar tabUnderlineWidth={40} />}>
                    <View style={styles.container} tabLabel={'全部'}>
                        <Query
                            query={GQL.categoryPendingArticlesQuery}
                            variables={{ category_id: category.id, filter: 'ALL' }}>
                            {(res: { loading: any, error: any, data: any, refetch: any, fetchMore: any }) => {
                                const { loading, error, data, refetch, fetchMore } = res;
                                if (error) {
                                    return <LoadingError reload={() => refetch()} />;
                                }
                                if (!(data && data.category)) {
                                    return <SpinnerLoading />;
                                }
                                if (data.category.articles.length < 1) {
                                    return <BlankContent />;
                                }
                                return (
                                    <FlatList
                                        data={data.category.articles}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <NotificationItem article={item} navigation={navigation} />
                                        )}
                                        ListFooterComponent={() => {
                                            return <ContentEnd />;
                                        }}
                                    />
                                );
                            }}
                        </Query>
                    </View>
                    <View style={styles.container} tabLabel={'未处理'}>
                        {/*PEDING（pending） 后端参数单词错误**/}
                        <Query
                            query={GQL.categoryPendingArticlesQuery}
                            variables={{ category_id: category.id, filter: 'PEDING' }}>
                            {(res: { loading: any, error: any, data: any, refetch: any, fetchMore: any }) => {
                                const { loading, error, data, refetch, fetchMore } = res;
                                if (error) {
                                    return <LoadingError reload={() => refetch()} />;
                                }
                                if (!(data && data.category)) {
                                    return <SpinnerLoading />;
                                }
                                if (data.category.articles.length < 1) {
                                    return <BlankContent />;
                                }
                                return (
                                    <FlatList
                                        data={data.category.articles}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <NotificationItem article={item} navigation={navigation} />
                                        )}
                                        ListFooterComponent={() => {
                                            return <ContentEnd />;
                                        }}
                                    />
                                );
                            }}
                        </Query>
                    </View>
                </ScrollableTabView>
            </View>
        </Screen>
    );
};

export default CategoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.skinColor,
    },
});
