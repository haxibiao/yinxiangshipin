import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { QueryList, ContentStatus, Placeholder } from '@src/content';
import { userStore } from '@src/store';
import { Iconfont, SafeText, Row } from '@src/components';
import { GQL } from '@src/apollo';
import { observer } from 'mobx-react';
import lodashUtil from 'lodash';

function EpisodeItem({ style, item, btnName, stashVideo, setStashVideo }) {
    let cover;
    if (item?.video?.id) {
        cover = item?.video?.cover;
    } else {
        cover = item?.images?.['0']?.url;
    }

    const pickedIndex = useMemo(() => {
        return lodashUtil.findIndex(stashVideo, function (v) {
            return v.post_id == item?.id;
        });
    }, [stashVideo]);

    const operationBtn = useCallback(
        (name, item) => {
            if (pickedIndex >= 0) {
                setStashVideo((videos) => {
                    videos.splice(pickedIndex, 1);
                    return [...videos];
                });
            } else {
                setStashVideo((videos) => {
                    if (videos.length >= 30) {
                        Toast.show({ content: '一次最多添加30个作品哦' });
                        return [...videos];
                    }
                    return [...videos, { post_id: item?.id, content: item?.content }];
                });
            }
        },
        [stashVideo],
    );

    // 已加入合集的动态
    const isAdded = btnName === '添加' && item.collections.length > 0;

    // 已选中
    const isSelected = pickedIndex >= 0;

    return (
        <TouchableWithoutFeedback>
            <View style={[styles.collectionItem, style]}>
                <Image style={styles.collectionCover} source={{ uri: cover }} />
                <View style={styles.postInfo}>
                    <SafeText style={styles.metaText} numberOfLines={2}>
                        {item?.current_episode && `第${item?.current_episode}集￨`}
                        {`${item?.content || item?.description}`}
                    </SafeText>
                    <Row>
                        <SafeText style={[styles.metaText, { marginRight: pixel(15) }]}>
                            {Helper.moment(item?.video?.duration)}
                        </SafeText>
                        <Iconfont
                            name={item.liked ? 'xihuanfill' : 'xihuan'}
                            size={pixel(15)}
                            color={item.liked ? Theme.primaryColor : '#666'}
                        />
                        <Text style={[styles.metaText, { marginLeft: pixel(3) }]} numberOfLines={1}>
                            {item.count_likes}
                        </Text>
                    </Row>
                </View>
                {btnName && (
                    <TouchableOpacity
                        style={[styles.button, (isAdded || isSelected) && { backgroundColor: '#b2b2b2' }]}
                        onPress={() => operationBtn(btnName, item)}
                        disabled={isAdded}>
                        <Text style={styles.btnText}>
                            {isAdded
                                ? '已添加'
                                : isSelected
                                ? `${btnName === '添加' ? '+' : '-'}${pickedIndex + 1}`
                                : btnName}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

export default observer(({ onClose, operation, collection, confirmBtn }) => {
    const [stashVideo, setStashVideo] = useState([]);

    const renderItem = useCallback(
        ({ item, index, data, page }) => {
            return (
                <EpisodeItem item={item} btnName={operation} stashVideo={stashVideo} setStashVideo={setStashVideo} />
            );
        },
        [stashVideo],
    );

    return (
        <View style={styles.container}>
            <View style={styles.windowHeader}>
                <TouchableOpacity style={[styles.closeWindow, { left: 0 }]} onPress={onClose}>
                    <Iconfont name="guanbi1" size={pixel(20)} color={Theme.defaultTextColor} />
                </TouchableOpacity>
                <SafeText style={styles.headerText}>批量{operation}</SafeText>
                <TouchableOpacity
                    style={styles.closeWindow}
                    onPress={() =>
                        confirmBtn({
                            operation,
                            collection_id: collection.id,
                            stashVideo: stashVideo,
                        })
                    }
                    disabled={stashVideo.length === 0}>
                    <Text style={[styles.metaText, stashVideo.length === 0 && { color: '#b2b2b2' }]}>确认</Text>
                </TouchableOpacity>
            </View>
            {operation === '添加' ? (
                <QueryList
                    gqlDocument={GQL.postsQuery}
                    dataOptionChain="posts.data"
                    paginateOptionChain="posts.paginatorInfo"
                    options={{
                        variables: {
                            user_id: userStore.me.id,
                        },
                        fetchPolicy: 'network-only',
                    }}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.content}
                />
            ) : (
                <QueryList
                    gqlDocument={GQL.collectionPostsQuery}
                    dataOptionChain="collection.posts.data"
                    paginateOptionChain="collection.posts.paginatorInfo"
                    options={{
                        variables: {
                            collection_id: collection.id,
                        },
                        fetchPolicy: 'network-only',
                    }}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.content}
                />
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        height: (Device.HEIGHT * 2) / 3,
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
    windowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    headerText: {
        color: Theme.defaultTextColor,
        fontSize: pixel(15),
        fontWeight: 'bold',
    },
    closeWindow: {
        width: pixel(44),
        height: pixel(44),
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        top: 0,
        bottom: 0,
    },
    listFooter: {
        paddingVertical: pixel(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooterText: {
        fontSize: font(13),
        color: '#b4b4b4',
    },
    collectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: pixel(12),
        paddingHorizontal: pixel(15),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    collectionCover: {
        width: pixel(70),
        height: pixel(70),
        borderRadius: pixel(2),
        backgroundColor: '#f0f0f0',
        marginRight: pixel(10),
    },
    postInfo: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'space-around',
        marginRight: pixel(10),
        height: pixel(70),
    },
    metaText: {
        fontSize: font(13),
        color: '#2b2b2b',
    },
    button: {
        width: pixel(66),
        height: pixel(30),
        borderRadius: pixel(4),
        backgroundColor: '#FE2C54',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: font(13),
        color: '#fff',
        fontWeight: 'bold',
    },
});
