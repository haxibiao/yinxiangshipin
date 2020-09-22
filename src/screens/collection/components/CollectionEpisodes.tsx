import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QueryList, ContentStatus } from '@src/content';
import { Iconfont, SafeText } from '@src/components';
import { GQL } from '@src/apollo';

export default ({ collection, post, onClose, navigation }) => {
    const renderItem = useCallback(({ item, index, data, page }) => {
        const postByCollectionId = post?.collections?.[0]?.id || -1;
        return (
            <TouchableWithoutFeedback
                onPress={() =>
                    navigation.push('CollectionVideoList', { collection, initData: data, itemIndex: index, page })
                }>
                <View
                    style={[
                        styles.postItem,
                        postByCollectionId === collection?.id && { backgroundColor: 'rgba(222,222,222,0.6)' },
                    ]}>
                    <Image style={styles.postCover} source={{ uri: item?.video?.cover }} />
                    <View style={styles.postInfo}>
                        <View style={styles.introduction}>
                            <Text style={styles.postName} numberOfLines={2}>
                                {`第${index + 1}集￨${item?.description}`}
                            </Text>
                        </View>
                        <View style={styles.postMeta}>
                            <SafeText style={[styles.metaText, { marginRight: pixel(15) }]}>
                                {Helper.moment(item?.video?.duration)}
                            </SafeText>
                            <Iconfont
                                name="xihuanfill"
                                size={pixel(13)}
                                color={item?.liked ? '#FE2C54' : '#e4e4e4'}
                                style={{ marginRight: pixel(4) }}
                            />
                            <SafeText style={styles.metaText}>{Helper.count(item?.count_likes)}</SafeText>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.windowHeader}>
                <Text style={styles.headerText}>
                    {collection?.name}
                    {collection?.count_articles && ' · 更新至第' + collection?.count_articles + '集'}
                </Text>
                <TouchableOpacity style={styles.closeWindow} onPress={onClose}>
                    <Iconfont name="guanbi1" size={pixel(16)} color="#fff" />
                </TouchableOpacity>
            </View>
            <QueryList
                gqlDocument={GQL.CollectionQuery}
                dataOptionChain="collection.posts.data"
                paginateOptionChain="collection.posts.paginatorInfo"
                options={{
                    variables: {
                        collection_id: collection?.id,
                        count: 5,
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                contentContainerStyle={styles.content}
            />
            <View style={styles.listFooter}>
                <TouchableOpacity style={styles.footerBtn} onPress={() => null}>
                    <Iconfont name="biaoxingfill" size={pixel(16)} color={collection?.followed ? '#FE2C54' : '#fff'} />
                    <Text style={styles.btnText}>{collection?.followed ? '取消收藏' : '收藏合集'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: (Device.HEIGHT * 2) / 3,
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        backgroundColor: 'rgba(0,0,0,0.5)',
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
    windowHeader: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    headerText: {
        color: '#ffffff',
        fontSize: pixel(15),
    },
    closeWindow: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: pixel(44),
        height: pixel(44),
        alignItems: 'center',
        justifyContent: 'center',
    },
    listFooter: {
        padding: pixel(12),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    footerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pixel(42),
        borderRadius: pixel(4),
        backgroundColor: '#151515',
    },
    btnText: {
        fontSize: font(15),
        color: '#ffffff',
        marginLeft: pixel(3),
    },
    postItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: pixel(12),
        paddingHorizontal: pixel(15),
        overflow: 'hidden',
    },
    postCover: {
        width: pixel(70),
        height: pixel(90),
        borderRadius: pixel(4),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    postInfo: {
        flex: 1,
        marginLeft: pixel(12),
        justifyContent: 'space-between',
    },
    introduction: {
        marginBottom: pixel(8),
    },
    postName: {
        fontSize: font(15),
        lineHeight: font(20),
        color: '#ffffff',
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: font(12),
        color: '#e4e4e4',
    },
});
