import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import SearchMovieItem from './SearchMovieItem';

export default function SearchedMovie({ keyword }) {
    return (
        <QueryList
            gqlDocument={GQL.searchMoviesQuery}
            dataOptionChain="searchMovie.data"
            paginateOptionChain="searchMovie.paginatorInfo"
            options={{
                variables: {
                    keyword: keyword,
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={({ item }) => <SearchMovieItem movie={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    separator: {
        marginHorizontal: pixel(Theme.itemSpace),
        height: pixel(1),
        backgroundColor: '#F4F4F4',
    },
});
