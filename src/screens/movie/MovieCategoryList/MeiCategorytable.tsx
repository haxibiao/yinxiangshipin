import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import MovieItem from '../components/MovieItem';

export default function MeiCategorytable() {
    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.container}>
                <MovieItem movie={item} boxStyle={styles.boxStyle} />
            </View>
        );
    };
    return (
        <View style={styles.content}>
            <QueryList
                gqlDocument={GQL.categoryMovieQuery}
                dataOptionChain="categoryMovie.data"
                paginateOptionChain="categoryMovie.paginatorInfo"
                numColumns={3}
                keyExtractor={(item, index) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                options={{
                    variables: {
                        region: 'MEI',
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={_renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.content}
            />
        </View>
    );
}
const itemWidth = (Device.WIDTH - pixel(Theme.itemSpace) * 2 - pixel(20)) / 3;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: pixel(8),
        paddingLeft: pixel(8),
    },
    boxStyle: {
        width: itemWidth,
        marginBottom: pixel(5),
    },
});
