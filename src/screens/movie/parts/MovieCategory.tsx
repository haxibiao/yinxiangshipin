import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { Iconfont, DebouncedPressable } from '@src/components';
import MovieItem, { SPACE } from '../components/MovieItem';

interface Props {
    categoryName: string;
    type?: 'MEI' | 'HAN' | 'RI' | 'GANG';
    count?: number;
}

export default ({ type = 'MEI', count = 6, categoryName }: Props) => {
    const { data, refetch, loading } = useQuery(GQL.categoryMovieQuery, {
        variables: { region: type, count },
        fetchPolicy: 'network-only',
    });
    const moviesData = useMemo(() => data?.categoryMovie?.data || new Array(count).fill({}), [data]);
    const navigation = useNavigation();

    return (
        <View style={styles.secContainer}>
            <View style={styles.secHead}>
                <Text style={styles.secTitle}>{categoryName || '热门影视'}</Text>
                <TouchableOpacity
                    style={styles.headRight}
                    onPress={() => navigation.navigate('CategoriesTab', { category: type })}>
                    <Text style={styles.secAll}>查看全部</Text>
                    <Iconfont name="right" style={{ marginTop: font(1) }} size={font(12)} color={'#909090'} />
                </TouchableOpacity>
            </View>
            <View style={styles.movieList}>
                {moviesData.map((item, index) => {
                    return (
                        <View key={item?.id || index} style={{ marginTop: pixel(15) }}>
                            <MovieItem movie={item} />
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    secContainer: {
        padding: pixel(14),
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    secHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    secTitle: {
        fontSize: font(16),
        color: '#202020',
        fontWeight: 'bold',
    },
    headRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secAll: {
        fontSize: font(13),
        color: '#909090',
        marginRight: font(-1),
    },
    movieList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: -SPACE,
    },
});
