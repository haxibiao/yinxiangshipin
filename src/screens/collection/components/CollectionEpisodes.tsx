import React, { useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QueryList, ContentStatus } from '@src/content';
import { Iconfont, SafeText } from '@src/components';
import { GQL, useFollowMutation } from '@src/apollo';
import { userStore } from '@src/store';

export default ({ collection, post, onClose, navigation, currentPage = 1 }) => {
    const toggleFollow = useFollowMutation({
        variables: {
            followed_id: collection.id,
            followed_type: 'collections',
        },
        refetchQueries: () => [
            {
                query: GQL.followedCollectionsQuery,
                variables: { user_id: userStore.me?.id, followed_type: 'collections' },
            },
        ],
    });

    const toggleFollowOnPress = useCallback(() => {
        collection.followed = collection.followed === 1 ? 0 : 1;
        toggleFollow();
    }, [collection]);

    const renderItem = useCallback(({ item, index, data, page }) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    onClose();
                    DeviceEventEmitter.emit('JumpPlayCollectionVideo', {
                        data,
                        index,
                        page,
                    });
                }}>
                <View style={[styles.postItem, post?.id === item?.id && { backgroundColor: 'rgba(222,222,222,0.3)' }]}>
                    <Image style={styles.postCover} source={{ uri: item?.video?.cover }} />
                    <View style={styles.postInfo}>
                        <View style={styles.introduction}>
                            <Text style={styles.postName} numberOfLines={2}>
                                {`第${item?.current_episode || index}集￨${item?.description}`}
                            </Text>
                        </View>
                        <View style={styles.postMeta}>
                            <SafeText style={[styles.metaText, { marginRight: pixel(15) }]}>
                                {Helper.moment(item?.video?.duration)}
                            </SafeText>
                            <Iconfont
                                name={item?.liked ? 'xihuanfill' : 'xihuan'}
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
                    {collection?.updated_to_episode > 0 && ' · 更新至第' + collection?.updated_to_episode + '集'}
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
                        page: currentPage,
                    },
                    // fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                // initialScrollIndex
                contentContainerStyle={styles.content}
            />
            <View style={styles.listFooter}>
                <TouchableOpacity style={styles.footerBtn} onPress={toggleFollowOnPress}>
                    <Iconfont name="biaoxingfill" size={pixel(16)} color={collection?.followed ? '#FE2C54' : '#fff'} />
                    <Text style={styles.btnText}>{collection?.followed ? '已收藏' : '收藏合集'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: (Device.HEIGHT * 2) / 3,
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        backgroundColor: 'rgba(0,0,0,0.6)',
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
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
        paddingHorizontal: pixel(12),
        paddingVertical: pixel(15),
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    footerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pixel(42),
        borderRadius: pixel(4),
        backgroundColor: '#333333',
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
