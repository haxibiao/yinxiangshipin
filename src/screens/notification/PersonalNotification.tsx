import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavBarHeader } from '@src/components';
import { GQL, useApolloClient, useQuery } from '@src/apollo';
import { userStore } from '@src/store';
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
            <NavBarHeader title="系统消息" StatusBarProps={{ barStyle: 'dark-content' }} />
            <QueryList
                contentContainerStyle={{ flexGrow: 1, paddingTop: Theme.bottomInset + pixel(20) }}
                gqlDocument={GQL.personalNotificationQuery}
                options={{
                    variables: {
                        user_id: userStore.me.id,
                    },
                    fetchPolicy: 'network-only',
                }}
                dataOptionChain="personalNotices.data"
                paginateOptionChain="personalNotices.paginatorInfo"
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
