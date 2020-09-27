import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { NavBarHeader, MediaUploader, PageContainer, Row, Iconfont, Loading, SafeText } from '@src/components';
import { userStore, appStore } from '@src/store';
import { useNavigation } from '@react-navigation/native';
import { GQL, useMutation, errorMessage } from '@src/apollo';
import { exceptionCapture } from '@src/common';
import StashVideoStore from '@src/screens/collection/store';
import Video from 'react-native-video';

const maxMediaWidth = Device.WIDTH - Theme.itemSpace * 4;
const mediaWidth = maxMediaWidth / 3;

export default function CreateCollectionScreen(props) {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({ cover: '', title: '', description: '' });
    // video：添加至合集的视频，含空数据
    const [video, setVideo] = useState([]);
    // videoData存储处理过的video数据
    const [videoData, setVideoData] = useState([]);
    const uploadResponse = useCallback((response) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, cover: response[0] ? response[0] : '' };
        });
    }, []);

    const uploadVideoResponse = useCallback(
        (addedVideo) => {
            addedVideo &&
                setVideo(() => {
                    return [...videoData, ...addedVideo];
                });
        },
        [video, videoData],
    );

    const deleteVideo = useCallback(
        (index) => {
            setVideoData((prevData) => {
                prevData.splice(index, 1);
                return [...prevData];
            });
        },
        [videoData],
    );

    useEffect(
        () =>
            setVideoData(() => {
                return video.filter(function (obj) {
                    return !!obj.videoUrl && obj.post_id > 0;
                });
            }),
        [video],
    );

    const createCollection = useCallback(async () => {
        Loading.show();
        const [error, res] = await exceptionCapture(createPostCollection);
        Loading.hide();
        if (error) {
            Toast.show({
                content: errorMessage(error) || '创建失败',
            });
            console.log('创建合集error', error);
        } else if (res) {
            Toast.show({
                content: '创建成功',
            });
            navigation.goBack();
        }

        function createPostCollection() {
            return appStore.client.mutate({
                mutation: GQL.CreateCollectionMutation,
                variables: {
                    name: formData.title,
                    logo: formData.cover,
                    description: formData.description,
                    collectable_ids: videoData.map((v) => v.post_id),
                },
                refetchQueries: () => [
                    {
                        query: GQL.CollectionsQuery,
                        variables: {
                            user_id: userStore.me.id,
                        },
                    },
                ],
            });
        }
    }, [formData, videoData]);

    const topComponent = useCallback(() => {
        return (
            <View>
                <Text style={{ fontSize: font(16) }}>创建合集</Text>
                <View style={{ flexDirection: 'row', marginTop: pixel(10) }}>
                    <MediaUploader
                        type="image"
                        maximum={1}
                        onResponse={uploadResponse}
                        maxWidth={Device.WIDTH / 2}
                        style={styles.mediaItem}
                    />
                    <View style={{ flex: 1, overflow: 'hidden' }}>
                        <View style={styles.titleInput}>
                            <TextInput
                                style={{ fontSize: font(12), flex: 1, width: 0, padding: 0 }}
                                onChangeText={(val) =>
                                    setFormData((prevFormData) => {
                                        return { ...prevFormData, title: val };
                                    })
                                }
                                value={formData.title}
                                placeholder="请输入合集的标题（必填）"
                                numberOfLines={1}
                                maxLength={10}
                            />
                            <Text style={[styles.wordCount, { marginLeft: pixel(5) }]}>{formData.title.length}/10</Text>
                        </View>
                        <View style={styles.descriptionView}>
                            <TextInput
                                style={{ fontSize: font(12), flex: 1, padding: 0, height: 0 }}
                                onChangeText={(val) =>
                                    setFormData((prevFormData) => {
                                        return { ...prevFormData, description: val };
                                    })
                                }
                                multiline
                                value={formData.description}
                                placeholder="请输入合集的简介"
                                numberOfLines={4}
                                maxLength={100}
                            />
                            <Text style={styles.wordCount}>{formData.description.length}/100</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }, [formData]);

    const Album = useMemo(() => {
        if (Array.isArray(videoData) && videoData.length > 0) {
            return videoData.map((item, i) => {
                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{
                            marginRight: (i + 1) % 3 !== 0 ? pixel(Theme.itemSpace) : 0,
                            marginBottom: pixel(Theme.itemSpace),
                        }}
                        key={String(item.id || i)}>
                        <Video
                            muted={true}
                            repeat={true}
                            style={styles.uploadView}
                            resizeMode="cover"
                            source={{
                                uri: item.videoUrl,
                            }}
                        />
                        <View style={styles.playMark}>
                            <TouchableOpacity style={styles.close} onPress={() => deleteVideo(i)}>
                                <Iconfont name="guanbi1" size={pixel(12)} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                );
            });
        }
    }, [video, videoData]);

    const disabledBtn = !(formData.title && formData.description && formData.cover && videoData.length > 0);
    const disabledOnPress = useCallback(() => {
        if (!formData.title) {
            Toast.show({ content: '请完善标题' });
        } else if (!formData.description) {
            Toast.show({ content: '请完善简介' });
        } else if (!formData.cover) {
            Toast.show({ content: '请上传封面' });
        } else if (!videoData.length > 0) {
            Toast.show({ content: '至少添加一个作品' });
        }
    }, [formData, videoData]);
    return (
        <PageContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.bodyView}>
                    {topComponent()}
                    <View style={{ marginTop: pixel(30) }}>
                        <Text style={styles.uploadCount}>合集内作品{videoData.length}</Text>
                        <View style={styles.albumContainer}>
                            {Album}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    navigation.navigate('SelectPost', {
                                        user_id: userStore.me.id,
                                        uploadVideoResponse,
                                        videoData: videoData,
                                    });
                                }}
                                style={styles.addPost}>
                                <Iconfont name="iconfontadd" size={pixel(30)} color={Theme.slateGray1} />
                            </TouchableOpacity>
                        </View>
                        <Row style={{ marginTop: pixel(20) }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.btnStyle, styles.leftBtn, disabledBtn && styles.disabledBtn]}
                                onPress={disabledBtn ? disabledOnPress : createCollection}>
                                <SafeText style={[styles.btnTextStyle, disabledBtn && { color: 'red' }]}>创建</SafeText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnStyle} onPress={() => navigation.goBack()}>
                                <SafeText style={styles.btnTextStyle}>取消</SafeText>
                            </TouchableOpacity>
                        </Row>
                    </View>
                </View>
            </ScrollView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    bodyView: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: pixel(Theme.itemSpace),
    },
    mediaItem: {
        width: Device.WIDTH * 0.3,
        height: Device.WIDTH * 0.3,
        marginRight: pixel(10),
        backgroundColor: Theme.slateGray2,
        borderRadius: pixel(5),
    },
    titleInput: {
        padding: pixel(5),
        borderWidth: pixel(0.5),
        borderColor: '#9996',
        borderRadius: pixel(5),
        fontSize: font(12),
        flexDirection: 'row',
    },
    wordCount: {
        fontSize: font(10),
        color: '#666',
        alignSelf: 'flex-end',
    },
    descriptionView: {
        paddingHorizontal: pixel(5),
        borderWidth: pixel(0.5),
        borderColor: '#9996',
        borderRadius: pixel(5),
        marginTop: pixel(10),
        flex: 1,
        overflow: 'hidden',
    },
    btnStyle: {
        backgroundColor: '#b2b2b2',
        paddingVertical: pixel(5),
        paddingHorizontal: pixel(20),
        borderRadius: pixel(3),
    },
    leftBtn: {
        backgroundColor: 'red',
        marginRight: pixel(Theme.itemSpace),
    },
    disabledBtn: {
        backgroundColor: '#fff',
        borderColor: '#9996',
        borderWidth: pixel(1),
    },
    btnTextStyle: {
        fontSize: font(12),
        color: '#fff',
    },
    playMark: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: pixel(5),
        justifyContent: 'center',
    },
    uploadView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.slateGray2,
        borderRadius: pixel(5),
        width: mediaWidth,
        height: mediaWidth * 1.4,
        overflow: 'hidden',
    },
    addPost: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.slateGray2,
        borderRadius: pixel(5),
        width: mediaWidth,
        height: mediaWidth * 1.4,
        overflow: 'hidden',
    },
    close: {
        alignItems: 'center',
        backgroundColor: 'rgba(32,30,51,0.8)',
        borderRadius: pixel(18) / 2,
        height: pixel(18),
        justifyContent: 'center',
        position: 'absolute',
        right: pixel(3),
        top: pixel(3),
        width: pixel(18),
    },
    uploadCount: {
        fontSize: font(12),
        color: '#666',
        marginBottom: pixel(10),
    },
    albumContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
});
