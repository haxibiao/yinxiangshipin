import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer } from '@src/components';
import { GQL, useApolloClient } from '@src/apollo';
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
        <PageContainer title="评论和@">
            <View style={styles.container}>
                <QueryList
                    dataOptionChain="notifications.data"
                    paginateOptionChain="notifications.paginatorInfo"
                    gqlDocument={GQL.commentNotificationQuery}
                    options={{
                        fetchPolicy: 'network-only',
                    }}
                    renderItem={renderItem}
                />
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flex: 1,
    },
});
