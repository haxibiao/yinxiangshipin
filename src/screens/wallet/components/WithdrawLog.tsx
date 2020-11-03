import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusView } from '@src/components';
import { QueryList } from '@src/content';
import { GQL } from '@src/apollo';
import WithdrawLogItem from './WithdrawLogItem';

const WithdrawLog = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const wallet_id = route.params?.wallet_id;
    if (!wallet_id) {
        return (
            <View style={{ flex: 1 }}>
                <StatusView.EmptyView />
            </View>
        );
    }
    const renderItem = useCallback(({ item, index, data, page }) => {
        return <WithdrawLogItem item={item} navigation={navigation} />;
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <QueryList
                gqlDocument={GQL.userWithdraws}
                options={{
                    variables: {
                        wallet_id: wallet_id,
                    },
                    fetchPolicy: 'network-only',
                }}
                paginateOptionChain="withdraws.paginatorInfo"
                dataOptionChain="withdraws.data"
                renderItem={renderItem}
            />
        </View>
    );
};

export default WithdrawLog;

const styles = StyleSheet.create({
    item: {
        alignItems: 'center',
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
});
