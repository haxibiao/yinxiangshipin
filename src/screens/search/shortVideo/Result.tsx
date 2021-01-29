import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeText, Iconfont } from '@src/components';
import { observer } from '@src/store';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import VideoItem from './VideoItem';
import EpisodeItem from '@src/screens/collection/components/EpisodeItem';

export default observer(({ navigation, keyword, tag_id, user_id, collection_id }) => {
    const [hot, setHot] = useState(false);

    const listHeader = useMemo(() => {
        return (
            <View style={styles.header}>
                <SafeText style={styles.title}>视频</SafeText>
                <TouchableOpacity
                    style={styles.filterBtn}
                    onPress={() =>
                        setHot((h) => {
                            return !h;
                        })
                    }
                    activeOpacity={1}>
                    <Image style={styles.filterIcon} source={require('@app/assets/images/icons/ic_order_gray.png')} />
                    <Text style={styles.filterBtnName}>{hot ? '最多点赞' : '最新发布'}</Text>
                </TouchableOpacity>
            </View>
        );
    }, [hot]);

    const renderItem = useCallback(
        ({ item, index, data, page }) => {
            return (
                <TouchableWithoutFeedback
                    onPress={() => {
                        navigation.push('SearchedVideoList', {
                            keyword,
                            tag_id,
                            user_id,
                            initData: data,
                            itemIndex: index,
                            page,
                        });
                    }}>
                    <View style={styles.itemWrap}>
                        <VideoItem media={item} />
                    </View>
                </TouchableWithoutFeedback>
            );
        },
        [keyword, tag_id, user_id],
    );

    return collection_id ? (
        <QueryList
            contentContainerStyle={[
                styles.container,
                { paddingTop: pixel(Theme.edgeDistance), backgroundColor: '#f0f0f0' },
            ]}
            gqlDocument={GQL.searchCollectionPostQuery}
            dataOptionChain="searchPosts.data"
            paginateOptionChain="searchPosts.paginatorInfo"
            options={{
                variables: {
                    query: keyword,
                    collection_id: collection_id,
                },
                fetchPolicy: 'network-only',
            }}
            numColumns={1}
            renderItem={({ item, index, data, page }) => (
                <EpisodeItem
                    style={{ marginHorizontal: pixel(Theme.edgeDistance) }}
                    item={item}
                    index={index}
                    listData={data}
                    nextPage={page}
                    collection={item?.collections[0]}
                />
            )}
            ListHeaderComponent={listHeader}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
    ) : (
        <QueryList
            contentContainerStyle={styles.container}
            gqlDocument={GQL.searchPostQuery}
            dataOptionChain="searchPosts.data"
            paginateOptionChain="searchPosts.paginatorInfo"
            options={{
                variables: {
                    query: keyword,
                    type: 'VIDEO',
                    tag_id: tag_id,
                    user_id: user_id,
                },
                fetchPolicy: 'network-only',
            }}
            numColumns={2}
            renderItem={renderItem}
            columnWrapperStyle={styles.columnWrapperStyle}
            ListHeaderComponent={listHeader}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Device.bottomInset,
    },
    itemSeparator: {
        height: pixel(Theme.edgeDistance),
    },
    itemWrap: {
        width: '50%',
        height: percent(50) * 1.4,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: '#ffffff',
        backgroundColor: '#f0f0f0',
    },
    columnWrapperStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#eeeeee',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: pixel(15),
    },
    title: {
        fontSize: font(16),
        fontWeight: 'bold',
        color: '#fff',
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterIcon: {
        width: pixel(15),
        height: pixel(15),
        marginRight: pixel(2),
    },
    filterBtnName: {
        fontSize: font(14),
        color: '#b2b2b2',
    },
});
