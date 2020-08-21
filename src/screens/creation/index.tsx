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
} from 'react-native';
import { PageContainer, NavBarHeader, Iconfont, MediaUploader, UserAgreementOverlay } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { observer, userStore, appStore } from '@src/store';
import { GQL, useMutation, errorMessage } from '@src/apollo';
import { observable } from 'mobx';

const MediaItemWidth = (Device.WIDTH - pixel(60)) / 3;

export default (props: any) => {
    const route = useRoute();
    const navigation = useNavigation();
    const [tags, setTags] = useState(route.params?.tag ? [route.params?.tag] : []);
    const [formData, setFormData] = useState({ body: '', qcvod_fileid: '', images: [], tag_names: [] });
    const isDisableButton = useMemo(() => {
        if (formData.body && (formData.qcvod_fileid || formData.images.length > 0)) {
            return false;
        }
        return true;
    }, [formData]);

    const [createPost, { data, loading }] = useMutation(GQL.createPostContent, {
        variables: {
            body: formData.body,
            images: formData.images,
            qcvod_fileid: formData.qcvod_fileid,
            tag_names: tags.map((c) => c.name),
            type: 'POST',
        },
        onError: (error: any) => {
            Toast.show({
                content: errorMessage(error) || '发布失败',
            });
        },
        onCompleted: (mutationResult: any) => {
            Toast.show({
                content: '发布成功',
            });
            navigation.replace('PostDetail', {
                post: observable(mutationResult.createPostContent),
            });
        },
    });

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
        } else {
            setFormData((prevFormData) => {
                return { ...prevFormData, qcvod_fileid: response ? response.video_id : null };
            });
        }
    }, []);

    const hasMedia = useMemo(() => {
        return formData.images.length > 0 || formData.qcvod_fileid;
    }, [formData]);

    const selectTag = useCallback(
        (tag) => {
            const isAdded = __.find(tags, function (item) {
                return item.id === tag.id;
            });
            if (!isAdded) {
                tags.unshift(tag);
                setTags([...tags]);
            }
        },
        [tags],
    );

    const deleteTagName = useCallback((index) => {
        setTags((tags) => {
            tags.splice(index, 1);
            return [...tags];
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
                            <TouchableOpacity style={styles.deleteTag} onPress={() => deleteTagName(index)}>
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
        if (!appStore.createUserAgreement) {
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
                        multiline={true}
                        maxLength={100}
                        textAlignVertical="top"
                        placeholder="记录你此刻的生活，分享给有趣的人看..."
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#b2b2b2"
                    />
                    <View style={styles.mediaContainer}>
                        <MediaUploader
                            onResponse={uploadResponse}
                            maxWidth={Device.WIDTH / 2}
                            style={styles.mediaItem}
                        />
                    </View>
                </View>
                <View style={styles.operationContainer}>
                    <TouchableOpacity
                        style={styles.operation}
                        activeOpacity={1}
                        onPress={() => navigation.navigate('TagList', { selectTag })}>
                        <View style={styles.operationLeft}>
                            <Image
                                source={require('@app/assets/images/icons/ic_tag_black.png')}
                                style={styles.operationIcon}
                            />
                            <Text style={styles.operationName}>添加话题</Text>
                        </View>
                        <Iconfont name="right" size={pixel(14)} color="#b2b2b2" />
                    </TouchableOpacity>
                    <View>{renderTagNames}</View>
                    <TouchableOpacity
                        style={styles.operation}
                        activeOpacity={1}
                        disabled={hasMedia}
                        onPress={() => null}>
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
    mediaItem: { width: MediaItemWidth, height: MediaItemWidth, marginTop: pixel(10), marginRight: pixel(15) },
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
