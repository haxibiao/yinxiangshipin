import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { StatusView, UserItem } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { observer } from '@src/store';
import { QueryList } from '@src/content';
import CollectionItem from '@src/screens/collection/components/CollectionItem';

const index = observer(({ keyword, navigation }) => {
    return (
        <QueryList
            contentContainerStyle={styles.contentContainer}
            gqlDocument={GQL.searchCollectionsQuery}
            dataOptionChain="searchCollections.data"
            paginateOptionChain="searchCollections.paginatorInfo"
            options={{
                variables: {
                    query: keyword,
                    count: 10,
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={({ item, index }) => <CollectionItem collection={item} navigation={navigation} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Device.bottomInset,
    },
    separator: {
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});

export default index;
