import React, { useRef, useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Pressable, DeviceEventEmitter } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeText, Iconfont } from '@src/components';
import { observable, observer, userStore, appStore, notificationStore } from '@src/store';
import Player from './Player';
import SideBar from './SideBar';
import AnswerQuestion from './AnswerQuestion';
import MarqueeText from './MarqueeText';

interface Props {
    media: any;
    index: number;
    store: any;
}

const qd = {
    id: 1,
    description: '视频刷动态关联题目，题目类型为纯文本的单选题，并且题干和选项字数不宜过多',
    answer: ['B'],
    selections: [
        {
            Value: 'A',
            Text: '选项字数不宜过多',
        },
        { Value: 'B', Text: '选项字数不宜过多' },
        { Value: 'C', Text: '选项字数不宜过多' },
    ],
};

export default observer((props: Props) => {
    const { media, index, store } = props;
    const movie = media?.movies?.[0];
    const viewable = index === store.viewableItemIndex && store.visibility;
    const isMe = useMemo(() => userStore?.me?.id === media?.user?.id, []);

    const shown = useMemo(() => {
        // 播放器的显示区间
        if ((store.viewableItemIndex > index - 2 && store.viewableItemIndex < index + 3) || viewable) {
            return true;
        }
        return false;
    }, [index, store.viewableItemIndex, viewable]);

    const route = useRoute();
    const navigation = useNavigation();
    // 获取播放器实例，控制视频播放状态
    const playerRef = useRef();
    const togglePause = useCallback(() => {
        if (playerRef.current?.togglePause instanceof Function) {
            playerRef.current.togglePause();
        }
    }, []);
    // 长按操作
    const showOperation = useCallback(() => {
        notificationStore.sendShareNotice({ target: media, type: 'post' });
    }, []);

    const resizeMode = useMemo(() => {
        const videoHeight = media?.video?.height;
        const videoWidth = media?.video?.width;
        // 1080/720
        // 720/1280
        // return videoWidth / videoHeight > 0.6 ? 'contain' : 'cover';
        return 'contain';
    }, [media]);

    const videoCover = useMemo(() => {
        const cover = media?.video?.cover;
        const source = cover ? { uri: cover } : require('@app/assets/images/curtain.png');
        return (
            <View style={styles.contentCover}>
                <Image style={styles.curtain} source={source} resizeMode="cover" blurRadius={2} />
                <View style={styles.blackMask} />
            </View>
        );
    }, [media]);

    const goToScreen = useCallback((tag) => {
        if (route.params?.tag?.id === tag?.id) {
            navigation.navigate('TagDetail', { tag });
        } else {
            navigation.push('TagDetail', { tag });
        }
    }, []);

    const mediaTags = useMemo(() => {
        // const tagsData = [
        //     { id: 24, name: '美少女' },
        //     { id: 26, name: '长沙漫展' },
        // ];
        const tagsData = media?.tags?.data;
        if (tagsData?.length > 0) {
            return tagsData.map((tag: any) => (
                <SafeText key={tag.id} style={styles.tagName} onPress={() => goToScreen(tag)}>
                    {` #${tag.name} `}
                </SafeText>
            ));
        }
        return null;
    }, []);

    const Collection = useMemo(() => {
        const collectionData = media?.collections?.[0];
        if (
            collectionData &&
            appStore.currentRouteName !== 'EpisodeVideoList' &&
            appStore.currentRouteName !== 'CollectionVideoList'
        ) {
            const collection = observable(collectionData);
            return (
                <Pressable
                    onPress={() => {
                        navigation.navigate('EpisodeVideoList', {
                            collection,
                            post: media,
                        });
                    }}>
                    <View style={styles.collectionItem}>
                        <View style={styles.collectionInfo}>
                            <Iconfont name="wenji" color="#fff" size={pixel(14)} />
                            <SafeText style={styles.collectionName}>{`合集 · ${collection?.name}`}</SafeText>
                        </View>
                        <Iconfont name="right" color="#b2b2b2" size={pixel(15)} />
                    </View>
                </Pressable>
            );
        }
        return null;
    }, [media, appStore.currentRouteName]);
    return (
        <View
            style={{
                height: store.fullVideoHeight,
            }}>
            {videoCover}
            <View style={styles.positionContainer}>
                {shown && (
                    <Player
                        ref={playerRef}
                        store={store}
                        media={media}
                        resizeMode={resizeMode}
                        viewable={viewable}
                        showOperation={showOperation}
                    />
                )}
            </View>
            <TouchableWithoutFeedback onPress={togglePause} onLongPress={showOperation}>
                <LinearGradient
                    style={styles.pstContainer}
                    pointerEvents="box-none"
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['rgba(000,000,000,0.5)', 'rgba(000,000,000,0.3)', 'rgba(000,000,000,0.0)']}>
                    <View
                        style={{
                            paddingBottom: Device.isFullScreenDevice ? 0 : Device.tabBarHeight,
                        }}>
                        <View style={styles.postInfo}>
                            <View style={styles.videoInfo}>
                                <View style={styles.userInfo}>
                                    <SafeText style={styles.userName}>@{media?.user?.name}</SafeText>
                                    <SafeText shadowText={true} style={styles.createdAt}>
                                        {` · ${media?.created_at}`}
                                    </SafeText>
                                </View>
                                <View>
                                    <SafeText style={styles.content} numberOfLines={3}>
                                        {String(media?.description || media?.content).trim()}
                                        {mediaTags}
                                    </SafeText>
                                </View>
                                {movie && (
                                    <Pressable
                                        style={styles.movieInfo}
                                        onPress={() => navigation.navigate('MovieDetail', { movie })}>
                                        <Image
                                            style={styles.movieLabel}
                                            source={require('@app/assets/images/movie/ic_film_play.png')}
                                        />
                                        <MarqueeText
                                            width={Device.width - pixel(142)}
                                            textList={[
                                                {
                                                    value: `视频出处 ——《${movie?.name}》`,
                                                },
                                            ]}
                                        />
                                    </Pressable>
                                )}
                            </View>
                            <SideBar media={media} store={store} viewable={viewable} />
                        </View>
                        {Collection}
                    </View>
                </LinearGradient>
            </TouchableWithoutFeedback>
            {/* <AnswerQuestion question={qd} style={styles.questionSite} /> */}
        </View>
    );
});

