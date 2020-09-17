import React, { useState, useMemo, useCallback, useContext, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    StatusBar,
    Linking,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {
    PageContainer,
    NavBarHeader,
    Iconfont,
    Loading,
    MediaUploader,
    UserAgreementOverlay,
    OverlayViewer,
} from '@src/components';
import { GQL, useMutation, errorMessage } from '@src/apollo';
import { exceptionCapture } from '@src/common';
import { shareClipboardLink } from '@src/content';
import { useRoute, useNavigation } from '@react-navigation/native';
import { observer, userStore, appStore } from '@src/store';
import { observable } from 'mobx';
import { Overlay } from 'teaset';
import Video from 'react-native-video';
import SharedVideoContent from './SharedVideoContent';

const MediaItemWidth = (Device.WIDTH - pixel(60)) / 3;

export default (props: any) => {
    const route = useRoute();
    const navigation = useNavigation();
    const [tags, setTags] = useState(route.params?.tag ? [route.params?.tag] : []);
    const [formData, setFormData] = useState({
        body: '',
        qcvod_fileid: '',
        images: [],
    });
    // 粘贴板分享视频
    const shareLink = useRef();
    const [sharedVideo, setSharedVideo] = useState();
    const deleteVideo = useCallback(() => {
        setSharedVideo(null);
    }, []);

    const isDisableButton = useMemo(() => {
        if (formData.body && (formData.qcvod_fileid || formData.images.length > 0 || sharedVideo?.id)) {
            return false;
        }
        return true;
    }, [formData, sharedVideo]);

    const createPost = useCallback(async () => {
        Loading.show();
        const [error, res] = await exceptionCapture(createPostContent);
        Loading.hide();
        if (error) {
            Toast.show({
                content: errorMessage(error) || '发布失败',
            });
        } else if (res) {
            Toast.show({
                content: '发布成功',
            });
            navigation.replace('PostDetail', {
                post: observable(res?.data?.createPostContent),
            });
        }

        function createPostContent() {
            return appStore.client.mutate({
                mutation: GQL.createPostContent,
                variables: {
                    body: formData.body,
                    images: formData.images,
                    share_link: shareLink.current,
                    qcvod_fileid: formData.qcvod_fileid || sharedVideo?.id,
                    tag_names: tags.map((c) => c.name),
                },
            });
        }
    }, [sharedVideo, formData, tags]);

    const changeBody = useCallback((value) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, body: value };
        });
    }, []);

    const uploadResponse = useCallback((response) => {
        if (Array.isArray(response)) {
            setFormData((prevFormData: any) => {
                return { ...prevFormData, images: response };
            });
        } else if (response?.video_id) {
            setFormData((prevFormData) => {
                return { ...prevFormData, qcvod_fileid: response?.video_id };
            });
        } else {
            setFormData((prevFormData) => {
                return { ...prevFormData, qcvod_fileid: null };
            });
        }
    }, []);

    const hasMedia = useMemo(() => {
        return formData.images.length > 0 || formData.qcvod_fileid || sharedVideo?.id;
    }, [formData, sharedVideo]);

    const shareVideo = useCallback(async () => {
        if (!appStore.spiderVideoTaskGuided) {
            appStore.setAppStorage('spiderVideoTaskGuided', true);
            appStore.spiderVideoTaskGuided = true;
            navigation.navigate('SpiderVideoTask');
            return;
        }
        var popViewRef,
            isShow = false;
        function onClose() {
            popViewRef?.close();
            isShow = false;
        }
        Loading.show();
        const clipboardString = await Clipboard.getString();
        const [error, sharedContent] = await exceptionCapture(() => shareClipboardLink(clipboardString));
        Loading.hide();
        if (error) {
            Linking.openURL(Device.IOS ? 'itms-apps://itunes.apple.com/app/id1142110895' : 'snssdk1128://');
            return;
        }
        if (sharedContent && !isShow) {
            isShow = true;
            shareLink.current = clipboardString;
            Overlay.show(
                <Overlay.PopView
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    ref={(ref) => (popViewRef = ref)}>
                    <SharedVideoContent
                        client={appStore.client}
                        onSuccess={(video) => {
                            if (video?.title) {
                                changeBody(video?.title);
                            }
                            setSharedVideo(video);
                            onClose();
                        }}
                        onClose={onClose}
                        {...sharedContent}
                    />
                </Overlay.PopView>,
            );
        }
    }, []);

    const showVideo = useCallback((path) => {
        const overlayView = (
            <Video
                source={{
                    uri: path,
                }}
                style={{ ...StyleSheet.absoluteFill }}
                muted={false}
                paused={false}
                resizeMode="contain"
            />
        );
        OverlayViewer.show(overlayView);
    }, []);

    const selectTag = useCallback(
        (tag) => {
            const isAdded = __.find(tags, function (item) {
                return item.name === tag.name;
            });
            if (!isAdded) {
                const newTags = [tag, ...tags];
                setTags(newTags);
            }
        },
        [tags],
    );

    const deleteTag = useCallback((index) => {
        setTags((tags) => {
            const newTags = [...tags];
            newTags.splice(index, 1);
            return newTags;
        });
    }, []);

    const renderTagNames = useMemo(() => {
        if (tags?.length > 0) {
            return (
                <ScrollView
                    contentContainerStyle={styles.tagNames}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}>
                    {tags.map((tag, index) => (
                        <View key={tag?.name} style={styles.tagItem}>
                            <View style={{ maxWidth: pixel(100) }}>
                                <Text style={styles.tagName} numberOfLines={1}>
                                    #{tag?.name}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.deleteTag} onPress={() => deleteTag(index)}>
                                <Iconfont name="guanbi1" size={pixel(13)} color="#4085FF" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            );
        } else {
            return null;
        }
    }, [tags]);

    useEffect(() => {
        if (!appStore.agreeCreatePostAgreement) {
            UserAgreementOverlay(
                () => {
                    navigation.navigate('CreatePost');
                },
                () => {
                    navigation.goBack();
                },
            );
        }
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <NavBarHeader
                title="发布动态"
                rightComponent={
                    <TouchableOpacity
                        disabled={isDisableButton}
                        style={[styles.publishButton, isDisableButton && { backgroundColor: '#b2b2b2' }]}
                        onPress={createPost}>
                        <Text style={styles.publishText}>发布</Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.bodyInput}
                        onChangeText={changeBody}
                        value={formData.body}
                        multiline={true}
                        maxLength={100}
                        textAlignVertical="top"
                        placeholder="记录你此刻的生活，分享给有趣的人看..."
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#b2b2b2"
                    />
                    <View style={styles.mediaContainer}>
                        {sharedVideo?.id ? (
                            <TouchableOpacity
                                style={styles.videoWrap}
                                activeOpacity={1}
                                onPress={() => showVideo(sharedVideo?.path)}>
                                <Image
                                    style={styles.videoItem}
                                    source={{
                                        uri: sharedVideo?.cover,
                                    }}
                                />
                                <View style={styles.playMark}>
                                    <TouchableOpacity style={styles.deleteVideo} onPress={deleteVideo}>
                                        <Iconfont name="guanbi1" size={pixel(12)} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <MediaUploader
                                onResponse={uploadResponse}
                                maxWidth={Device.WIDTH / 2}
                                style={styles.mediaItem}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.operationContainer}>
                    <TouchableOpacity
                        style={styles.operation}
                        activeOpacity={1}
                        disabled={hasMedia}
                        onPress={shareVideo}>
                        <View style={styles.operationLeft}>
                            <Image
                                source={
                                    hasMedia
                                        ? require('@app/assets/images/icons/ic_link_gray.png')
                                        : require('@app/assets/images/icons/ic_link_black.png')
                                }
                                style={styles.operationIcon}
                            />
                            <Text style={[styles.operationName, hasMedia && { color: '#b2b2b2' }]}>分享视频链接</Text>
                        </View>
                        <Iconfont name="right" size={pixel(14)} color="#b2b2b2" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.operation}
                        activeOpacity={1}
                        disabled={tags.length >= 5}
                        onPress={() => navigation.navigate('TagList', { selectTag })}>
                        <View style={styles.operationLeft}>
                            <Image
                                source={require('@app/assets/images/icons/ic_tag_black.png')}
                                style={styles.operationIcon}
                            />
                            <Text style={styles.operationName}>添加标签</Text>
                        </View>
                        <Iconfont name="right" size={pixel(14)} color="#b2b2b2" />
                    </TouchableOpacity>
                    <View>{renderTagNames}</View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    publishButton: {
        marginRight: pixel(12),
        height: pixel(28),
        paddingHorizontal: pixel(12),
        borderRadius: pixel(14),
        justifyContent: 'center',
        backgroundColor: Theme.watermelon,
    },
    publishText: {
        color: '#fff',
        fontSize: font(15),
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    content: {
        padding: pixel(15),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f0f0f0',
    },
    bodyInput: {
        height: pixel(120),
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
        paddingTop: 0,
        padding: 0,
        margin: 0,
    },
    mediaContainer: {
        marginRight: -pixel(15),
        marginBottom: pixel(10),
    },
    videoWrap: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginTop: pixel(10),
        marginRight: pixel(15),
    },
    videoItem: {
        width: MediaItemWidth,
        height: MediaItemWidth * 1.5,
    },
    playMark: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: pixel(5),
        justifyContent: 'center',
    },
    deleteVideo: {
        alignItems: 'center',
        backgroundColor: 'rgba(32,30,51,0.8)',
        borderRadius: pixel(20) / 2,
        height: pixel(20),
        justifyContent: 'center',
        position: 'absolute',
        right: pixel(3),
        top: pixel(3),
        width: pixel(20),
    },
    mediaItem: {
        width: MediaItemWidth,
        height: MediaItemWidth,
        marginTop: pixel(10),
        marginRight: pixel(15),
    },
    operationContainer: {
        paddingLeft: pixel(15),
    },
    operation: {
        paddingVertical: pixel(15),
        paddingRight: pixel(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f0f0f0',
    },
    operationLeft: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    operationIcon: {
        width: pixel(22),
        height: pixel(22),
        marginRight: pixel(10),
    },
    operationName: {
        color: '#2b2b2b',
        fontSize: font(16),
    },
    tagNames: {
        paddingTop: pixel(10),
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: pixel(10),
        marginBottom: pixel(10),
        height: pixel(28),
        paddingLeft: pixel(8),
        paddingRight: pixel(9),
        borderWidth: pixel(1),
        borderRadius: pixel(14),
        borderColor: '#4085FF',
        backgroundColor: '#fff',
    },
    tagName: {
        fontSize: font(12),
        color: '#4085FF',
    },
    deleteTag: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: pixel(6),
        marginRight: -pixel(6),
    },
});
