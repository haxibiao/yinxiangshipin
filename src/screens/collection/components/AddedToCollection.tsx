import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QueryList, ContentStatus, Placeholder } from '@src/content';
import { userStore } from '@src/store';
import { Iconfont, SafeText, Row } from '@src/components';
import { GQL } from '@src/apollo';
import StashVideoStore from '../store';
import { observer } from 'mobx-react';

export default observer(({ onClose, onClick, navigation, operation, collection, confirmBtn }) => {
    const stashAddVideo = useMemo(() => StashVideoStore.stashAddVideo, [StashVideoStore.stashAddVideo]);
    const stashDeleteVideo = useMemo(() => StashVideoStore.stashDeleteVideo, [StashVideoStore.stashDeleteVideo]);

    const operationBtn = useCallback(
        (name, item) => {
            if (name === '添加') {
                if (
                    __.find(stashAddVideo, function (videoItem) {
                        return videoItem.post_id === item.id;
                    })
                ) {
                    Toast.show({ content: '该作品已经添加过了' });
                    item.collections.push(1);
                } else {
                    item.collections.push(1);
                    StashVideoStore.setStashAddVideo([...stashAddVideo, { post_id: item.id }]);
                }
            } else {
                if (
                    __.find(stashDeleteVideo, function (videoItem) {
                        return videoItem.post_id === item.id;
                    })
                ) {
                    Toast.show({ content: '该作品已经选过了' });
                    item.collections = [];
                } else {
                    item.collections = [];
                    StashVideoStore.setStashDeleteVideo([...stashDeleteVideo, { post_id: item.id }]);
                }
            }
        },
        [stashAddVideo, stashDeleteVideo],
    );

    const renderItem = useCallback(
        ({ item, index, data, page }) => {
            return (
                <PostItem
                    item={item}
                    btnName={operation}
                    onClick={onClick}
                    navigation={navigation}
                    operationBtn={operationBtn}
                />
            );
        },
        [stashAddVideo, stashDeleteVideo],
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
                    onPress={() => confirmBtn({ operation, collection_id: collection.id })}>
                    <Text style={styles.metaText}>确认</Text>
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
                    gqlDocument={GQL.CollectionQuery}
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

export function PostItem({ style, item, navigation, onClick, btnName, operationBtn }) {
    let cover;
    if (item?.video?.id) {
        cover = item?.video?.cover;
    } else {
        cover = item?.images?.['0']?.url;
    }

    const disabledBtn =
        (btnName === '添加' && item.collections.length > 0) || (btnName === '删除' && item.collections.length === 0);

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
                {btnName && onClick && (
                    <TouchableOpacity
                        style={[styles.button, disabledBtn && { backgroundColor: '#b2b2b2' }]}
                        onPress={() => operationBtn(btnName, item)}
                        disabled={disabledBtn}>
                        <Text style={styles.btnText}>{btnName}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

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
