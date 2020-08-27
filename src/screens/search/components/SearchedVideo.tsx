import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { observer } from '@src/store';
import { QueryList, GQL } from '@src/content';
import SearchVideoItem from './SearchVideoItem';

const index = observer(({ navigation, keyword, tag_id, user_id }) => {
    const [hot, setHot] = useState(false);

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
                        <SearchVideoItem media={item} />
                    </View>
                </TouchableWithoutFeedback>
            );
        },
        [keyword, tag_id, user_id],
    );

    const listHeader = useMemo(() => {
        return (
            <View style={styles.header}>
                <Text style={styles.title}>视频</Text>
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

    return (
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
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    itemWrap: {
        width: '50%',
        height: percent(50) * 1.4,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: '#2b2b2b',
        backgroundColor: '#2b2b2b',
    },
    columnWrapperStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#161924',
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

export default index;
