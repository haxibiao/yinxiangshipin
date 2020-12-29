import React, { useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, GQL } from '@src/apollo';
import { observer, adStore } from '@src/store';

// 推荐搜索数据为空时用下面的数据填充
const KEYWORDS = [
    {
        id: 27705,
        word: '检察官',
    },
    {
        id: 27593,
        word: '傲骨贤妻',
    },
    {
        id: 28421,
        word: '豪斯医生',
    },
    {
        id: 28992,
        word: '非自然死亡',
    },
    {
        id: 31613,
        word: '行尸走肉',
    },
    {
        id: 31631,
        word: '喜剧之心',
    },
    {
        id: 28421,
        word: '校阅女孩河野悦子',
    },
    {
        id: 28992,
        word: '新妓生传',
    },
    {
        id: 31613,
        word: '破产姐妹',
    },
    {
        id: 31631,
        word: '接线女孩',
    },
];
const COLORS = ['#F21D58', '#FE4E15', '#FD9818'];

export default observer(({ onSearch }) => {
    const { data } = useQuery(GQL.searchHotKeywordsQuery, {
        variables: { type: 'SEARCH' },
    });
    const moviesData = useMemo(() => data?.activities?.data || KEYWORDS, [data]);
    const navigation = useNavigation();

    if (!adStore.enableAd) {
        return null;
    }

    return (
        <View>
            <View style={styles.recommendHeader}>
                <Text style={styles.title}>热门热搜</Text>
            </View>
            <FlatList
                contentContainerStyle={styles.contentStyle}
                data={moviesData}
                numColumns={2}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            key={item.id}
                            style={styles.keywordsItem}
                            onPress={() => onSearch(item?.title)}>
                            <Text style={[styles.keywordIndex, { color: COLORS[index] || '#9B9B9B' }]}>
                                {index + 1}
                            </Text>
                            <Text style={{ fontSize: font(14), color: '#202020' }} numberOfLines={1}>
                                {item?.title}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    recommendHeader: {
        paddingHorizontal: pixel(15),
        paddingVertical: pixel(5),
        height: pixel(30),
    },
    title: {
        fontSize: font(15),
        color: '#202020',
        fontWeight: 'bold',
    },
    contentStyle: {},
    keywordsItem: {
        width: '50%',
        paddingHorizontal: pixel(15),
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: pixel(8),
    },
    keywordIndex: {
        width: pixel(24),
        paddingLeft: pixel(1),
        fontSize: font(14),
        fontWeight: '700',
    },
});
