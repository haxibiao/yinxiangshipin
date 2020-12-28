import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { QueryList } from '@src/content';
import MovieItem, { SPACE } from '../components/MovieItem';

interface Props {
    type?: 'MEI' | 'HAN' | 'RI' | 'GANG';
    count?: number;
}

export default ({ type = 'MEI', count = 12 }: Props) => {
    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.itemWrap}>
                <MovieItem movie={item} />
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <QueryList
                contentContainerStyle={styles.contentContainer}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                gqlDocument={GQL.categoryMovieQuery}
                dataOptionChain="categoryMovie.data"
                paginateOptionChain="categoryMovie.paginatorInfo"
                keyExtractor={(item, index) => String(item.id || index)}
                options={{
                    variables: {
                        region: type,
                        count,
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={_renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: SPACE,
        paddingLeft: SPACE,
    },
    itemWrap: {
        marginBottom: SPACE,
    },
});
