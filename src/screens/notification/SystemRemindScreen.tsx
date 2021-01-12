import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer, StatusView, SpinnerLoading } from '@src/components';
import { Query, GQL, useApolloClient, useQuery } from '@src/apollo';
import { QueryList } from '@src/content';
import SystemNotificationInfo from './components/SystemNotificationInfo';

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
        return <SystemNotificationInfo data={item} />;
    }, []);
    return (
        <PageContainer title="系统提醒" variables={{ fetchPolicy: 'network-only' }}>
            <View style={styles.container}>
                <QueryList
                    gqlDocument={GQL.systemNotificationPublic}
                    options={{
                        fetchPolicy: 'network-only',
                    }}
                    dataOptionChain="notices.data"
                    paginateOptionChain="notices.paginatorInfo"
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.groundColour || '#FFF',
        flex: 1,
        alignItems: 'center',
    },
});
