import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { NavBarHeader, MediaUploader, Avatar, Loading } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { userStore } from '@src/store';
import { observer } from 'mobx-react';
import { exceptionCapture } from '@src/common';

const getMovieEdit = observer(() => {
    const navigation = useNavigation();
    const route = useRoute();
    const movieTitle_first = route?.params?.keyword;
    const me = userStore.me;
    const [movieTitle, setMovieTitle] = useState(`#` + movieTitle_first + `#`);

    console.log('====================================');
    console.log('route.params?.collection', route.params?.collection);
    console.log('====================================');

    const [formData, setFormData] = useState({
        body: '',
        qcvod_fileid: '',
        images: [],
    });

    const changeTitle = useCallback(
        (value) => {
            if (value) {
                setMovieTitle(value);
            } else {
                setMovieTitle('');
                setTimeout(() => {
                    setMovieTitle('请输入片名~');
                }, 5000);
            }
        },
        [movieTitle],
    );

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

    const isDisableButton = useMemo(() => {
        if (formData.body && (formData.qcvod_fileid || formData.images.length > 0) && movieTitle != '请输入片名~') {
            return false;
        }
        return true;
    }, [formData, movieTitle]);

    const createPost = useCallback(async () => {
        Loading.show();
        const [error, res] = await exceptionCapture(createPostContent);
        console.log('====================================');
        console.log('res', res);
        console.log('====================================');
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
                    // share_link: shareLink.current,
                    // qcvod_fileid: formData.qcvod_fileid,
                    // tag_names: tags.map((c) => c.name),
                    // collection_ids: collections.map((c) => c.id),
                },
            });
        }
    }, [formData]);

    return (
        <View>
            <NavBarHeader
                title={<Text>在线求片</Text>}
                rightComponent={
                    <TouchableOpacity
                        disabled={isDisableButton}
                        style={[styles.publishButton, isDisableButton && { backgroundColor: '#b2b2b2' }]}
                        onPress={createPost}>
                        <Text style={styles.publishText}>发布</Text>
                    </TouchableOpacity>
                }
            />
            <View style={styles.meStyle}>
                <Avatar size={35} source={me.avatar} />
                <Text style={styles.myNameStyle}>{me.name}:</Text>
                <TextInput
                    value={movieTitle}
                    onChangeText={changeTitle}
                    underlineColorAndroid="transparent"
                    maxLength={15}
                    style={{
                        height: pixel(35),
                        padding: 0,
                        marginLeft: pixel(5),
                        fontSize: pixel(15),
                        fontWeight: 'bold',
                    }}
                />
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <TextInput
                        style={styles.bodyInput}
                        onChangeText={changeBody}
                        value={formData.body}
                        multiline={true}
                        maxLength={200}
                        textAlignVertical="top"
                        placeholder="如果前方没有路,那就走出一条属于自己的路,致敬开拓者..."
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#b2b2b2"
                    />
                    <View style={styles.mediaContainer}>
                        {/* {sharedVideo?.id ? (
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
                                maxWidth={Device.width / 2}
                                style={styles.mediaItem}
                            />
                        )} */}
                        <MediaUploader
                            onResponse={uploadResponse}
                            maxWidth={Device.width / 2}
                            style={styles.mediaItem}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
});

const MediaItemWidth = (Device.width - pixel(60)) / 3;

const styles = StyleSheet.create({
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
        paddingBottom: Device.bottomInset,
        backgroundColor: '#fff',
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
    meStyle: {
        flexDirection: 'row',
        paddingHorizontal: pixel(15),
        backgroundColor: '#fff',
        marginTop: pixel(12),
        paddingTop: pixel(15),
    },
    myNameStyle: {
        lineHeight: pixel(35),
        marginLeft: pixel(18),
        fontSize: font(16),
    },
});

export default getMovieEdit;
