import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';

const FilterMap = ({ filter, category, setCategory }) => {
    const doFilter = useCallback(
        (value, index) => {
            category[filter.id] = { value: filter.filterValue[index], index };
            setCategory({ ...category });
        },
        [category],
    );
    const _renderItem = ({ item, index }) => {
        const isSelect = category[filter.id].index === index;
        const backgroundColor = isSelect ? Theme.primaryColor : 'transparent';
        return (
            <Pressable
                style={[styles.button, { backgroundColor: backgroundColor }]}
                onPress={() => {
                    doFilter(item, index);
                }}>
                <Text style={[isSelect ? styles.text : { color: '#000' }]}>{item}</Text>
            </Pressable>
        );
    };
    return (
        <FlatList
            data={filter?.filterOptions}
            renderItem={_renderItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

// 头部选择
export default function SelectHeader(props: any) {
    const { category, setCategory, data } = props;
    return (
        <View style={[styles.container]}>
            {data.map((item, index) => {
                return <FilterMap filter={item} setCategory={setCategory} category={category} key={index} />;
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: font(13),
        lineHeight: font(18),
        textAlign: 'center',
        color: '#fff',
    },
    button: {
        paddingHorizontal: pixel(6),
        paddingVertical: pixel(3),
        marginRight: pixel(14),
        marginBottom: pixel(14),
        borderRadius: pixel(5),
    },
});
