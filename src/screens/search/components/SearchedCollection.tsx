import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { StatusView, UserItem } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { observer } from '@src/store';
import { QueryList } from '@src/content';
import { observable } from 'mobx';
import { UserCollectionItem } from '@src/screens/collection/components/CollectionItem';

const index = observer(({ keyword, navigation }) => {
    return (
        <View style={styles.container}>
            <QueryList
                contentContainerStyle={styles.contentContainer}
                gqlDocument={GQL.searchCollectionsQuery}
                dataOptionChain="searchCollections.data"
                paginateOptionChain="searchCollections.paginatorInfo"
                options={{
                    variables: {
                        query: keyword,
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={({ item, index }) => (
                    <UserCollectionItem item={item} index={index} navigation={navigation} />
                )}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,1)',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    listFooter: {
        borderTopWidth: pixel(1),
        borderTopColor: '#f0f0f0',
        paddingVertical: pixel(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooterText: {
        fontSize: font(13),
        color: Theme.subTextColor,
    },
});

export default index;
