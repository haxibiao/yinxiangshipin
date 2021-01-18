import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer, UserItem } from '@src/components';
import { GQL, useApolloClient } from '@src/apollo';
import { useNavigation } from '@react-navigation/native';
import { QueryList } from '@src/content';

export default (props: any) => {
    const client = useApolloClient();
    const navigation = useNavigation();
    useEffect(() => {
        return () => {
            client.query({
                query: GQL.unreadsQuery,
                fetchPolicy: 'network-only',
            });
        };
    }, []);
    const renderItem = useCallback((item, index) => {
        return <UserItem user={item.item.user} navigation={navigation} />;
    }, []);
    return (
        <PageContainer title="新的粉丝">
            <View style={styles.container}>
                <QueryList
                    gqlDocument={GQL.followersNotificationsQuery}
                    dataOptionChain="notifications.data"
                    paginateOptionChain="notifications.paginatorInfo"
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
        backgroundColor: Theme.skinColor || '#FFF',
        flex: 1,
    },
});