const styles = StyleSheet.create({
    positionContainer: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    contentCover: {
        ...StyleSheet.absoluteFillObject,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: undefined,
        height: undefined,
    },
    blackMask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    pstContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    postInfo: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: pixel(10),
        paddingBottom: pixel(15),
    },
    videoInfo: {
        flex: 1,
        marginRight: pixel(40),
    },
    goodsItem: {
        marginRight: pixel(20),
        marginBottom: pixel(12),
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: { color: 'rgba(255,255,255,0.9)', fontSize: font(16), fontWeight: 'bold' },
    createdAt: {
        color: '#969696',
        fontSize: font(15),
    },
    content: { color: 'rgba(255,255,255,0.9)', fontSize: font(15), paddingTop: pixel(10) },
    tagName: {
        fontWeight: 'bold',
    },
    movieInfo: {
        flexDirection: 'row',
        marginTop: pixel(10),
    },
    movieLabel: {
        width: pixel(15),
        height: pixel(16),
        marginRight: pixel(5),
    },
    collectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pixel(10),
        paddingVertical: pixel(12),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    collectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    collectionName: {
        marginLeft: pixel(6),
        fontSize: font(14),
        fontWeight: 'bold',
        color: '#ffffff',
    },
    questionSite: {
        position: 'absolute',
        zIndex: 999,
        width: '64%',
        left: '5%',
        bottom: '25%',
    },
});
