import React, { useRef, useMemo, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native';
import { SafeText } from '@src/components';
import { observer } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Player from './Player';
import SideBar from './SideBar';
import { Commodity } from '../../widget';
import { font, pixel } from '../../helper';

// 109
export default observer((props) => {
    const { media, index, store } = props;
    const viewable = index === store.viewableItemIndex;
    const navigation = useNavigation();

    const playerRef = useRef();
    const togglePause = useCallback(() => {
        if (playerRef.current?.togglePause instanceof Function) {
            playerRef.current.togglePause();
        }
    }, []);

    const resizeMode = useMemo(() => {
        const videoHeight = media?.width;
        const videoWidth = media?.height;
        return videoWidth / videoHeight < 1 ? 'cover' : 'contain';
    }, [media]);

    const videoCover = useMemo(() => {
        const cover = media?.video?.cover;
        const source = cover ? { uri: cover } : require('@app/assets/images/curtain.png');
        return (
            <View style={styles.contentCover}>
                <Image style={styles.curtain} source={source} resizeMode="cover" blurRadius={4} />
                <View style={styles.blackMask} />
            </View>
        );
    }, [media]);

    const mediaCategories = useMemo(() => {
        if (media?.categories?.length > 0) {
            return media.categories.map((category: any) => (
                <Text
                    key={category.id}
                    style={styles.categoryName}
                    onPress={() => navigation.navigate('Category', { category })}>
                    {`#${category.name} `}
                </Text>
            ));
        }
        return null;
    }, []);

    return (
        <View
            style={{
                height: store.viewportHeight,
            }}>
            {videoCover}
            <View style={styles.positionContainer}>
                <Player ref={playerRef} store={store} media={media} resizeMode={resizeMode} viewable={viewable} />
            </View>
            <TouchableWithoutFeedback onPress={togglePause}>
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
                                {mediaCategories}
                                {media?.description}
                            </SafeText>
                        </View>
                    </View>
                    <SideBar media={media} store={store} />
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
    categoryName: {
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
