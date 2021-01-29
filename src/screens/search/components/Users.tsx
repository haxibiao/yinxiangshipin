import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { UserItem } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { observer } from '@src/store';
import { QueryList } from '@src/content';

const index = observer(({ keyword, navigation }) => {
    return (
        <QueryList
            contentContainerStyle={styles.contentContainer}
            gqlDocument={GQL.searchUsersQuery}
            dataOptionChain="searchUsers.data"
            paginateOptionChain="searchUsers.paginatorInfo"
            options={{
                variables: { keyword, page: 1 },
                fetchPolicy: 'network-only',
            }}
            renderItem={({ item, index }) => <UserItem user={item} navigation={navigation} />}
        />
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Device.bottomInset,
    },
});

export default index;
