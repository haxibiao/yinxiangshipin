import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, ImageBackground, TouchableOpacity, DeviceEventEmitter, Animated } from 'react-native';
import { useCirculationAnimation } from '@src/common';
import { Avatar, SafeText } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { observer, userStore, notificationStore } from '@src/store';
import { AnimationLike } from '../../widget';

const imageSource = {
    liked: require('@app/assets/images/ic_liked.png'),
    unlike: require('@app/assets/images/ic_like.png'),
};

// {
//     id: 16151,
//     name: '僵尸高校2',
//     cover: 'http://images.cnblogsc.com/pic/upload/vod/2020-03/1583088602.jpg',
// }

export default observer(({ media, store }) => {
    const navigation = useNavigation();
    const isMe = useMemo(() => userStore?.me?.id === media?.user?.id, []);
    const movie = media?.movie;
    const animation = useCirculationAnimation({ duration: 8000, start: !!movie });
    const rotate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    const showComment = useCallback(() => {
        DeviceEventEmitter.emit('showCommentModal');
    }, []);

    return (
        <View style={styles.sideBar}>
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('User', { user: media?.user });
                    }}>
                    <Avatar
                        source={media?.user?.avatar}
                        size={pixel(52)}
                        style={{ borderColor: '#fff', borderWidth: 1 }}
                    />
                </TouchableOpacity>
            </View>
            <AnimationLike content={media} style={styles.itemWrap}>
                <Image source={media.liked ? imageSource.liked : imageSource.unlike} style={styles.imageSize} />
                <SafeText style={styles.countText} shadowText={true}>
                    {(media.count_likes <= 0 ? 0 : media.count_likes) || 0}
                </SafeText>
            </AnimationLike>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={showComment}>
                    <Image source={require('@app/assets/images/comment_item.png')} style={styles.imageSize} />
                    <SafeText style={styles.countText} shadowText={true}>
                        {Helper.count(media?.count_comments)}
                    </SafeText>
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={() => notificationStore.sendShareNotice({ target: media, type: 'post' })}>
                    <Image source={require('@app/assets/images/more_item.png')} style={styles.imageSize} />
                </TouchableOpacity>
            </View>
            {movie && (
                <View style={styles.itemWrap}>
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movie })}>
                            <ImageBackground
                                source={require('@app/assets/images/movie/playing_film.png')}
                                style={styles.imageSize}>
                                <Image source={{ uri: movie?.cover }} style={styles.movieCover} />
                            </ImageBackground>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    sideBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap: {
        marginTop: pixel(18),
    },
    countText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: font(12),
        marginTop: pixel(4),
        textAlign: 'center',
    },
    imageSize: {
        height: pixel(40),
        width: pixel(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    movieCover: {
        height: pixel(24),
        width: pixel(24),
        borderRadius: pixel(12),
    },
});
