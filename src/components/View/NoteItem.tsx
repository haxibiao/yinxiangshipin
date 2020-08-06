import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    TouchableHighlight,
} from 'react-native';
import { withNavigation } from '@src/router';

import Iconfont from '../Iconfont';
import { Avatar } from '../Basic';

const IMG_INTERVAL = 2;
const IMG_WIDTH = (Device.WIDTH - 34) / 3;
const COVER_WIDTH = Device.WIDTH - 30;

const NoteItem = (props: any) => {
    const {
        post,
        navigation,
        compress,
        longPress = () => null,
        onPress,
        popoverOptions,
        popoverHandler = () => null,
    } = props;
    let {
        type,
        user,
        time_ago,
        title,
        description,
        category,
        has_image,
        images,
        cover,
        hits,
        count_likes,
        count_replies,
    } = post;

    const _renderFooter = (category: any, hits: any, count_replies: any, count_likes: any) => {
        const { navigation } = props;
        return (
            <View style={styles.noteFooter}>
                <View style={styles.layoutFlexRow}>
                    <View style={styles.meta}>
                        <Iconfont name={'browse'} size={15} color={Theme.lightFontColor} />
                        <Text style={styles.count}>{hits || 0}</Text>
                    </View>
                    <View style={styles.meta}>
                        <Iconfont name={'comment'} size={14} color={Theme.lightFontColor} />
                        <Text style={styles.count}>{count_replies || 0}</Text>
                    </View>
                    <View style={styles.meta}>
                        <Iconfont name={'like'} size={14} color={Theme.lightFontColor} />
                        <Text style={styles.count}>{count_likes || 0}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderImage = (type: any, images: any, cover: any) => {
        if (type == 'video') {
            // 暂时关闭视频列表
            // return <VideoCover width={COVER_WIDTH} height={(COVER_WIDTH * 9) / 16} cover={cover} />;
            return null;
        } else if (images.length >= 1) {
            return (
                <View style={[styles.gridView, styles.layoutFlexRow]}>
                    {images.slice(0, 3).map(function(img: any, i: number) {
                        if (img) return <Image style={styles.gridImage} source={{ uri: img }} key={i} />;
                    })}
                </View>
            );
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress ? onPress : () => navigation.navigate('文章详情', { article: { id: post.id } })}
            onLongPress={longPress}>
            <View style={styles.noteContainer}>
                <View style={styles.noteUser}>
                    {compress ? (
                        <Text style={{ fontSize: font(14), color: Theme.secondaryTextColor }}>{time_ago}</Text>
                    ) : (
                        <View style={styles.userInfo}>
                            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('User', { user })}>
                                <Avatar size={34} source={user.avatar} />
                            </TouchableOpacity>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.timeAgo}>{time_ago}</Text>
                            </View>
                        </View>
                    )}
                </View>
                {type == 'article' ? (
                    <View style={styles.abstract}>
                        <Text numberOfLines={2} style={styles.title}>
                            {title}
                        </Text>
                        {description ? (
                            <Text numberOfLines={3} style={styles.description}>
                                {description}
                            </Text>
                        ) : null}
                    </View>
                ) : (
                    <View style={styles.abstract}>
                        <Text numberOfLines={3} style={styles.title}>
                            {title ? title : description}
                        </Text>
                    </View>
                )}
                <View>{has_image && renderImage(type, images, cover)}</View>
                {_renderFooter(category, hits, count_replies, count_likes)}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    noteContainer: {
        padding: 15,
        justifyContent: 'center',
        borderBottomWidth: 10,
        borderBottomColor: '#FAFAFA',
    },
    noteUser: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 5,
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: font(14),
        color: Theme.defaultTextColor,
    },
    timeAgo: {
        fontSize: font(12),
        marginTop: 6,
        color: Theme.secondaryTextColor,
    },
    cover: {
        width: COVER_WIDTH,
        height: COVER_WIDTH * 0.5,
        resizeMode: 'cover',
    },
    gridView: {
        marginLeft: -IMG_INTERVAL,
    },
    rightImage: {
        width: 92,
        height: 92,
        resizeMode: 'cover',
    },
    gridImage: {
        width: IMG_WIDTH,
        height: IMG_WIDTH,
        marginLeft: IMG_INTERVAL,
        resizeMode: 'cover',
    },
    abstract: {
        marginBottom: 10,
    },
    title: {
        fontSize: font(16),
        lineHeight: 22,
        color: Theme.defaultTextColor,
    },
    description: {
        marginTop: 10,
        fontSize: font(14),
        lineHeight: 20,
        color: Theme.secondaryTextColor,
    },
    noteFooter: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    categoryName: {
        fontSize: font(12),
        color: Theme.secondaryTextColor,
        marginLeft: 3,
    },
    count: {
        fontSize: font(11),
        color: Theme.lightFontColor,
        marginLeft: 3,
    },
    layoutFlexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default withNavigation(NoteItem);
