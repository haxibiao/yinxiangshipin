import React, { useMemo, useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeText, Row, Avatar, Iconfont } from '@src/components';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';

export interface Props {
    post?: any;
    itemWidth?: number;
    itemHeight?: number;
}

const Icons = {
    liked: require('@app/assets/images/icons/ic_heart_red.png'),
    like: require('@app/assets/images/icons/ic_heart_gray.png'),
};

const PostItem = observer((props: Props) => {
    const navigation = useNavigation();
    const { post, itemWidth, itemHeight } = props;
    const { content, description, liked, count_likes, user, images, video } = post;

    const renderCover = useMemo(() => {
        let cover = 'http://cos.haxibiao.com/images/5f83d367ae609.jpeg';
        let type = 'video';
        if (Array.isArray(images) && images.length > 0) {
            cover = images[0].url;
            type = 'images';
        } else if (video) {
            cover = video.cover || video.url;
        }
        return (
            <View>
                <Image
                    source={{ uri: cover }}
                    resizeMode="cover"
                    style={{ width: itemWidth, height: itemHeight, backgroundColor: '#eee' }}
                />
                {type === 'video' && (
                    <View style={styles.videoMark}>
                        <Iconfont name="bofang1" size={pixel(15)} color={'#fff'} style={{ opacity: 0.8 }} />
                    </View>
                )}
            </View>
        );
    }, [images, video]);

    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{ width: itemWidth, borderRadius: pixel(5), overflow: 'hidden' }}
            onPress={() => navigation.navigate('PostDetail', { post })}>
            {renderCover}
            <View style={styles.bottomContent}>
                <View style={{ marginBottom: pixel(6) }}>
                    <SafeText style={styles.contentText} numberOfLines={2}>
                        {content || description}
                    </SafeText>
                </View>
                <Row style={styles.metaList}>
                    <TouchableOpacity style={styles.userInfo} onPress={() => navigation.navigate('User', { user })}>
                        <Avatar source={user.avatar} size={pixel(16)} />
                        <View style={{ flex: 1 }}>
                            <SafeText style={styles.nameText} numberOfLines={1}>
                                {user.name}
                            </SafeText>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.likeBox}>
                        <Text style={styles.lickCountText}>{Helper.count(count_likes)}</Text>
                        <Image source={liked ? Icons.liked : Icons.like} style={styles.likeIcon} />
                    </View>
                </Row>
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    videoMark: {
        ...StyleSheet.absoluteFill,
        alignItems: 'flex-end',
        top: pixel(6),
        right: pixel(5),
    },
    bottomContent: {
        paddingVertical: pixel(7),
        paddingHorizontal: pixel(5),
        backgroundColor: '#ffffff',
        borderBottomRightRadius: pixel(5),
        borderBottomLeftRadius: pixel(5),
        marginBottom: pixel(10),
    },
    contentText: {
        fontSize: font(12),
        lineHeight: pixel(18),
        fontWeight: 'bold',
        color: '#212121',
    },
    metaList: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(15),
    },
    nameText: {
        marginLeft: pixel(4),
        fontSize: pixel(11),
        color: '#b2b2b2',
    },
    likeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    likeIcon: {
        width: pixel(12),
        height: pixel(12),
    },
    lickCountText: {
        marginRight: pixel(3),
        fontSize: pixel(12),
        lineHeight: pixel(14),
        color: '#b2b2b2',
    },
});

export default PostItem;
