import React, { Component, useEffect, useCallback, useMemo, useRef } from 'react';
import { RefreshControl, View, FlatList } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation, useRoute } from '@react-navigation/native';

import { PageContainer, ScrollTabBar } from '@src/components';
import WithdrawLog from './components/WithdrawLog';
import IncomeAndExpenditure from './components/IncomeAndExpenditure';
import ContributionLog from './components/ContributionLog';

const WithdrawHistory = () => {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <PageContainer title="我的账单" white>
            <ScrollableTabView
                renderTabBar={(props: any) => <ScrollTabBar {...props} tabUnderlineWidth={pixel(30)} />}
                initialPage={route.params?.tabPage || 0}
                prerenderingSiblingsNumber={route.params?.tabPage || 0}>
                <WithdrawLog navigation={navigation} tabLabel="提现" />
                <ContributionLog navigation={navigation} tabLabel={Config.limitAlias} />
                <IncomeAndExpenditure navigation={navigation} tabLabel="明细" />
            </ScrollableTabView>
        </PageContainer>
    );
};

export default WithdrawHistory;
