import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import { Iconfont } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';

export default observer((props: Props) => {
    const { item, index, listData, nextPage, count, collection } = props;
    const navigation = useNavigation();

    let cover;
    if (item?.video?.id) {
        cover = item?.video?.cover;
    } else {
        cover = item?.images?.['0']?.url;
    }
    const goToScreen = () => {
        if (item?.video?.id) {
            navigation.push('CollectionVideoList', {
                collection,
                initData: listData,
                itemIndex: index,
                page: nextPage,
                count,
            });
        } else {
            navigation.push('PostDetail', { post: item });
        }
    };

    return (
        <TouchableWithoutFeedback onPress={goToScreen} disabled={!collection}>
            <View style={styles.videoItem}>
                <Image style={styles.videoCover} source={{ uri: cover }} />
                <View style={styles.content}>
                    <Text style={styles.contentText} numberOfLines={2}>
                        <Text style={{ color: '#2b2b2b' }}>
                            {item?.current_episode && `第${item?.current_episode}集 `}
                        </Text>
                        {`《${item?.content || item?.description}》`}
                    </Text>
                    <View style={styles.metaInfo}>
                        <Text style={[styles.metaText, { marginRight: pixel(15) }]}>
                            {Helper.moment(item?.video?.duration)}
                        </Text>
                        <Iconfont
                            name={'xihuanfill'}
                            size={font(13)}
                            color={item.liked ? Theme.primaryColor : '#b2b2b2'}
                            style={{ marginTop: pixel(1) }}
                        />
                        <Text style={[styles.metaText, { marginLeft: pixel(3) }]} numberOfLines={1}>
                            {item.count_likes}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    videoItem: {
        flexDirection: 'row',
        paddingHorizontal: pixel(Theme.edgeDistance),
    },
    videoCover: {
        width: pixel(80),
        height: pixel(100),
        marginRight: pixel(10),
        borderRadius: pixel(4),
    },
    content: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'space-around',
    },
    contentText: {
        fontSize: font(15),
        color: '#505050',
    },
    metaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: font(13),
        color: '#b2b2b2',
    },
});
