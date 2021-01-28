import React, { useCallback, useState, useMemo, useRef } from 'react';
import { StyleSheet, ScrollView, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { NavBarHeader, MediaUploader, Iconfont, SafeText } from '@src/components';
import { appStore, userStore, notificationStore } from '@src/store';
import { useNavigation } from '@react-navigation/native';
import { GQL, useMutation, errorMessage } from '@src/apollo';
import { openImagePicker } from '@src/common';
import Video from 'react-native-video';

const mediaWidth = Device.width * 0.28;

export default function CreateCollection(props) {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({ cover: '', title: '', description: '' });
    const [postIds, setPostIds] = useState([]);

    const [createCollectionMutation] = useMutation(GQL.createCollectionMutation, {
        variables: {
            name: formData.title,
            logo: formData.cover,
            description: formData.description,
            collectable_ids: postIds,
        },
        onCompleted: () => {
            notificationStore.toggleLoadingVisible();
            Toast.show({
                content: '创建成功',
            });
            navigation.goBack();
        },
        onError: (error) => {
            notificationStore.toggleLoadingVisible();
            Toast.show({
                content: errorMessage(error, '创建失败'),
            });
        },
        refetchQueries: () => [
            {
                query: GQL.collectionsQuery,
                variables: {
                    user_id: userStore.me.id,
                },
            },
        ],
    });

    const pickCollectionLogo = useCallback(() => {
        openImagePicker({ mediaType: 'photo', includeBase64: true })
            .then((image) => {
                const imagePath = `data:${image.mime};base64,${image.data}`;
                setFormData((prevFormData) => {
                    return { ...prevFormData, cover: imagePath };
                });
            })
            .catch((err) => {
                Toast.show({
                    content: '上传出错',
                });
            });
    }, []);

    const onSubmit = () => {
        if (validator()) {
            notificationStore.toggleLoadingVisible();
            createCollectionMutation();
        }
        function validator() {
            const tips = {
                title: '给合集取个名字哦',
                description: '简单介绍一下合集吧',
                cover: '请上传一张图片作为合集的封面',
            };
            if (postIds.length < 1) {
                Toast.show({
                    content: '请往合集添加至少一个作品',
                });
                return false;
            } else {
                for (const k of Object.keys(tips)) {
                    if (!formData[k]) {
                        Toast.show({
                            content: tips[k],
                        });
                        return false;
                    }
                }
            }
            return true;
        }
    };

    const inactiveBtn = !(formData.title && formData.description && formData.cover && postIds.length > 0);

    return (
        <View style={styles.container}>
            <NavBarHeader
                title={'新建合集'}
                rightComponent={
                    <TouchableOpacity style={styles.publishButton} onPress={onSubmit}>
                        <Text style={[styles.publishText, inactiveBtn && { color: '#b2b2b2' }]}>创建</Text>
                    </TouchableOpacity>
                }
            />
            <ScrollView contentContainerStyle={styles.formView} showsVerticalScrollIndicator={false}>
                <View style={styles.collectionLogo}>
                    <TouchableOpacity style={styles.logoArea} onPress={pickCollectionLogo}>
                        {formData.cover ? (
                            <Image source={{ uri: formData.cover }} style={styles.logoImage} />
                        ) : (
                            <Iconfont name="xiangji" size={pixel(20)} color="#fff" />
                        )}
                    </TouchableOpacity>
                    <Text style={styles.collectionLogoTitle}>为您的合集选择一张封面</Text>
                </View>
                <TextInput
                    style={styles.fromInput}
                    onChangeText={(val) =>
                        setFormData((prevFormData) => {
                            return { ...prevFormData, title: val };
                        })
                    }
                    value={formData.title}
                    maxLength={20}
                    numberOfLines={1}
                    placeholder="请输入合集的标题(不超过20字)"
                />
                <View style={styles.collectionDescription}>
                    <TextInput
                        style={[styles.fromInput, { height: pixel(120) }]}
                        onChangeText={(val) =>
                            setFormData((prevFormData) => {
                                return { ...prevFormData, description: String(val).trim() };
                            })
                        }
                        value={formData.description}
                        textAlignVertical="top"
                        multiline
                        numberOfLines={4}
                        maxLength={100}
                        placeholder="请输入合集的简介"
                    />
                    <Text style={styles.wordCount}>{formData.description.length}/100</Text>
                </View>
                <Text style={styles.labelTitle}>添加作品</Text>
                <PostSelector changePostIds={setPostIds} navigation={navigation} />
            </ScrollView>
        </View>
    );
}

function PostSelector({ changePostIds, navigation }) {
    const [posts, setPosts] = useState([]);
    const scrollRef = useRef();
    const updateOffset = useRef();

    const selectVideoPosts = useCallback((data) => {
        updateOffset.current = true;
        setPosts([...data]);
        changePostIds(data.map((v) => v.id));
    }, []);

    const deleteVideoPost = useCallback((index) => {
        setPosts((data) => {
            data.splice(index, 1);
            changePostIds(data.map((v) => v.id));
            return [...data];
        });
    }, []);

    const onContentSizeChange = useCallback((contentWidth, contentHeight) => {
        if (updateOffset.current) {
            updateOffset.current = false;
            scrollRef.current?.scrollToEnd({
                animated: true,
            });
        }
    }, []);

    return (
        <ScrollView
            ref={scrollRef}
            onContentSizeChange={onContentSizeChange}
            contentContainerStyle={styles.videoPostContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {posts.map((item, i) => {
                return (
                    <TouchableOpacity activeOpacity={1} style={styles.postItem} key={String(item.id || i)}>
                        <Image
                            style={{ ...StyleSheet.absoluteFillObject }}
                            resizeMode="cover"
                            source={{
                                uri: item.cover,
                            }}
                        />
                        <View style={styles.playMark}>
                            <TouchableOpacity style={styles.reduceBtn} onPress={() => deleteVideoPost(i)}>
                                <Iconfont name="guanbi1" size={pixel(12)} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                );
            })}
            <TouchableOpacity
                style={styles.postItem}
                activeOpacity={0.8}
                onPress={() => {
                    navigation.navigate('SelectPost', {
                        selectVideoPosts,
                        videoPosts: posts,
                    });
                }}>
                <Iconfont name="iconfontadd" size={pixel(30)} color={'#fff'} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    publishButton: {
        height: pixel(28),
        paddingHorizontal: pixel(12),
        justifyContent: 'center',
    },
    publishText: {
        color: Theme.watermelon,
        fontSize: font(15),
    },
    formView: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    collectionLogo: {
        paddingVertical: pixel(40),
        alignItems: 'center',
    },
    logoArea: {
        width: Device.width * 0.2,
        height: Device.width * 0.2,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
        borderRadius: pixel(5),
        overflow: 'hidden',
        backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        ...StyleSheet.absoluteFillObject,
        width: null,
        height: null,
    },
    collectionLogoTitle: {
        marginTop: pixel(12),
        fontSize: font(10),
        color: '#b2b2b2',
    },
    fromInput: {
        padding: pixel(12),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee',
        fontSize: font(15),
        color: '#212121',
    },
    collectionDescription: {
        paddingBottom: pixel(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee',
    },
    wordCount: {
        paddingHorizontal: pixel(12),
        fontSize: font(10),
        color: '#b2b2b2',
        alignSelf: 'flex-end',
    },
    inactiveBtn: {
        backgroundColor: '#fff',
        borderColor: '#9996',
        borderWidth: pixel(1),
    },
    labelTitle: {
        fontSize: font(15),
        color: '#212121',
        paddingHorizontal: pixel(12),
        marginTop: pixel(12),
    },
    videoPostContainer: {
        padding: pixel(12),
    },
    postItem: {
        width: mediaWidth,
        height: mediaWidth * 1.3,
        marginRight: pixel(12),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ddd',
        borderRadius: pixel(5),
    },
    playMark: {
        ...StyleSheet.absoluteFill,
        borderRadius: pixel(5),
    },
    reduceBtn: {
        position: 'absolute',
        right: pixel(4),
        top: pixel(4),
        width: pixel(18),
        height: pixel(18),
        borderRadius: pixel(18) / 2,
        backgroundColor: 'rgba(32,30,51,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
