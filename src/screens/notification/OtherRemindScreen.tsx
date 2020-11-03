import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { PageContainer, StatusView, SpinnerLoading } from '@src/components';
import { Query, GQL, useApolloClient } from '@src/apollo';
import { QueryList } from '@src/content';
import NotificationItem from './components/NotificationItem';

export default (props: any) => {
    const client = useApolloClient();

    useEffect(() => {
        return () => {
            client.query({
                query: GQL.unreadsQuery,
                fetchPolicy: 'network-only',
            });
        };
    }, []);
    const renderItem = useCallback(({ item, index }) => {
        return <NotificationItem data={item} />;
    }, []);
    return (
        <PageContainer title="其他提醒" variables={{ fetchPolicy: 'network-only' }}>
            <View style={styles.container}>
                <QueryList
                    gqlDocument={GQL.otherNotificationsQuery}
                    options={{
                        fetchPolicy: 'network-only',
                    }}
                    dataOptionChain="notifications.data"
                    paginateOptionChain="notifications.paginatorInfo"
                    renderItem={renderItem}
                />
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
