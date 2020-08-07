import React, { useCallback, useState, useRef, useMemo, ReactChild } from 'react';
import { StyleSheet, TouchableWithoutFeedback, ViewStyle, Animated } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';
import { pixel, WINDOW_WIDTH } from '../helper';
import { ContentData } from '../types';
import { PostContent } from './body';

interface Props {
    data: ContentData;
    children: ReactChild;
    style?: ViewStyle;
    disabled?: boolean;
    onPress?: (params?: any) => any;
    onLongPress?: (params?: any) => any;
}

export default observer(
    (props: Props): JSX.Element => {
        const { data = {}, onPress, onLongPress } = props;
        const navigation = useNavigation();
        const post = useMemo(() => {
            // 适配老字段
            if (!data?.content) {
                data.content = data.body;
            }
            return observable(data);
        }, [data]);

        const touchHandler = useCallback(() => {
            if (onPress instanceof Function) {
                onPress();
            } else {
                navigation.navigate('PostDetail', {
                    post,
                });
            }
        }, [post, onPress]);
        const longPressHandler = useCallback(() => {
            if (onLongPress instanceof Function) {
                onLongPress();
            }
        }, [onLongPress]);

        const [visible, setVisible] = useState(true);
        const animation = useRef(new Animated.Value(1));
        const fadeOut = useCallback(() => {
            animation.current.setValue(1);
            Animated.timing(animation.current, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setVisible(false));
        }, []);
        const animateStyles = {
            opacity: animation.current,
            transform: [
                {
                    translateY: animation.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: [WINDOW_WIDTH * -0.75, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        };

        const Body = useMemo(() => {
            if (React.isValidElement(props.children)) {
                return React.cloneElement(props.children, { fadeOut, post });
            } else {
                return <PostContent post={post} fadeOut={fadeOut} />;
            }
        }, [props.children, post, fadeOut]);

        // 执行动画，隐藏内容(2)
        // 数据监听：删除成功修改 post.visible = true。
        // useEffect(() => {
        //     if (post.visible) {
        //         fadeOut();
        //     }
        // }, [post.visible]);

        if (!visible || !post?.id) {
            return null;
        }

        return (
            <TouchableWithoutFeedback disabled={props.disabled} onPress={touchHandler} onLongPress={longPressHandler}>
                <Animated.View style={[styles.itemContainer, props.style, animateStyles]}>{Body}</Animated.View>
            </TouchableWithoutFeedback>
        );
    },
);

const styles = StyleSheet.create({
    itemContainer: {
        marginVertical: pixel(14),
        paddingHorizontal: pixel(14),
        backgroundColor: '#fff',
    },
});
