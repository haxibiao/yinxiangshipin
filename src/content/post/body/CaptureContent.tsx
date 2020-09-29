import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Iconfont, SafeText, PlaceholderImage, GridImage } from '@src/components';
import { observer, userStore } from '@src/store';
import { GQL, useApolloClient, ApolloProvider } from '@src/apollo';
import { AnimationLike, Commodity, MoreOperation } from '../../widget';
import { Overlay } from 'teaset';

const videoWidth = Device.WIDTH * 0.6;
const videoHeight = videoWidth * 1.33;
const COVER_WIDTH = Device.WIDTH - pixel(14) * 2;

interface Props {
    post: any;
    fadeOut?: () => void;
}

const POST_STATUS = {
    '-1': { text: '已拒绝', color: '#FF4C4C' },
    '0': { text: '审核中', color: '#12E2BB' },
    '1': { text: '编辑', color: '#0584FF' },
};

export default observer(
    (props: Props): JSX.Element => {
        const { post, fadeOut } = props;
        const { user } = post;
        const overlayKey = useRef();
        const navigation = useNavigation();
        const client = useApolloClient();

        const ContentStatus = useMemo(() => {
            const statusInfo = POST_STATUS[String(post?.status)] || POST_STATUS['0'];
            return (
                <TouchableOpacity
                    style={[styles.submitStatus, { backgroundColor: statusInfo.color }]}
                    onPress={() => navigation.navigate('EditPost', { post })}
                    disabled={statusInfo.text !== '编辑'}
                    activeOpacity={1}>
                    <Text style={styles.statusText}>{statusInfo.text}</Text>
                </TouchableOpacity>
            );
        }, [post]);

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
            const data = post?.tags?.data;
            if (data?.length > 0) {
                return (
                    <ScrollView
                        contentContainerStyle={styles.tagsContainer}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}>
                        {data.map((tag, index) => {
                            return (
                                <TouchableWithoutFeedback onPress={() => navigation.navigate('TagDetail', { tag })}>
                                    <View key={tag.id} style={styles.tagItem}>
                                        <Iconfont
                                            name="biaoqian"
                                            size={font(15)}
                                            color="#0584FF"
                                            style={{ marginRight: pixel(4) }}
                                        />
                                        <View style={{ maxWidth: pixel(100) }}>
                                            <Text style={styles.tagName} numberOfLines={1}>
                                                {tag.name}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </ScrollView>
                );
            }
            return null;
        }, [post]);

        const hideMoreOperation = useCallback(() => {
            Overlay.hide(overlayKey.current);
        }, []);

        const userOperation = useMemo(() => {
            const isMe = userStore?.me?.id === post?.user?.id;
            return (
                <ApolloProvider client={client}>
                    <MoreOperation
                        target={post}
                        options={['删除', '下载', '分享长图', '分享合集', '复制链接']}
                        collection={post?.collections?.[0]}
                        videoUrl={post?.video?.url}
                        videoTitle={post?.body}
                        closeOverlay={hideMoreOperation}
                        onRemove={fadeOut}
                        client={client}
                        navigation={navigation}
                    />
                </ApolloProvider>
            );
        }, [post, fadeOut, client]);

        const showMoreOperation = useCallback(() => {
            const Operation = (
                <Overlay.PullView
                    style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                    containerStyle={{ backgroundColor: 'transparent' }}
                    animated={true}>
                    {userOperation}
                </Overlay.PullView>
            );
            overlayKey.current = Overlay.show(Operation);
        }, [userOperation]);

        return (
            <>
                <View style={styles.header}>
                    <View style={styles.creator}>
                        <TouchableOpacity onPress={() => navigation.navigate('User', { user })}>
                            <Avatar source={user?.avatar} size={pixel(38)} />
                        </TouchableOpacity>
                        <View style={styles.userInfo}>
                            <SafeText style={styles.nameText}>{user?.name}</SafeText>
                            <SafeText style={styles.timeAgoText} numberOfLines={1}>
                                {post?.created_at}
                            </SafeText>
                        </View>
                    </View>
                    {ContentStatus}
                </View>
                <SafeText style={styles.bodyText} numberOfLines={3}>
                    {String(post?.content || post?.description).trim()}
                </SafeText>
                {renderCover}
                {renderTags}
                <View style={styles.footer}>
                    <View style={styles.metaList}>
                        <AnimationLike content={post} style={styles.metaItem}>
                            <Iconfont
                                size={font(22)}
                                name="xihuanfill"
                                color={post.liked ? Theme.watermelon : '#CCD5E0'}
                            />
                            <SafeText style={styles.countText}>{post?.count_likes || 0}</SafeText>
                        </AnimationLike>
                        <TouchableOpacity
                            style={styles.metaItem}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('PostDetail', { post })}>
                            <Iconfont name="liuyanfill" size={font(22)} color={'#CCD5E0'} />
                            <SafeText style={styles.countText}>{post?.count_comments || 0}</SafeText>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.6} onPress={showMoreOperation}>
                        <Iconfont name="qita1" size={font(22)} color={'#CCD5E0'} />
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
        justifyContent: 'space-between',
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
    submitStatus: {
        borderRadius: pixel(3),
        height: pixel(28),
        paddingHorizontal: pixel(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: pixel(10),
    },
    statusText: {
        fontSize: font(13),
        color: '#fff',
    },
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
        borderRadius: pixel(6),
    },
    portrait: {
        width: COVER_WIDTH * 0.5,
        height: COVER_WIDTH * 0.8,
        borderRadius: pixel(6),
    },
    tagsContainer: {
        paddingRight: pixel(10),
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: pixel(13),
        paddingRight: pixel(10),
    },
    tagName: {
        color: '#0584FF',
        fontSize: font(13),
        lineHeight: font(18),
    },
    footer: {
        marginTop: pixel(12),
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
        marginRight: pixel(24),
    },
    countText: {
        color: '#CCD5E0',
        fontSize: font(14),
        marginLeft: pixel(12),
    },
});
