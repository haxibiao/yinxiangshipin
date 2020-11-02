import React, { useCallback, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { userStore } from '@src/store';
import { GQL } from '../gqls';

export function usePreloadData(isLogin: boolean) {
    const [loadWithdrawAmountList, { called }] = useLazyQuery(GQL.getWithdrawAmountList, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (isLogin) {
            if (!called) {
                loadWithdrawAmountList();
            }
        }
    }, [isLogin, called]);
}
