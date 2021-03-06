import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, StyleSheet, Image, Text, Animated, Platform, DeviceEventEmitter } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Avatar from '../Basic/Avatar';
import PlaceholderImage from '../Basic/PlaceholderImage';
import Row from '../Basic/Row';
import SafeText from '../Basic/SafeText';
import Iconfont from '../Iconfont';
import GridImage from './GridImage';
import Like from './Like';

import { observer, appStore, userStore, notificationStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';

interface SubmitStatusProps {
    submit: number;
}

const SubmitStatus: React.FC<SubmitStatusProps> = (props: SubmitStatusProps) => {
    const audit = useMemo(() => {
        switch (String(props.submit)) {
            case '-1':
                return { status: '已拒绝', color: '#FF4C4C' };
                break;
            case '1':
                return { status: '已通过', color: '#12E2BB' };
                break;
            case '0':
                return { status: '审核中', color: '#FF7233' };
                break;
            default:
                return { status: '审核中', color: '#FF7233' };
        }
    }, [props]);

    return (
        <View style={[styles.submitStatus, { backgroundColor: audit.color }]}>
            <Text style={styles.statusText}>{audit.status}</Text>
        </View>
    );
};

export interface Props {
    showSeparator?: boolean;
    showSubmitStatus?: boolean;
    showComment?: boolean; // 是否显示评论(详情页)
    post: any;
}

const videoWidth = Device.width * 0.6;
const videoHeight = videoWidth * 1.33;
const COVER_WIDTH = Device.width - pixel(Theme.edgeDistance) * 2;

const PostItem: React.FC<Props> = observer((props: Props) => {
    const { showSubmitStatus, showSeparator, post = {}, showComment } = props;
    const navigation = useNavigation();
    const {
        type,
        user,
        time_ago,
        created_at,
        body,
        description,
        cover,
        tag,
        submit,
        remark,
        count_likes,
        count_comments,
        id,
        video,
        images,
    } = post;
    const me = Helper.syncGetter('me', userStore);
    const isSelf = me.id === user.id;
    const [visible, setVisible] = useState(true);
    const animation = useRef(new Animated.Value(1));
    const startAnimation = useCallback(
        (startValue: number = 0, toValue: number = 1) => {
            animation.current.setValue(startValue);
            Animated.timing(animation.current, {
                toValue,
                duration: 300,
            }).start(() => setVisible(false));
        },
        [setVisible],
    );

    const renderCover = useMemo(() => {
        if (Array.isArray(images) && images.length > 0) {
            return (
                <View style={styles.contentBottom}>
                    <GridImage images={images} />
                </View>
            );
        } else if (cover && !showComment) {
            const isLandscape = video?.width > video?.height;
            return (
                <View style={styles.contentBottom}>
                    <PlaceholderImage
                        source={{ uri: cover }}
                        style={isLandscape ? styles.landscape : styles.portrait}
                        videoMark={true}
                    />
                </View>
            );
        }
    }, []);
    const renderTags = useMemo(() => {
        if (tag?.data?.length > 0) {
            return (
                <View style={styles.tag}>
                    {tag.data.map((tag, index) => (
                        <TouchableOpacity
                            activeOpacity={1}
                            key={tag.id}
                            style={styles.tagItem}
                            onPress={() => navigation.navigate('TagDetail', { tag })}>
                            <Text style={styles.tagName}>#{tag.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else {
            return null;
        }
    }, []);

    const showMoreOperation = useCallback(() => {
        notificationStore.sendShareNotice({ target: post, type: 'post' });
    }, [post]);

    // 监听删除事件，执行隐藏动画
    useEffect(() => {
        const removedListener = DeviceEventEmitter.addListener('DeletePost', (targetId) => {
            if (targetId === post?.id) {
                startAnimation(1, 0);
            }
        });
        return () => {
            removedListener.remove();
        };
    }, [post]);

    const onPress = useCallback(() => {
        if (showComment) {
            return;
        }
        navigation.navigate('PostDetail', {
            post,
        });
    }, [post, showComment]);

    const showRemark = useMemo(() => showSubmitStatus && remark && submit < 0, [props]);

    if (!visible || !post) {
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
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.postContainer}>
                    {showRemark && (
                        <View style={styles.remark}>
                            <Text style={styles.remarkText}>描述:{remark}</Text>
                        </View>
                    )}
                    <View style={styles.headerWrapper}>
                        <View style={styles.userInfo}>
                            <TouchableOpacity onPress={() => navigation.push('User', { user })}>
                                <Avatar source={user.avatar} size={pixel(38)} />
                            </TouchableOpacity>
                            <View style={styles.info}>
                                <SafeText style={styles.nameText}>{user.name}</SafeText>
                                <SafeText style={styles.timeAgoText} numberOfLines={1}>
                                    {time_ago || created_at}
                                </SafeText>
                            </View>
                        </View>
                        {showSubmitStatus && <SubmitStatus submit={submit} />}
                    </View>

                    <View style={styles.contentTop}>
                        <Text style={styles.bodyText} numberOfLines={showComment ? 100 : 3}>
                            {body || description}
                        </Text>
                    </View>
                    {renderCover}
                    {renderTags}
                    <View style={styles.bottomPartWrapper}>
                        <Row style={styles.metaList}>
                            <Like
                                media={post}
                                type="icon"
                                iconSize={font(22)}
                                containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                                textStyle={{ color: '#CCD5E0', fontSize: font(14), marginStart: 15, marginEnd: 23 }}
                            />
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => navigation.navigate('PostDetail', { post })}>
                                <Iconfont name="liuyanfill" size={font(22)} color={'#CCD5E0'} />
                            </TouchableOpacity>
                            {count_comments >= 0 && (
                                <Text style={{ color: '#bfbfbf', fontSize: font(14), marginStart: 15, marginEnd: 23 }}>
                                    {count_comments || 0}
                                </Text>
                            )}
                        </Row>
                        {!(isSelf && showComment) && (
                            <TouchableOpacity activeOpacity={0.6} onPress={showMoreOperation}>
                                <Iconfont name="qita1" size={pixel(22)} color={'#CCD5E0'} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {showComment && (
                <View style={styles.commentsHeader}>
                    <Text style={{ color: '#CBD8E1' }}>{`所有评论(${count_comments || 0})`}</Text>
                </View>
            )}
        </Animated.View>
    );
});

PostItem.defaultProps = {
    showSeparator: true,
    showComment: false,
};

export default PostItem;

const styles = StyleSheet.create({
    tag: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: pixel(34),
        justifyContent: 'center',
        marginRight: pixel(10),
        marginTop: pixel(10),
    },
    tagName: {
        color: Theme.primaryColor,
        fontSize: font(13),
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(Theme.edgeDistance),
    },
    info: {
        justifyContent: 'space-between',
        marginLeft: pixel(Theme.edgeDistance),
    },
    timeAgoText: { fontSize: font(12), color: Theme.slateGray1, fontWeight: '300', marginTop: pixel(5) },
    nameText: { fontSize: font(14), color: Theme.defaultTextColor },
    questionLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(24),
        borderRadius: pixel(12),
        paddingHorizontal: pixel(8),
        backgroundColor: Theme.groundColour,
    },
    questionText: {
        fontSize: font(11),
        color: Theme.subTextColor,
    },
    rewardText: {
        marginLeft: pixel(5),
        fontSize: font(11),
        color: Theme.watermelon,
    },
    bottomPartWrapper: {
        marginTop: pixel(10),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaList: {
        flex: 1,
        marginLeft: pixel(10),
        justifyContent: 'flex-start',
    },
    contentTop: {
        marginTop: pixel(Theme.edgeDistance),
    },
    contentBottom: {
        marginTop: pixel(Theme.edgeDistance),
    },
    bodyText: { color: Theme.defaultTextColor, fontSize: font(16), letterSpacing: 0.8 },
    postContainer: {
        paddingHorizontal: pixel(Theme.edgeDistance),
        marginVertical: pixel(Theme.edgeDistance),
    },
    headerWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    landscape: {
        width: COVER_WIDTH,
        height: (COVER_WIDTH * 9) / 16,
        borderRadius: pixel(6),
    },
    portrait: {
        width: COVER_WIDTH * 0.5,
        height: COVER_WIDTH * 0.8,
        borderRadius: pixel(6),
    },
    submitStatus: {
        borderRadius: pixel(12),
        height: pixel(24),
        paddingHorizontal: pixel(8),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: pixel(10),
    },
    statusText: {
        fontSize: font(12),
        color: '#fff',
    },
    remark: {
        flex: 1,
        paddingBottom: pixel(Theme.edgeDistance),
    },
    remarkText: {
        fontSize: font(14),
        color: Theme.subTextColor,
    },
    commentsHeader: {
        borderColor: Theme.borderColor,
        borderBottomWidth: pixel(0.5),
        padding: pixel(Theme.edgeDistance),
    },
});
