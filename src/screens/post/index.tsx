import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
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
import NavBar from './components/NavBar';
import Content from './components/Content';
import ImageCarousel from './components/ImageCarousel';
import MediumPlayer from './components/MediumPlayer';
import CommentItem from './components/CommentItem';

export default observer((props) => {
    const { navigation, route } = props;
    const media = route.params?.post || {};
    const isSelf = userStore.me.id === media?.user?.id;
    const fancyInputRef = useRef();
    const [placeholder, setPlaceholder] = useState();
    const [commentValue, setCommentValue] = useState('');
    const [replyComment, setReplyComment] = useState();
    const [fixedNavBar, setFixedNavBar] = useState(false);
    const disableButton = commentValue.trim().length <= 0;

    // 获取头部内容高度
    const headerHeight = useRef(Device.width);
    const measurementHeader = useCallback((e) => {
        if (e.nativeEvent.layout.height) {
            headerHeight.current = e.nativeEvent.layout.height;
        }
    }, []);

    // 评论数据
    const { data, refetch, loading, fetchMore } = useQuery(GQL.commentsQuery, {
        variables: { commentable_type: 'articles', commentable_id: media?.id, replyCount: 3 },
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
            if (!comment && media) {
                media.count_comments++;
            }
        },
        [media],
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
        commentAbleType: 'articles',
        commentAbleId: media?.id,
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

    // 分享/更多
    const forwardPost = useCallback(() => {
        notificationStore.sendShareNotice({ target: media, type: 'post' });
    }, [media]);
    useEffect(() => {
        const forwardPostListener = DeviceEventEmitter.addListener('forwardPost', forwardPost);
        return () => {
            forwardPostListener.remove();
        };
    }, [forwardPost]);

    // 头部/底部动画
    const fadeAnimation = useRef(new Animated.Value(0));
    const onScroll = useMemo(() => {
        return Animated.event([{ nativeEvent: { contentOffset: { y: fadeAnimation.current } } }], {
            useNativeDriver: false,
        });
    }, []);
    const lightNavBarOpacity = fadeAnimation.current.interpolate({
        inputRange: [headerHeight.current - navBarHeight * 2, headerHeight.current - navBarHeight],
        outputRange: [1, 0],
    });
    const navBarOpacity = fadeAnimation.current.interpolate({
        inputRange: [headerHeight.current - navBarHeight * 2, headerHeight.current - navBarHeight],
        outputRange: [0, 1],
    });
    // const inputTranslateY = Animated.diffClamp(fadeAnimation.current, 0, bottomInputHeight);
    const inputTranslateY = fadeAnimation.current.interpolate({
        inputRange: [0, headerHeight.current],
        outputRange: [0, Device.height - headerHeight.current - bottomInputHeight ? 0 : bottomInputHeight],
    });

    // 头尾组件
    const HeaderComponent = useMemo(() => {
        const { video, images } = media;
        let medium = null;
        let isFixedNavBar = false;
        if (video) {
            const playerContainer = (() => {
                const proportion = video?.width / video?.height || 0.5614;
                const h = Math.ceil(Device.width / proportion);
                if (proportion > 1) {
                    return {
                        height: h,
                    };
                } else {
                    return {
                        height: Math.min(Math.ceil(h), Device.height),
                    };
                }
            })();
            if (playerContainer.height <= Device.width * 0.7) {
                setFixedNavBar(true);
                isFixedNavBar = true;
            }

            medium = (
                <View style={playerContainer}>
                    <MediumPlayer
                        source={{
                            uri: video.url,
                        }}
                        poster={{ uri: video.cover_url }}
                        duration={video.duration}
                    />
                </View>
            );
        }
        if (Array.isArray(images) && images.length > 0) {
            medium = <ImageCarousel images={images} />;
        }
        return (
            <View style={[styles.headerWrap, { marginTop: isFixedNavBar ? navBarHeight : 0 }]}>
                <StatusBar
                    translucent={true}
                    backgroundColor={'rgba(0,0,0,0)'}
                    barStyle={isFixedNavBar ? 'dark-content' : 'light-content'}
                />
                <View onLayout={measurementHeader}>{medium}</View>
                <Content media={media} />
            </View>
        );
    }, [media]);
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
                    <Text style={styles.listFooterText}>没有更多评论了</Text>
                </View>
            );
        } else {
        }
        return (
            <StatusView.EmptyView
                style={{ minHeight: percent(50), paddingVertical: pixel(20), backgroundColor: '#fff' }}
                imageSource={require('@app/assets/images/default/common_comment_default.png')}
            />
        );
    }, [loading, commentsData, hasMorePages]);

    return (
        <View style={styles.container}>
            <View style={styles.navBarContainer}>
                <Animated.View style={[styles.navBar, { opacity: fixedNavBar ? 0 : lightNavBarOpacity }]}>
                    <NavBar lightModal={true} media={media} navigation={navigation} />
                </Animated.View>
                <Animated.View style={[styles.navBar, { opacity: fixedNavBar ? 1 : navBarOpacity }]}>
                    <NavBar lightModal={false} media={media} navigation={navigation} />
                </Animated.View>
            </View>
            <View style={{ flex: 1 }}>
                <FlatList
                    keyboardDismissMode="none"
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    onScroll={onScroll}
                    data={commentsData}
                    renderItem={({ item }) => {
                        return <CommentItem comment={item} onDelete={deleteComment} />;
                    }}
                    ItemSeparatorComponent={() => <View style={styles.commentSeparator} />}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={HeaderComponent}
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
        borderTopWidth: pixel(1),
        borderTopColor: '#f0f0f0',
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
