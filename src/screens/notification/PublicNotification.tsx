import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavBarHeader } from '@src/components';
import { GQL, useApolloClient, useQuery } from '@src/apollo';
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
        <View style={styles.container}>
            <NavBarHeader title="系统通知" StatusBarProps={{ barStyle: 'dark-content' }} />
            <QueryList
                contentContainerStyle={{ flexGrow: 1, paddingTop: Theme.HOME_INDICATOR_HEIGHT + pixel(20) }}
                gqlDocument={GQL.publicNotificationQuery}
                options={{
                    fetchPolicy: 'network-only',
                }}
                dataOptionChain="notices.data"
                paginateOptionChain="notices.paginatorInfo"
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                inverted={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f4f4f4',
        flex: 1,
    },
});
