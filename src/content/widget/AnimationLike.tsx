import React, { useCallback, ReactChild } from 'react';
import { View, Text, ViewStyle, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { ContentData } from '@src/common';
import { GQL, useLikeMutation } from '@src/apollo';
import { userStore } from '@src/store';

interface Props {
    content: ContentData;
    style?: ViewStyle;
    children: ReactChild;
}

export default observer(({ content, style, children }: Props) => {
    const navigation = useNavigation();

    const change = useCallback(() => {
        content.liked ? content.count_likes-- : content.count_likes++;
        content.liked = !content.liked;
    }, [content]);

    const failure = useCallback((err) => {
        change();
        Toast.show({ content: err || '点赞失败' });
    }, []);

    const [toggleLike, { startAnimation, animateValue }] = useLikeMutation({
        variables: {
            id: content.id,
            type: 'POST',
        },
        options: {
            refetchQueries: () => [
                {
                    query: GQL.userLikedArticlesQuery,
                    variables: {
                        user_id: userStore.me.id,
                    },
                    fetchPolicy: 'network-only',
                },
            ],
        },
        failure,
    });

    const onPress = useCallback(() => {
        if (TOKEN) {
            startAnimation();
            change();
            toggleLike();
        } else {
            navigation.navigate('Login');
        }
    }, [change]);

    const scale = animateValue.interpolate({
        inputRange: [1, 1.5, 2],
        outputRange: [1, 1.1, 1],
    });

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.8}>
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
});
