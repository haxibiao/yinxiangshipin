import React, { useEffect } from 'react';
import { Keys, Storage, userStore } from '@src/store';
import { useQuery } from '@apollo/react-hooks';
import { GQL } from '../gqls';

export function useRecallUserProfile() {
    const { data } = useQuery(GQL.MeMetaQuery, {
        fetchPolicy: 'network-only',
        skip: !userStore.login,
    });

    useEffect(() => {
        if (data?.me) {
            userStore.changeProfile(data?.me);
        }
    }, [data]);

    useEffect(() => {
        (async function getMeFormStorage() {
            const profile = await Storage.getItem(Keys.me);
            userStore.recallUser(profile);
        })();
    }, []);
}
