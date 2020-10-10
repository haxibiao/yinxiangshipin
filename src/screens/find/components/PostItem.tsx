import React, { useMemo, useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { PlaceholderImage, SafeText, Row, Avatar, Iconfont } from '@src/components';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';

export interface Props {
    post?: any;
    itemWidth?: number;
    itemHeight?: number;
}

const COVER_WIDTH = Device.WIDTH - pixel(Theme.itemSpace) * 3;

const PostItem = observer((props: Props) => {
    const navigation = useNavigation();
    const { post, itemWidth, itemHeight } = props;
    const {
        id,
        content,
        description,
        status,
        liked,
        count_likes,
        count_comments,
        review_id,
        review_day,
        is_ad,
        created_at,
        current_episode,
        user,
        tags,
        images,
        video,
        collections,
    } = post;

    const icons = {
        back: require('@app/assets/images/icons/ic_back_white.png'),
        liked: require('@app/assets/images/icons/ic_like_red.png'),
        like: require('@app/assets/images/icons/ic_like_black.png'),
        forward: require('@app/assets/images/icons/ic_more_white.png'),
    };
    let cover = '';
    let type = 'video';
    const renderCover = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) {
            cover = images[0].url;
            type = 'images';
        } else if (video) {
            cover = video.cover || video.url;
        }
        return (
            cover && (
                <View style={[styles.contentBottom, { width: itemWidth }]}>
                    <Image source={{ uri: cover }} resizeMode="cover" style={styles.portrait} />
                    {type === 'video' && (
                        <View style={styles.videoMark}>
                            <Iconfont name="bofang1" size={pixel(15)} color={'#fff'} style={{ opacity: 0.8 }} />
                        </View>
                    )}
                </View>
            )
        );
    }, [images, video, type]);
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{ width: itemWidth }}
            onPress={() => navigation.navigate('PostDetail', { post })}>
            {renderCover}
            <View style={[styles.bottomPartWrapper, { width: itemWidth }]}>
                <SafeText style={[styles.contentText, { marginBottom: pixel(5), marginLeft: 0 }]} numberOfLines={2}>
                    {content || description}
                </SafeText>
                <Row style={styles.metaList}>
                    <TouchableOpacity style={styles.info} onPress={() => navigation.navigate('User', { user })}>
                        <Avatar source={user.avatar} size={pixel(16)} />
                        <View style={{ flex: 1 }}>
                            <SafeText style={styles.nameText} numberOfLines={1}>
                                {user.name}
                            </SafeText>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.likeBox}>
                        <Text style={styles.nameText}>{Helper.count(count_likes)}</Text>
                        <Image source={liked ? icons.liked : icons.like} style={styles.likeIcon} />
                    </View>
                </Row>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    contentBottom: {
        zIndex: 999,
        borderRadius: pixel(5),
    },
    videoMark: {
        ...StyleSheet.absoluteFill,
        alignItems: 'flex-end',
        top: pixel(5),
        right: pixel(5),
    },
    portrait: {
        width: COVER_WIDTH * 0.5,
        height: COVER_WIDTH * 0.6,
        borderRadius: pixel(5),
    },
    bottomPartWrapper: {
        marginTop: pixel(-10),
        paddingTop: pixel(15),
        paddingBottom: pixel(5),
        paddingHorizontal: pixel(5),
        backgroundColor: '#ffffff',
        borderBottomRightRadius: pixel(5),
        borderBottomLeftRadius: pixel(5),
        // shadowColor: '#cfcfcf',
        // shadowOffset: { width: 2, height: 2 },
        // shadowOpacity: 0.8,
        marginBottom: pixel(Theme.itemSpace),
    },
    contentText: {
        fontSize: font(12),
        lineHeight: pixel(16),
        color: '#000',
        marginLeft: COVER_WIDTH * 0.01,
    },
    metaList: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    likeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    info: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        fontSize: pixel(11),
        color: '#666',
        marginLeft: COVER_WIDTH * 0.01,
    },
    likeIcon: {
        width: pixel(15),
        height: pixel(14),
        marginLeft: COVER_WIDTH * 0.01,
    },
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    textStyle: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: pixel(11),
        marginStart: 5,
    },
});

export default PostItem;
