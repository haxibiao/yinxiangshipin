import React, { Component, useContext, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Image, Text } from 'react-native';
import { useBounceAnimation } from '@src/common';
import { GQL, useMutation } from '@src/apollo';
import { observer } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import Iconfont from '../Iconfont';
import SafeText from '../Basic/SafeText';

const imageSource = {
    liked: require('@app/assets/images/isLike.png'),
    unlike: require('@app/assets/images/noLike.png'),
};

interface ThumbUpTarget {
    id: number | string;
    liked: boolean;
    count_likes: number | string;
    [key: string]: any;
}

interface Props {
    [key: string]: any;
    isAd?: boolean;
    shadowText?: boolean;
}

const SelectLike = observer((props: Props) => {
    const { media, containerStyle, imageStyle, textStyle, shadowText, iconSize, type } = props;
    const navigation = useNavigation();
    const firstMount = useRef(true);
    const [animation, startAnimation] = useBounceAnimation({ value: 1, toValue: 1.2 });
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, {
        variables: {
            liked_id: Helper.syncGetter('id', media),
            liked_type: 'VIDEO',
        },
    });

    const likeHandler = __.debounce(async function() {
        const [error, result] = await Helper.exceptionCapture(likeArticle);
        if (error) {
            media.liked ? media.count_likes-- : media.count_likes++;
            media.liked = !media.liked;
            if (!props.isAd) {
                Toast.show({ content: '操作失败' });
            }
        }
    }, 500);

    function toggleLike(): void {
        if (TOKEN) {
            media.liked ? media.count_likes-- : media.count_likes++;
            media.liked = !media.liked;
        } else {
            navigation.navigate('Login');
        }
    }

    useEffect(() => {
        if (!firstMount.current) {
            startAnimation();
            likeHandler();
        }
        firstMount.current = false;
    }, [media.liked]);

    const scale = animation.interpolate({
        inputRange: [1, 1.1, 1.2],
        outputRange: [1, 1.25, 1],
    });
    if (type === 'icon') {
        return (
            <Animated.View style={{ transform: [{ scale }] }}>
                <TouchableOpacity onPress={toggleLike} style={styles.containerStyle}>
                    <Iconfont size={iconSize} name="xihuanfill" color={media.liked ? Theme.watermelon : '#CCD5E0'} />
                    <SafeText style={textStyle} shadowText={shadowText}>
                        {media.count_likes || 0}
                    </SafeText>
                </TouchableOpacity>
            </Animated.View>
        );
    }
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity onPress={toggleLike} style={styles.containerStyle}>
                <Image source={media.liked ? imageSource.liked : imageSource.unlike} style={styles.imageStyle} />
                <SafeText style={styles.textStyle} shadowText={shadowText}>
                    {media.count_likes}
                </SafeText>
            </TouchableOpacity>
        </Animated.View>
    );
});

SelectLike.defaultProps = {
    containerStyle: { flexDirection: 'column' },
    imageStyle: { height: pixel(40), width: pixel(40) },
    textStyle: { color: 'rgba(255,255,255,0.8)', fontSize: font(12), marginTop: pixel(10), textAlign: 'center' },
};
const styles = StyleSheet.create({
    countLikes: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: font(12),
        marginTop: pixel(10),
        textAlign: 'center',
    },
    iconSize: pixel(40),
    imageStyle: {
        height: pixel(40),
        width: pixel(40),
    },
});
export default SelectLike;
