import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { NavBarHeader, MediaUploader, PageContainer, Row, Iconfont } from '@src/components';
import { userStore } from '@src/store';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';

const maxMediaWidth = Device.WIDTH - Theme.itemSpace * 4;
const mediaWidth = maxMediaWidth / 3;
export default function CreateCollectionScreen(props) {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({ cover: '', title: '', description: '' });
    const [video, setVideo] = useState([]);
    const uploadResponse = useCallback((response) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, cover: response[0] ? response[0] : '' };
        });
    }, []);
    const uploadVideoResponse = useCallback(
        ({ response, post_id }) => {
            if (
                __.find(video, function (item) {
                    return item.post_id === post_id;
                })
            ) {
                Toast.show({ content: '该作品已经添加过了' });
            } else {
                setVideo((prevVideoData) => {
                    return [
                        ...prevVideoData,
                        { videoUrl: response ? response.url : '', post_id: post_id ? post_id : '' },
                    ];
                });
            }
        },
        [video],
    );
    const videoData = useMemo(() => {
        return video.filter(function (obj) {
            return obj.videoUrl.length > 0 && obj.post_id > 0;
        });
    }, [video]);

    const deleteVideo = useCallback((index) => {
        setVideo((prevVideo) => {
            prevVideo.splice(index, 1);
            return [...prevVideo];
        });
    }, []);
    console.log('formData', formData);
    console.log('video', video);
    console.log('videoData', videoData);

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
                                style={{ fontSize: font(12), flex: 1, padding: 0 }}
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
                                style={{ fontSize: font(12), flex: 1, padding: 0 }}
                                onChangeText={(val) =>
                                    setFormData((prevFormData) => {
                                        return { ...prevFormData, description: val };
                                    })
                                }
                                multiline
                                value={formData.description}
                                placeholder="请输入合集的简介"
                                numberOfLines={2}
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

    return (
        <PageContainer>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.bodyView}>
                    {topComponent()}
                    <View style={{ marginTop: pixel(30) }}>
                        <Text style={{ fontSize: font(12), color: '#666', marginBottom: pixel(10) }}>合集内作品0</Text>
                        <View style={styles.albumContainer}>
                            {Album}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    navigation.navigate('SearchVideo', {
                                        user_id: userStore.me.id,
                                        selectable: true,
                                        uploadVideoResponse,
                                    })
                                }
                                style={styles.addPost}>
                                <Iconfont name="iconfontadd" size={pixel(30)} color={Theme.slateGray1} />
                            </TouchableOpacity>
                        </View>

                        <Row style={{ marginTop: pixel(20) }}>
                            <TouchableOpacity style={[styles.btnStyle, styles.leftBtn]}>
                                <Text style={styles.btnTextStyle}>创建</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnStyle}>
                                <Text style={[styles.btnTextStyle, { color: '#000' }]}>取消</Text>
                            </TouchableOpacity>
                        </Row>
                    </View>
                </View>
            </ScrollView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        // paddingVertical:pixel(5),
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
        // flex: 1,
        // overflow: 'hidden',
    },
    btnStyle: {
        backgroundColor: '#9996',
        paddingVertical: pixel(5),
        paddingHorizontal: pixel(20),
        borderRadius: pixel(3),
    },
    leftBtn: {
        backgroundColor: 'red',
        marginRight: pixel(Theme.itemSpace),
    },
    btnTextStyle: {
        fontSize: font(11),
        color: '#fff',
        fontWeight: 'bold',
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
        // marginRight: Theme.itemSpace,
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
    albumContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    // uploadView: {
    //     alignItems: 'center',
    //     backgroundColor: Theme.slateGray2,
    //     borderRadius: pixel(5),
    //     height: mediaWidth,
    //     justifyContent: 'center',
    //     marginRight: Theme.itemSpace,
    //     overflow: 'hidden',
    //     width: mediaWidth,
    // },
});
