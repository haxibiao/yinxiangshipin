import React from 'react';
import { UserItem } from '@src/components';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
export default function Follower(props: any) {
    const { navigation, user } = props;
    return (
        <QueryList
            gqlDocument={GQL.userFollowersQuery}
            options={{
                variables: {
                    user_id: user.id,
                },
                fetchPolicy: 'network-only',
            }}
            dataOptionChain="followers.data"
            paginateOptionChain="followers.paginatorInfo"
            renderItem={({ item, index, data, page }) => <UserItem navigation={navigation} user={item.user} />}
        />
    );
}
