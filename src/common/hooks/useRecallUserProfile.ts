import React, { useEffect } from 'react';
import { RecordKeys, Storage, userStore } from '@src/store';
import { useQuery } from '@apollo/react-hooks';
import { GQL } from '@src/apollo';

export const useRecallUserProfile = (isLogin: boolean) => {
    const { data } = useQuery(GQL.meMateQuery, {
        fetchPolicy: 'network-only',
        skip: !isLogin,
    });

    useEffect(() => {
        if (data?.me) {
            userStore.changeProfile(data?.me);
        }
    }, [data]);

    useEffect(() => {
        (async function getMeFormStorage() {
            const profile = await Storage.getItem(RecordKeys.me);
            userStore.recallUser(profile);
        })();
    }, []);
};
