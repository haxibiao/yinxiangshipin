import React, { useRef, useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Overlay } from 'teaset';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApolloClient } from '@apollo/react-hooks';
import { ApolloProvider } from 'react-apollo';
import { SafeText } from '@src/components';
import { observer } from '@src/store';
import { Commodity } from '../../widget';
import { font, pixel } from '../../helper';
import Player from './Player';
import SideBar from './SideBar';
import VideoOperation from './VideoOperation';

export default observer((props) => {
    const { media, index, store } = props;
    const viewable = index === store.viewableItemIndex;
    const shown = useMemo(() => {
        if (store.viewableItemIndex > index + 2 || store.viewableItemIndex < index - 2 || viewable) {
            return true;
        }
        return false;
    }, [index, store.viewableItemIndex, viewable]);
    const client = useApolloClient();
    const navigation = useNavigation();
    // 获取播放器实例，控制视频播放状态
    const playerRef = useRef();
    const togglePause = useCallback(() => {
        if (playerRef.current?.togglePause instanceof Function) {
            playerRef.current.togglePause();
        }
    }, []);
    // 删除/不感兴趣 操作回调
    const removeMedia = useCallback(() => {
        store.removeItem(media);
    }, [media]);
    // 长按操作
    const overlayRef = useRef();
    const operation = useMemo(() => {
        return (
            <ApolloProvider client={client}>
                <VideoOperation
                    client={client}
                    navigation={navigation}
                    target={media}
                    videoUrl={media?.video?.url}
                    videoTitle={media?.body}
                    options={['下载', '不感兴趣', '举报']}
                    closeOverlay={() => overlayRef.current?.close()}
                    onRemove={removeMedia}
                />
            </ApolloProvider>
        );
    }, [client, media, removeMedia]);
    const showOperation = useCallback(() => {
        const MoreOperationOverlay = (
            <Overlay.PopView
                style={styles.overlay}
                ref={(ref) => (overlayRef.current = ref)}
                containerStyle={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                {operation}
            </Overlay.PopView>
        );
        Overlay.show(MoreOperationOverlay);
    }, [operation]);

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

    const mediaTags = useMemo(() => {
        if (media?.tags?.data?.length > 0) {
            return media.tags?.data?.map((tag: any) => (
                <Text key={tag.id} style={styles.tagName} onPress={() => navigation.navigate('TagDetail', { tag })}>
                    {`#${tag.name} `}
                </Text>
            ));
        }
        return null;
    }, []);

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
                    style={styles.blackContainer}
                    pointerEvents="box-none"
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['rgba(000,000,000,0.4)', 'rgba(000,000,000,0.2)', 'rgba(000,000,000,0.0)']}>
                    <View style={styles.videoInfo}>
                        {media?.product && (
                            <Commodity style={styles.goodsItem} product={media?.product} navigation={navigation} />
                        )}
                        <View style={styles.userInfo}>
                            <SafeText style={styles.userName}>@{media?.user?.name}</SafeText>
                            <SafeText shadowText={true} style={styles.createdAt}>
                                {` · ${media?.created_at}`}
                            </SafeText>
                        </View>
                        <View>
                            <SafeText style={styles.content} numberOfLines={3}>
                                {media?.description}
                                {mediaTags}
                            </SafeText>
                        </View>
                    </View>
                    <SideBar media={media} store={store} client={client} removeMedia={removeMedia} />
                </LinearGradient>
            </TouchableWithoutFeedback>
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
    blackContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingBottom: Device.isFullScreenDevice
            ? pixel(Theme.itemSpace)
            : pixel(Theme.BOTTOM_HEIGHT + Theme.itemSpace),
    },
    videoInfo: {
        flex: 1,
        marginRight: pixel(Theme.itemSpace),
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
    footer: {
        width: '100%',
        height: pixel(54),
        justifyContent: 'center',
        paddingHorizontal: pixel(10),
    },
    footerText: {
        fontSize: font(15),
        color: '#969696',
    },
});
