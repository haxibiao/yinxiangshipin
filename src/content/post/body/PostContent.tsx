import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Avatar, Iconfont, SafeText, PlaceholderImage, GridImage } from '@src/components';
import { observer, userStore, notificationStore } from '@src/store';
import { AnimationLike, Commodity } from '../../widget';
import { Overlay } from 'teaset';

const videoWidth = Device.width * 0.6;
const videoHeight = videoWidth * 1.33;
const COVER_WIDTH = Device.width - pixel(14) * 2;

const HeartIcon = {
    liked: require('@app/assets/images/icons/ic_heart_red.png'),
    unlike: require('@app/assets/images/icons/ic_heart_normal.png'),
};

interface Props {
    post: any;
}

export default observer(
    (props: Props): JSX.Element => {
        const { post } = props;
        const { user } = post;
        const navigation = useNavigation();
        const route = useRoute();

        const goToScreen = useCallback(() => {
            if (route.name === 'Personage' && userStore.me.id === post?.user?.id) {
                // 个人主页不重复跳转到用户主页
                return;
            } else if (route.params?.user?.id === post?.user?.id) {
                navigation.navigate('User', { user: post?.user });
            } else {
                navigation.push('User', { user: post?.user });
            }
        }, []);

        const renderCover = useMemo(() => {
            const images = post?.images;
            const video = post?.video;
            const cover = video?.cover;
            if (images?.length > 0) {
                return <GridImage images={images} />;
            } else if (cover) {
                const isLandscape = video?.width > video?.height;
                return (
                    <PlaceholderImage
                        source={{ uri: cover }}
                        style={isLandscape ? styles.landscape : styles.portrait}
                        videoMark={true}
                        post={post}
                    />
                );
            }
        }, [post]);

        const renderTags = useMemo(() => {
            const tags = post?.tags?.data;
            if (tags?.length > 0) {
                return (
                    <ScrollView
                        contentContainerStyle={styles.tagsContainer}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}>
                        {tags.map((tag, index) => (
                            <TouchableOpacity
                                activeOpacity={1}
                                key={tag?.id}
                                style={styles.tagItem}
                                onPress={() => navigation.push('TagDetail', { tag })}>
                                <View style={styles.tagLeft}>
                                    <Text style={styles.tagLabel}>集</Text>
                                </View>
                                <View style={{ maxWidth: pixel(100) }}>
                                    <Text style={styles.tagName} numberOfLines={1}>
                                        {tag?.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                );
            } else {
                return null;
            }
        }, [post]);

        return (
            <>
                <View style={styles.header}>
                    <View style={styles.creator}>
                        <TouchableOpacity onPress={goToScreen}>
                            <Avatar source={user?.avatar} size={pixel(38)} />
                        </TouchableOpacity>
                        <View style={styles.userInfo}>
                            <SafeText style={styles.nameText}>{user?.name}</SafeText>
                            <SafeText style={styles.timeAgoText} numberOfLines={1}>
                                {post?.created_at}
                            </SafeText>
                        </View>
                    </View>
                </View>
                <SafeText style={styles.bodyText} numberOfLines={3}>
                    {String(post?.content || post?.description).trim()}
                </SafeText>
                {renderCover}
                {renderTags}
                <View style={styles.footer}>
                    <View style={styles.metaList}>
                        <AnimationLike content={post} style={styles.metaItem}>
                            <Image
                                style={{ width: pixel(22), height: pixel(22) }}
                                source={post.liked ? HeartIcon.liked : HeartIcon.unlike}
                            />
                            <SafeText style={styles.countText}>{post?.count_likes || 0}</SafeText>
                        </AnimationLike>
                        <TouchableOpacity
                            style={styles.metaItem}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('PostDetail', { post })}>
                            <Image
                                style={{ width: pixel(22), height: pixel(22) }}
                                source={require('@app/assets/images/icons/ic_comment_normal.png')}
                            />
                            <SafeText style={styles.countText}>{post?.count_comments || 0}</SafeText>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => notificationStore.sendShareNotice({ target: post, type: 'post' })}>
                        <Image
                            style={{ width: pixel(22), height: pixel(22) }}
                            source={require('@app/assets/images/icons/ic_share_normal.png')}
                        />
                    </TouchableOpacity>
                </View>
            </>
        );
    },
);

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: pixel(15),
    },
    creator: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(14),
    },
    userInfo: {
        justifyContent: 'space-between',
        marginLeft: pixel(14),
    },
    timeAgoText: { fontSize: font(12), color: '#ECEAF3', fontWeight: '300', marginTop: pixel(5) },
    nameText: { fontSize: font(14), color: '#2b2b2b' },
    bodyText: {
        color: '#2b2b2b',
        fontSize: font(16),
        marginBottom: pixel(14),
    },
    productWrap: {
        marginTop: pixel(5),
        backgroundColor: '#FEF8FA',
    },
    landscape: {
        width: COVER_WIDTH,
        height: (COVER_WIDTH * 9) / 16,
        borderRadius: pixel(4),
    },
    portrait: {
        width: COVER_WIDTH * 0.4,
        height: COVER_WIDTH * 0.64,
        borderRadius: pixel(4),
    },
    tagsContainer: {
        paddingTop: pixel(13),
        paddingRight: pixel(10),
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        height: pixel(23),
        marginRight: pixel(10),
        borderRadius: pixel(3),
        backgroundColor: '#EDF3FF', // FEEFEE
    },
    tagLeft: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        width: pixel(23),
        backgroundColor: '#4085FF',
    },
    tagLabel: {
        color: '#fff',
        fontSize: font(12),
    },
    tagName: {
        paddingHorizontal: pixel(6),
        color: '#4085FF',
        fontSize: font(11),
    },
    footer: {
        marginTop: pixel(13),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaList: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(30),
    },
    countText: {
        color: '#2b2b2b',
        fontSize: font(14),
        marginLeft: pixel(8),
    },
});
