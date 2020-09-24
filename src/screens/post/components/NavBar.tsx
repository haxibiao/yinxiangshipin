import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Animated,
    DeviceEventEmitter,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Iconfont, Avatar, SafeText } from '@src/components';
import { useLinearAnimation } from '@src/common';
import { GQL, useLikeMutation, useFollowMutation } from '@src/apollo';
import { userStore } from '@src/store';
import { observer } from 'mobx-react';

const NavBar = observer(({ lightModal, media, navigation }) => {
    const initValue = useRef(media.user.id === userStore.me.id ? 0 : media.user.followed_status ? 0 : 1);
    const [fadeOut, fadeOutAnimation] = useLinearAnimation({ initValue: initValue.current, duration: 400 });

    const images = useMemo(() => {
        return {
            back: lightModal
                ? require('@app/assets/images/icons/ic_back_white.png')
                : require('@app/assets/images/icons/ic_back_black.png'),
            liked: require('@app/assets/images/icons/ic_like_red.png'),
            like: lightModal
                ? require('@app/assets/images/icons/ic_like_white.png')
                : require('@app/assets/images/icons/ic_like_black.png'),
            forward: lightModal
                ? require('@app/assets/images/icons/ic_more_white.png')
                : require('@app/assets/images/icons/ic_more_black.png'),
        };
    }, [lightModal]);

    const colors = useMemo(() => {
        return {
            background: lightModal ? 'rgba(225,225,225,0)' : '#ffffff',
            buttonBackground: lightModal ? 'rgba(0,0,0,0.4)' : '#f0f0f0',
            arrowColor: lightModal ? '#fff' : '#E6E6E6',
            textColor: lightModal ? '#fff' : '#212121',
        };
    }, [lightModal]);

    const likeHandler = useLikeMutation({
        variables: {
            id: Helper.syncGetter('id', media),
            type: 'VIDEO',
        },
    });

    const followHandler = useFollowMutation({
        variables: {
            followed_id: Helper.syncGetter('user.id', media),
            followed_type: 'users',
        },
    });

    const toggleLike = useCallback(() => {
        if (TOKEN) {
            media.liked ? media.count_likes-- : media.count_likes++;
            media.liked = !media.liked;
            likeHandler();
        } else {
            navigation.navigate('Login');
        }
    }, [media, likeHandler]);

    const followUser = useCallback(() => {
        if (TOKEN) {
            media.user.followed_status = 1;
            fadeOutAnimation(1, 0);
            followHandler();
        } else {
            navigation.navigate('Login');
        }
    }, [media, followHandler]);

    const forwardPost = useCallback(() => {
        DeviceEventEmitter.emit('forwardPost');
    }, []);

    useEffect(() => {
        if (media.user.followed_status && initValue.current) {
            fadeOutAnimation(1, 0);
        }
    }, [media.user.followed_status]);

    return (
        <View
            style={[styles.navBarContent, { backgroundColor: colors.background }]}
            // start={{ x: 0, y: 1 }}
            // end={{ x: 0, y: 0 }}
            // colors={['rgba(000,000,000,0.2)', 'rgba(000,000,000,0.1)', 'rgba(000,000,000,0)']}
        >
            <View style={styles.navBarLeft}>
                {/* <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                    <Iconfont name="zuojiantou" size={pixel(25)} color={colors.arrowColor} />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.operateButton} onPress={() => navigation.goBack()}>
                    <Image source={images.back} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.operateButton} onPress={toggleLike}>
                    <Image source={media.liked ? images.liked : images.like} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.operateButton} onPress={forwardPost}>
                    <Image source={images.forward} style={styles.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.navBarRight}>
                <Animated.View
                    style={[
                        styles.followButtonWrap,
                        {
                            backgroundColor: colors.buttonBackground,
                            opacity: initValue.current ? fadeOut : 0,
                            zIndex: initValue.current ? 1 : -1,
                        },
                    ]}>
                    <TouchableOpacity style={styles.followButton} onPress={followUser} activeOpacity={1}>
                        <SafeText style={[styles.buttonText, { color: colors.textColor }]}>关 注</SafeText>
                    </TouchableOpacity>
                </Animated.View>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('User', { user: media.user })}>
                    <Image style={styles.avatar} source={{ uri: media.user.avatar }} />
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
});

export default NavBar;

const styles = StyleSheet.create({
    navBarContent: {
        height: pixel(44 + Theme.statusBarHeight),
        paddingTop: pixel(Theme.statusBarHeight + 4),
        paddingBottom: pixel(8),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navBarLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goBackButton: {
        paddingHorizontal: pixel(10),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    operateButton: {
        paddingHorizontal: pixel(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: pixel(25),
        height: pixel(25),
        marginHorizontal: pixel(2),
    },
    navBarRight: {
        marginRight: pixel(15),
    },
    followButtonWrap: {
        borderRadius: pixel(20),
    },
    followButton: {
        width: pixel(84),
        height: pixel(34),
        paddingLeft: pixel(4),
        paddingRight: pixel(30),
        marginRight: pixel(4),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: font(14),
        fontWeight: 'bold',
    },
    avatar: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: pixel(34),
        height: pixel(34),
        borderRadius: pixel(20),
        zIndex: 2,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
});
