/*
 * @flow
 * created by wyk made in 2019-03-22 14:03:42
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import { UserItem } from '@src/components';
export default function Following(props: any) {
    const { navigation, user } = props;
    return (
        <QueryList
            gqlDocument={GQL.followedUsersQuery}
            dataOptionChain="follows.data"
            paginateOptionChain="follows.paginatorInfo"
            options={{
                variables: {
                    user_id: user.id,
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={({ item, index, data, page }) => <UserItem navigation={navigation} user={item.people} />}
        />
    );
}
