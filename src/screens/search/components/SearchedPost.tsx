import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { observer } from '@src/store';
import { QueryList, PostItem, GQL } from '@src/content';

const index = observer(({ keyword }) => {
    // variables: { query: keyword, type: 'POST', page: 1 },
    const renderItem = useCallback(({ item }) => {
        return <PostItem data={item} />;
    }, []);

    return (
        <QueryList
            gqlDocument={GQL.searchPostQuery}
            dataOptionChain="searchPosts.data"
            paginateOptionChain="searchPosts.paginatorInfo"
            options={{
                variables: {
                    query: keyword,
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.container}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});

export default index;
