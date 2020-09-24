import React, { useCallback, useState, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, Animated, Keyboard, Image, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import { Iconfont, Avatar, PullChooser, SafeText } from '@src/components';
import { exceptionCapture, useLinearAnimation, useReport } from '@src/common';
import { GQL, useMutation, useLikeMutation } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userStore } from '@src/store';
import { observer } from 'mobx-react';

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
    comment: Comment;
    onDelete: () => void; // 删除成功的callback，更新评论数值
}

const CommentItem = observer((props: Props) => {
    const { comment, onDelete } = props;

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

    const onReply = useCallback(() => {
        DeviceEventEmitter.emit('replyComment', comment);
    }, []);

    const changeLiked = useCallback(() => {
        if (comment) {
            comment.liked ? comment.likes-- : comment.likes++;
            comment.liked = !comment.liked;
        }
    }, [comment]);

    const toggleLikeFailed = useCallback((err) => {
        changeLiked();
        Toast.show({ content: err || '点赞失败' });
    }, []);

    const [toggleLikeMutation] = useLikeMutation({
        variables: {
            id: comment?.id,
            type: 'COMMENT',
        },
        failure: toggleLikeFailed,
    });

    const toggleLike = useCallback(() => {
        if (TOKEN) {
            changeLiked();
            toggleLikeMutation();
        } else {
            navigation.navigate('Login');
        }
    }, [changeLiked, toggleLikeMutation]);

    const [deleteCommentMutation] = useMutation(GQL.deleteCommentMutation, {
        variables: {
            id: comment.id,
        },
    });

    const deleteComment = useCallback(async () => {
        startAnimation(1, 0);
        const [error] = await exceptionCapture(deleteCommentMutation);
        if (error) {
            setVisible(true);
            animation.current.setValue(1);
            Toast.show({ content: error?.message || '删除失败', layout: 'top' });
        } else {
            onDelete(comment);
        }
    }, [deleteCommentMutation, comment, onDelete]);

    const report = useReport({ target: comment, type: 'comments' });

    const reportComment = useCallback(() => {
        report();
    }, [report]);

    const onLongPress = useCallback(() => {
        Keyboard.dismiss();
        const operations = [
            {
                title: '回复评论',
                onPress: () => DeviceEventEmitter.emit('replyComment', comment),
            },
        ];
        if (comment.user.id === userStore.me.id) {
            operations.push({
                title: '删除评论',
                onPress: deleteComment,
            });
        } else {
            operations.push({
                title: '举报评论',
                onPress: reportComment,
            });
        }

        PullChooser.show(operations);
    }, [comment]);

    const replyComments = useMemo(() => {
        let repliesContent = null;
        const replies = Helper.syncGetter('comments.data', comment);
        let countReplies = Math.max(comment.count_replies - 3, 0);

        if (Array.isArray(replies) && replies.length > 0) {
            countReplies += replies.length;
            repliesContent = replies.slice(0, 3).map((item) => {
                return (
                    <Text style={styles.replyText} key={item.id}>
                        <SafeText style={styles.replyUserName}>{Helper.syncGetter('user.name', item)} : </SafeText>
                        <SafeText style={styles.replyBodyContent}>{item.body}</SafeText>
                    </Text>
                );
            });
        }

        if (repliesContent) {
            return (
                <TouchableOpacity
                    style={{ marginTop: pixel(10) }}
                    activeOpacity={1}
                    onPress={() => navigation.navigate('Comment', { comment })}>
                    <View style={styles.replyContainer}>
                        {repliesContent}
                        {countReplies > 3 && <Text style={styles.replyUserName}>共{countReplies}条回复</Text>}
                    </View>
                </TouchableOpacity>
            );
        }

        return null;
    }, [comment]);

    const animateStyles = {
        opacity: animation.current,
        transform: [
            {
                translateX: animation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-Device.WIDTH * 1.5, 0],
                    extrapolate: 'clamp',
                }),
            },
        ],
    };

    return (
        <Animated.View style={[animateStyles, !visible && { display: 'none' }]}>
            <TouchableOpacity
                style={styles.commentWrap}
                delayLongPress={500}
                onLongPress={onLongPress}
                onPress={onReply}>
                <TouchableOpacity
                    style={styles.avatarWrap}
                    onPress={() => navigation.navigate('User', { user: Helper.syncGetter('user', comment) })}>
                    <Avatar source={Helper.syncGetter('user.avatar', comment)} size={pixel(38)} />
                </TouchableOpacity>
                <View style={styles.commentInfo}>
                    <View style={styles.commentUser}>
                        <SafeText numberOfLines={1} style={styles.userName}>
                            {Helper.syncGetter('user.name', comment)}
                        </SafeText>
                        <Text style={styles.dot}>·</Text>
                        <SafeText style={styles.timeAgo}>{comment.time_ago}</SafeText>
                    </View>
                    <View style={styles.commentBody}>
                        <SafeText style={styles.bodyContent}>{comment.body}</SafeText>
                    </View>
                    {replyComments}
                </View>
                <TouchableOpacity style={styles.likeBtn} onPress={toggleLike}>
                    <Image
                        source={
                            comment.liked
                                ? require('@app/assets/images/icon_like_r.png')
                                : require('@app/assets/images/icon_like_g.png')
                        }
                        style={styles.likeIcon}
                    />
                    {/* <Iconfont size={pixel(16)} name="xihuan" color={comment.liked ? Theme.watermelon : '#9d9d9d'} /> */}
                    {Number(comment.likes) > 0 && (
                        <Text style={[styles.countLikes, comment.liked && { color: Theme.watermelon }]}>
                            {comment.likes}
                        </Text>
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    commentWrap: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingVertical: pixel(15),
        backgroundColor: '#fff',
    },
    avatarWrap: {
        paddingHorizontal: pixel(10),
    },
    commentInfo: { flex: 1 },
    commentUser: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        color: '#013569',
        fontSize: font(14),
    },
    dot: {
        color: '#9d9d9d',
        fontSize: font(12),
        marginHorizontal: pixel(4),
    },
    timeAgo: {
        color: '#9d9d9d',
        fontSize: font(14),
    },
    commentBody: {
        marginTop: pixel(10),
    },
    bodyContent: {
        color: '#2A2A2A',
        fontSize: font(14),
        lineHeight: font(20),
    },
    likeBtn: {
        width: pixel(48),
        alignItems: 'center',
        paddingVertical: pixel(2),
    },
    likeIcon: {
        width: pixel(18),
        height: pixel(18),
    },
    countLikes: {
        color: '#9d9d9d',
        fontSize: font(12),
        lineHeight: font(16),
    },
    replyContainer: {
        backgroundColor: '#F8F9FB',
        borderRadius: pixel(5),
        flex: 1,
        paddingHorizontal: pixel(10),
        paddingVertical: pixel(8),
    },
    replyText: {
        fontSize: font(13),
        lineHeight: font(22),
    },
    replyUserName: {
        color: '#013569',
    },
    replyBodyContent: {
        color: '#2A2A2A',
    },
});

export default CommentItem;
