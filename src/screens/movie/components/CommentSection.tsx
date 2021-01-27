import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    FlatList,
    Keyboard,
    DeviceEventEmitter,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Player, Avatar, ListFooter, StatusView, HxfTextInput, KeyboardSpacer } from '@src/components';
import { GQL, useQuery, useCommentMutation } from '@src/apollo';
import { observer, userStore, notificationStore } from '@src/store';
import { BoxShadow } from 'react-native-shadow';
import CommentItem from './CommentItem';

export default observer(({ movie }) => {
    const isSelf = userStore.me.id === movie?.user?.id;
    const fancyInputRef = useRef();
    const [placeholder, setPlaceholder] = useState();
    const [commentValue, setCommentValue] = useState('');
    const [replyComment, setReplyComment] = useState();
    const [fixedNavBar, setFixedNavBar] = useState(false);
    const disableButton = commentValue.trim().length <= 0;
    // 评论数据
    const { data, error, refetch, loading, fetchMore } = useQuery(GQL.commentsQuery, {
        variables: { commentable_type: 'movies', commentable_id: movie?.id, replyCount: 3 },
        fetchPolicy: 'network-only',
    });
    const commentsData = useMemo(() => Helper.syncGetter('comments.data', data), [data]);
    const currentPage = useMemo(() => Helper.syncGetter('comments.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('comments.paginatorInfo.hasMorePages', data), [data]);
    const onEndReached = useCallback(() => {
        if (hasMorePages && !loading) {
            fetchMore({
                variables: {
                    page: currentPage + 1,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (fetchMoreResult && fetchMoreResult.comments) {
                        return Object.assign({}, prev, {
                            comments: Object.assign({}, prev.comments, {
                                paginatorInfo: fetchMoreResult.comments.paginatorInfo,
                                data: [...prev.comments.data, ...fetchMoreResult.comments.data],
                            }),
                        });
                    }
                },
            });
        }
    }, [loading, currentPage, hasMorePages]);

    // 评论功能回调
    const onCompleted = useCallback(
        (comment) => {
            // 不是回复评论
            if (!comment && movie) {
                movie.count_comments++;
            }
        },
        [movie],
    );
    const onError = useCallback((content) => {
        Toast.show({ content });
    }, []);

    // 删除评论
    const deleteComment = useCallback((comment) => {
        comment.count_comments--;
    }, []);

    // 添加评论
    const addComment = useCommentMutation({
        commentAbleType: 'movies',
        commentAbleId: movie?.id,
        replyComment,
        onCompleted,
        onError,
    });
    const changeCommentText = useCallback((text) => {
        setCommentValue(text);
    }, []);
    const sendComment = useCallback(() => {
        Keyboard.dismiss();
        addComment({ body: commentValue });
        changeCommentText('');
    }, [addComment, commentValue]);

    // 回复评论
    const onReplyComment = useCallback(
        (comment) => {
            setReplyComment(comment);
            setPlaceholder('@' + comment.user.name);
            fancyInputRef.current.focus();
        },
        [fancyInputRef],
    );
    const onKeyboardHide = useCallback(() => {
        setReplyComment();
        setPlaceholder(null);
    }, []);
    useEffect(() => {
        DeviceEventEmitter.addListener('replyComment', onReplyComment);

        return () => {
            DeviceEventEmitter.removeListener('replyComment', onReplyComment);
        };
    }, [onReplyComment]);

    // 获取头部内容高度
    const headerHeight = useRef(Device.width);
    // 底部动画
    const fadeAnimation = useRef(new Animated.Value(0));
    const inputTranslateY = fadeAnimation.current.interpolate({
        inputRange: [0, headerHeight.current],
        outputRange: [0, Device.height - headerHeight.current - bottomInputHeight ? 0 : bottomInputHeight],
    });

    const FooterComponent = useMemo(() => {
        const hasComment = commentsData && commentsData.length > 0;
        if (loading || hasMorePages) {
            return (
                <View style={styles.listFooter}>
                    <ActivityIndicator size="large" color={'#e9e9e9'} />
                </View>
            );
        }
        if (hasComment && !hasMorePages) {
            return (
                <View style={styles.listFooter}>
                    <Text style={styles.listFooterText}>-- end --</Text>
                </View>
            );
        }
        return (
            <StatusView.EmptyView
                style={{ minHeight: percent(50), paddingVertical: pixel(20), backgroundColor: '#fff' }}
                imageSource={require('@app/assets/images/default/common_comment_default.png')}
            />
        );
    }, [loading, commentsData, hasMorePages]);
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <FlatList
                    keyboardDismissMode="none"
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    data={commentsData}
                    renderItem={({ item }) => {
                        return <CommentItem comment={item} onDelete={deleteComment} />;
                    }}
                    refreshing={loading}
                    onRefresh={refetch}
                    // ItemSeparatorComponent={() => <View style={styles.commentSeparator} />}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={FooterComponent}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={0.1}
                />
                <Animated.View style={[styles.bottomInput, { transform: [{ translateY: inputTranslateY }] }]}>
                    <BoxShadow
                        setting={Object.assign({}, shadowOpt, {
                            height: bottomInputHeight,
                        })}>
                        <View style={styles.inputContainer}>
                            <HxfTextInput
                                ref={fancyInputRef}
                                style={styles.textInput}
                                placeholder={placeholder || '说点什么...'}
                                value={commentValue}
                                onChangeText={changeCommentText}
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, !disableButton && { backgroundColor: '#0984FD' }]}
                                onPress={sendComment}
                                disabled={disableButton}>
                                <Text style={styles.sendButtonText}>发布</Text>
                            </TouchableOpacity>
                        </View>
                    </BoxShadow>
                </Animated.View>
            </View>
            <KeyboardSpacer onKeyboardHide={onKeyboardHide} />
        </View>
    );
});

const shadowOpt = {
    width: Device.width,
    color: '#E8E8E8',
    border: pixel(3),
    radius: pixel(12),
    opacity: 0.5,
    x: 0,
    y: 1,
    style: {
        marginTop: 0,
    },
};

const bottomInputHeight = pixel(52);
const navBarHeight = pixel(44 + Device.statusBarHeight);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    navBarContainer: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        left: 0,
        right: 0,
        height: navBarHeight,
    },
    navBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: bottomInputHeight - 1,
        backgroundColor: '#fff',
    },
    headerWrap: {
        paddingBottom: pixel(5),
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    commentSeparator: {
        marginLeft: pixel(58),
        height: pixel(1),
        backgroundColor: '#f0f0f0',
    },
    listFooter: {
        paddingVertical: pixel(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    listFooterText: {
        fontSize: font(13),
        color: Theme.subTextColor,
    },
    bottomInput: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    inputContainer: {
        height: bottomInputHeight,
        paddingHorizontal: pixel(15),
        paddingVertical: pixel(8),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: pixel(1),
        borderTopColor: '#e9e9e9',
    },
    textInput: {
        flex: 1,
        alignSelf: 'stretch',
        fontSize: font(14),
        marginRight: pixel(15),
        color: '#000',
        backgroundColor: '#fff',
    },
    sendButton: {
        width: bottomInputHeight,
        height: pixel(30),
        borderRadius: pixel(3),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e9e9e9',
    },
    sendButtonText: {
        fontSize: font(14),
        color: '#fff',
        letterSpacing: pixel(4),
    },
});
