import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GQL } from '@src/apollo';
import { observer } from '@src/store';
import { count } from '@src/common';
import { QueryList, PostItem } from '@src/content';
import { useNavigation } from '@react-navigation/native';
import { SafeText } from '@src/components';

const index = observer(({ keyword }) => {
    const navigation = useNavigation();
    const renderItem = useCallback(({ item }) => {
        return (
            <TouchableOpacity style={styles.tagItem} onPress={() => navigation.navigate('TagDetail', { tag: item })}>
                <View style={styles.tagNameWrap}>
                    <SafeText style={styles.tagName}>#{item?.name}</SafeText>
                </View>
                <Text style={styles.countPlays}>{count(item?.count_views) + Number(item?.id)}次播放</Text>
            </TouchableOpacity>
        );
    }, []);

    return (
        <QueryList
            gqlDocument={GQL.searchTagsQuery}
            dataOptionChain="searchTags.data"
            paginateOptionChain="searchTags.paginatorInfo"
            options={{
                variables: {
                    query: keyword,
                    count: 10,
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        paddingBottom: Device.bottomInset,
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: pixel(12),
        paddingRight: pixel(15),
        paddingVertical: pixel(10),
    },
    tagNameWrap: {
        flex: 1,
        marginRight: pixel(20),
    },
    tagName: {
        color: '#2b2b2b',
        fontSize: font(15),
        fontWeight: 'bold',
    },
    countPlays: {
        color: '#b2b2b2',
        fontSize: font(12),
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});

export default index;
