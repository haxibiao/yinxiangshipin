import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeText, Iconfont } from '@src/components';
import { observer } from '@src/store';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import SearchVideoItem from './SearchVideoItem';

// selectable:区分个人合集和公共合集入口
const SearchedCollectionPost = observer(({ navigation, keyword, tag_id, user_id, selectable, uploadVideoResponse }) => {
    const [hot, setHot] = useState(false);

    const renderItem = useCallback(
        ({ item, index, data, page }) => {
            if (selectable && uploadVideoResponse) {
                let { images, video, id } = item;
                return (
                    <View style={styles.rowItem}>
                        <Image
                            source={{ uri: item.images.length > 0 ? item.images[0] : item.video && item.video.cover }}
                            style={styles.postCover}
                        />
                        <View style={{ flex: 1, justifyContent: 'space-around' }}>
                            <SafeText style={styles.bodyText} numberOfLines={1}>
                                {item.content || item.description}
                            </SafeText>
                            <SafeText style={styles.collectionInfo} numberOfLines={1}>
                                1.2w播放·更新至第n集
                            </SafeText>
                        </View>
                        <TouchableOpacity
                            style={{ padding: pixel(5), alignSelf: 'center' }}
                            onPress={() => {
                                uploadVideoResponse({ response: video, post_id: id });
                                // navigation.goBack();
                            }}>
                            <Iconfont name="iconfontadd" size={pixel(18)} color="#fff" />
                        </TouchableOpacity>
                    </View>
                );
            } else {
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
            }
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
            numColumns={!selectable && 2}
            renderItem={renderItem}
            columnWrapperStyle={!selectable && styles.columnWrapperStyle}
            ListHeaderComponent={listHeader}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    collectionInfo: {
        fontSize: font(11),
        marginTop: pixel(10),
        color: '#666',
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
    rowItem: {
        flexDirection: 'row',
        padding: pixel(Theme.itemSpace),
        paddingBottom: 0,
    },
    postCover: {
        width: Device.WIDTH * 0.25,
        height: Device.WIDTH * 0.3,
        resizeMode: 'cover',
        borderRadius: pixel(3),
        marginRight: pixel(10),
    },
    bodyText: {
        fontSize: font(14),
        fontWeight: 'bold',
        color: '#fff',
    },
    collectionInfo: {
        fontSize: font(11),
        marginTop: pixel(10),
        color: '#666',
    },
});

export default SearchedCollectionPost;
