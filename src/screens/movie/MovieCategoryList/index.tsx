import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeText, PageContainer, TouchFeedback } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { ContentStatus, QueryList } from '@src/content';
import SelectHeader from './SelectHeader';
import MovieCard from './MovieCard';
// 电影分类
const NumOfLines = 3;
export default function index() {
    // 筛选电影条件=>排序选项,排序选项,分类,年份
    const { data } = useQuery(GQL.getFiltersQuery, {
        fetchPolicy: 'network-only',
    });
    const selectData = useMemo(() => Helper.syncGetter('getFilters', data), [data]);
    const ListHeader = () => {
        return <SelectHeader data={selectData} />;
    };
    const _renderItem = ({ item, index }) => {
        return <MovieCard key={index} movieresult={item} />;
    };
    return (
        <PageContainer title="电影分类" titleStyle={{ fontSize: font(14) }}>
            <View style={styles.container}>
                <QueryList
                    gqlDocument={GQL.categoryMovieQuery}
                    dataOptionChain="categoryMovie.data"
                    paginateOptionChain="categoryMovie.paginatorInfo"
                    // options={{
                    //     variables: {
                    //         collection_id: collection.id,
                    //         count: QUERY_COUNT,
                    //     },
                    //     fetchPolicy: 'network-only',
                    // }}
                    showsVerticalScrollIndicator={false}
                    renderItem={_renderItem}
                    numColumns={NumOfLines}
                    keyExtractor={(item, index) => String(index)}
                    onEndReachedThreshold={0.1}
                    removeClippedSubviews={true}
                    ListHeaderComponentStyle={{ marginBottom: pixel(15) }}
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
