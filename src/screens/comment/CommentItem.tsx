import React, { useCallback, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Keyboard,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { Iconfont, SafeText, Avatar, PullChooser, ItemSeparator } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { exceptionCapture, useLinearAnimation } from '@src/common';
import { useMutation, GQL } from '@src/apollo';
import { userStore } from '@src/store';

import ReplyComments from './ReplyComments';
import Like from './Like';

interface User {
    id: Int;
    name: string;
    avatar: string;
}

interface Replies {
    id: Int;
    body: string;
    user: User;
    time_ago: string;
}

interface Comment {
    id: Int;
    body: string;
    likes: Int;
    liked: boolean;
    time_ago: string;
    commentable_id: Int;
    user: User;
    replies?: Replies;
}

interface Props {
    disableLongPress?: boolean;
    isQuestioner?: boolean; // 是否是问答
    showSeparator?: boolean; // 分割线
    separatorHeight?: number; // 分割线高度
    comment: Comment;
    replyHandler: (e: Comment) => any; // 回复选项callback
    showReplyComment?: boolean; // 是否显示回复的评论
    decreaseCountComments: () => void; // 回复成功的callback，更新评论数值
}

const CommentItem = (props: Props) => {
    const {
        isQuestioner,
        disableLongPress,
        showSeparator,
        separatorHeight,
        comment,
        replyHandler,
        showReplyComment,
        decreaseCountComments,
    } = props;
    const navigation = useNavigation();
    const [visible, setVisible] = useState(true);
    const animation = useRef(new Animated.Value(1));
    const startAnimation = useCallback(
        (startValue: number = 0, toValue: number = 1) => {
            animation.current.setValue(startValue);
            Animated.timing(animation.current, {
                toValue,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setVisible(false));
        },
        [setVisible],
    );

    const [deleteCommentMutation] = useMutation(GQL.deleteCommentMutation, {
        variables: {
            id: comment.id,
        },
        onCompleted: (data) => {
            decreaseCountComments();
        },
    });

    const [acceptCommentMutation] = useMutation(GQL.acceptCommentMutation, {
        variables: {
            comment_ids: [comment.id],
        },
    });

    const deleteComment = useCallback(async () => {
        startAnimation(1, 0);
        const [error] = await exceptionCapture(deleteCommentMutation);
        if (error) {
            setVisible(true);
            animation.current.setValue(1);
            Toast.show({ content: error.message || '删除失败', layout: 'top' });
        }
    }, []);

    const acceptComment = useCallback(async () => {
        const [error] = await exceptionCapture(acceptCommentMutation);
        if (error) {
            Toast.show({ content: error.message || '采纳失败', layout: 'top' });
        }
    }, []);

    const onLongPress = useCallback(() => {
        if (disableLongPress) {
            return;
        }
        Keyboard.dismiss();
        const operations = [
            {
                title: '回复',
                onPress: () => replyHandler(comment),
            },
        ];
        if (comment.user.id === userStore.me.id) {
            operations.push({
                title: '删除',
                onPress: deleteComment,
            });
        } else {
            operations.push({
                title: '举报',
                onPress: Toast.show({ content: '举报成功' }),
            });
        }
        PullChooser.show(operations);
    }, [comment]);

    if (!visible) {
        return null;
    }

    const animateStyles = {
        opacity: animation.current,
        transform: [
            { scale: animation.current },
            {
                rotate: animation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['90deg', '0deg'],
                    extrapolate: 'clamp',
                }),
            },
        ],
    };

    return (
        <Animated.View style={animateStyles}>
            <TouchableOpacity
                style={styles.comment}
                activeOpacity={0.9}
                onPress={() => replyHandler(comment)}
                onLongPress={onLongPress}>
                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('User', { user: Helper.syncGetter('user', comment) })}>
                    <Avatar source={Helper.syncGetter('user.avatar', comment)} size={pixel(40)} />
                </TouchableWithoutFeedback>
                <View style={styles.commentRight}>
                    <View style={styles.commentedUser}>
                        <View style={styles.userName}>
                            <SafeText numberOfLines={1} style={styles.userNameText}>
                                {Helper.syncGetter('user.name', comment)}
                            </SafeText>
                        </View>
                        <Like comment={comment} />
                    </View>
                    <View style={styles.commentBody}>
                        {comment.body && <Text style={styles.bodyText}>{comment.body}</Text>}
                    </View>
                    {showReplyComment && <ReplyComments comment={comment} />}
                    <SafeText style={styles.timeAgoText}>{comment.time_ago}</SafeText>
                </View>
            </TouchableOpacity>
            {showSeparator && <ItemSeparator height={separatorHeight} />}
        </Animated.View>
    );
};

CommentItem.defaultProps = {
    separatorHeight: pixel(1),
    showSeparator: true,
    showReplyComment: true,
};

const styles = StyleSheet.create({
    beLikedCount: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    bodyText: {
        color: '#393939',
        fontSize: font(15),
        lineHeight: font(20),
    },
    acceptAnswer: {
        width: pixel(30),
        height: pixel(30),
        position: 'absolute',
        top: 0,
        left: 0,
    },
    acceptImage: {
        width: pixel(30),
        height: pixel(30),
    },
    comment: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        padding: pixel(Theme.itemSpace),
        backgroundColor: '#fff',
    },
    commentBody: {
        marginTop: pixel(10),
    },
    commentRight: { flex: 1, marginLeft: pixel(10) },
    commentedUser: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    countLikesText: {
        fontSize: font(12),
        fontWeight: '200',
    },
    timeAgoText: {
        color: Theme.subTextColor,
        fontSize: font(12),
        marginTop: pixel(10),
    },
    userName: {
        flex: 1,
        marginRight: pixel(10),
    },
    userNameText: {
        color: Theme.defaultTextColor,
        fontSize: font(12),
        fontWeight: 'bold',
    },
});

export default CommentItem;
