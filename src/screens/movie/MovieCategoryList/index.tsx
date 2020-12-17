import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeText, PageContainer, TouchFeedback } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { ContentStatus, QueryList } from '@src/content';
import SelectHeader from './SelectHeader';
import MovieCard from './MovieCard';
// 电影分类
const NumOfLines = 3;
export default function index() {
    const [category, setCategory] = useState({
        region: { value: '', index: 0 },
        type: { value: '', index: 0 },
        country: { value: '', index: 0 },
        year: { value: '', index: 0 },
        scopes: { value: '', index: 0 },
    });
    // 筛选电影条件=>排序选项,排序选项,分类,年份
    const { data, loading: filterLoading } = useQuery(GQL.getFiltersQuery, {
        fetchPolicy: 'network-only',
    });
    const selectData = useMemo(() => Helper.syncGetter('getFilters', data), [data]);
    // console.log('selectDataselectData', selectData);
    const { loading, error, data: result, fetchMore, refetch } = useQuery(GQL.categoryMovieQuery, {
        variables: {
            region: category.region.value,
            type: category.type.value,
            country: category.country.value,
            year: category.year.value,
            scopes: category.scopes.value,
        },
        fetchPolicy: 'network-only',
    });
    const movieData = useMemo(() => Helper.syncGetter('categoryMovie.data', result), [result]);
    const currentPage = useMemo(() => Helper.syncGetter('categoryMovie.paginatorInfo.currentPage', result), [result]);
    const hasMorePages = useMemo(() => Helper.syncGetter('categoryMovie.paginatorInfo.hasMorePages', result), [result]);
    const onEndReached = useCallback(() => {
        if (hasMorePages) {
            fetchMore({
                variables: {
                    page: currentPage + 1,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return prev;
                    }
                    return Object.assign({}, prev, {
                        categoryMovie: Object.assign({}, fetchMoreResult.categoryMovie, {
                            data: [...prev.categoryMovie.data, ...fetchMoreResult.categoryMovie.data],
                        }),
                    });
                },
            });
        }
    }, [hasMorePages, currentPage]);
    const ListHeader = () => {
        return <SelectHeader data={selectData} fetchData={movieData} setCategory={setCategory} category={category} />;
    };

    const _renderItem = ({ item, index }) => {
        return <MovieCard key={index} movieresult={item} />;
    };

    return (
        <PageContainer title="电影分类" titleStyle={{ fontSize: font(14) }} loading={filterLoading}>
            <View style={styles.container}>
                <FlatList
                    contentContainerStyle={{}}
                    data={movieData}
                    keyExtractor={(item, index) => String(item.id)}
                    renderItem={_renderItem}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.1}
                    numColumns={NumOfLines}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    ListHeaderComponent={ListHeader}
                />
            </View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
    },
});
