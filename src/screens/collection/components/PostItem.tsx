import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import { SafeText, Iconfont, Row } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
interface Props {
    item?: any;
    index?: number;
    listData?: any[];
    nextPage?: number;
    collection: any;
    addPostPress: any;
    videoData: any;
}
const PostItem = observer((props: Props) => {
    let { item, index, listData, nextPage, collection, addPostPress, videoData } = props;
    const navigation = useNavigation();
    // 创建合集 -> 选择作品页 -> isAddCollection判断能否添加当前作品
    // isStash：添加作品时判断是否已在添加区，true则不可点击添加按钮
    const isStash = videoData ? !!videoData.find((video) => video.post_id === item.id) : false;
    // isAddCollection：是否已存在某个合集中 或 是否已在缓存区，true则不可点击添加按钮
    const isAddCollection = item?.collections.length > 0 || isStash;

    let cover;
    if (item?.video?.id) {
        cover = item?.video?.cover;
    } else {
        cover = item?.images?.['0']?.url;
    }

    const goToScreen = useCallback(({ item, tag, initData, itemIndex, page }) => {
        if (item?.video?.id) {
            navigation.push('TagVideoList', { tag, initData, itemIndex, page });
        } else {
            navigation.push('PostDetail', { post: item });
        }
    }, []);
    return (
        <TouchableWithoutFeedback
            onPress={() =>
                goToScreen({
                    item,
                    tag: collection,
                    initData: listData,
                    itemIndex: index,
                    page: nextPage,
                })
            }
            disabled={!collection}>
            <View style={styles.itemWrap}>
                <Image style={styles.videoCover} source={{ uri: cover }} />
                <View style={{ flex: 1, overflow: 'hidden', justifyContent: 'space-around' }}>
                    <SafeText style={styles.contentText} numberOfLines={2}>
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
                            color={item.liked ? Theme.primaryColor : '#fff'}
                        />
                        <SafeText style={[styles.metaText, { marginLeft: pixel(3) }]} numberOfLines={1}>
                            {item.count_likes}
                        </SafeText>
                    </Row>
                </View>
                {addPostPress && (
                    <TouchableOpacity
                        style={[styles.selectedBox, isAddCollection && { borderColor: '#666' }]}
                        onPress={() => addPostPress(item)}
                        disabled={isAddCollection}>
                        <Iconfont name="iconfontadd" size={pixel(18)} color={isAddCollection ? '#666' : '#fff'} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    itemWrap: {
        width: Device.WIDTH,
        flexDirection: 'row',
        paddingHorizontal: pixel(Theme.itemSpace),
        marginVertical: pixel(Theme.itemSpace) / 2,
    },
    videoCover: {
        width: percent(18),
        height: percent(18) * 1.4,
        marginRight: pixel(10),
        borderRadius: pixel(2),
    },
    contentText: {
        fontSize: font(15),
        color: '#fff',
    },
    metaText: {
        fontSize: font(13),
        color: '#fff',
    },
    selectedBox: {
        padding: pixel(2),
        alignSelf: 'center',
        borderRadius: percent(50),
        borderColor: '#fff',
        borderWidth: pixel(1),
        marginLeft: pixel(10),
    },
});

export default PostItem;
