/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import { userStore } from '@src/store';
import IncomeAndExpenditureItem from './IncomeAndExpenditureItem';

export default function IntegralDetail(props: any) {
    const { me: user } = userStore;
    const renderItem = useCallback(({ item, index, data, page }) => {
        return <IncomeAndExpenditureItem item={item} />;
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <QueryList
                gqlDocument={GQL.goldsHistoryQuery}
                dataOptionChain="golds.data"
                paginateOptionChain="golds.paginatorInfo"
                options={{
                    variables: {
                        user_id: user.id,
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
