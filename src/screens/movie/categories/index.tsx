import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavBarHeader } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { QueryList } from '@src/content';
import SelectHeader from './SelectHeader';
import MovieItem, { SPACE } from '../components/MovieItem';

const MovieCategories = [
    {
        id: 'scopes',
        filterName: '排序选项',
        filterOptions: ['全部', '最新', '最热', '评分'],
        filterValue: ['ALL', 'NEW', 'HOT', 'SCORE'],
    },
    {
        id: 'region',
        filterName: '剧种',
        filterOptions: ['全部', '韩剧', '日剧', '美剧', '港剧'],
        filterValue: ['ALL', 'HAN', 'RI', 'MEI', 'GANG'],
    },
    {
        id: 'year',
        filterName: '年份',
        filterOptions: ['全部', '2020', '2019', '2018', '2017', '2016'],
        filterValue: ['ALL', '2020', '2019', '2018', '2017', '2016'],
    },
];

// 电影分类
export default function index() {
    const [category, setCategory] = useState({
        region: { value: '', index: 0 },
        type: { value: '', index: 0 },
        country: { value: '', index: 0 },
        year: { value: '', index: 0 },
        scopes: { value: '', index: 0 },
    });

    const ListHeader = () => {
        return (
            <View style={styles.menuWrap}>
                <SelectHeader data={MovieCategories} setCategory={setCategory} category={category} />
            </View>
        );
    };

    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.itemWrap}>
                <MovieItem movie={item} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <NavBarHeader
                title="视频分类"
                hasGoBackButton={true}
                hasSearchButton={true}
                StatusBarProps={{ barStyle: 'dark-content' }}
            />
            <QueryList
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                gqlDocument={GQL.categoryMovieQuery}
                dataOptionChain="categoryMovie.data"
                paginateOptionChain="categoryMovie.paginatorInfo"
                options={{
                    variables: {
                        count: 12,
                        region: category.region.value,
                        type: category.type.value,
                        country: category.country.value,
                        year: category.year.value,
                        scopes: category.scopes.value,
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={_renderItem}
                numColumns={3}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        paddingLeft: SPACE,
    },
    menuWrap: {
        paddingRight: SPACE,
        marginTop: SPACE,
    },
    itemWrap: {
        marginBottom: SPACE,
    },
});
