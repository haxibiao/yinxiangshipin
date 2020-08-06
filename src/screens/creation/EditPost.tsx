import React, { useState, useMemo, useCallback, useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, ScrollView, Text, Keyboard, StatusBar, TouchableOpacity } from 'react-native';
import { PageContainer, HxfTextInput, Iconfont } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { observer, userStore, appStore } from '@src/store';
import { useMutation, useQuery, GQL } from '@src/apollo';
import { Overlay } from 'teaset';
import Video from 'react-native-video';
import AddTags from './AddTags';

const contentGap = pixel(20);
const MediaItemWidth = (Device.WIDTH - pixel(60)) / 3;

export default (props: any) => {
    const route = useRoute();
    const navigation = useNavigation();
    const post = useMemo(() => route.params?.post, [route]);
    const postTags = useMemo(() => {
        const postTagsData = post?.tags?.data;
        if (postTagsData?.length > 0) {
            return postTagsData.map((tag) => {
                return tag?.name;
            });
        }
        return [];
    }, [post]);

    const [tagsName, setTagsName] = useState([...postTags]);

    const [formData, setFormData] = useState({
        id: post.id,
        content: post.content,
        description: post.description,
    });

    const isDisableButton = useMemo(() => {
        if (postTags.join('') !== tagsName.join('')) {
            return false;
        }
        for (const key of Object.keys(formData)) {
            if (formData[key] !== post[key]) {
                return false;
            }
        }
        return true;
    }, [post, formData, tagsName]);

    const { data: userTagsData } = useQuery(GQL.userTags, {
        variables: { id: userStore.me.id },
    });
    const tagsData = useMemo(() => userTagsData?.user?.tags?.data, [userTagsData]);

    const [createPost, { data, loading }] = useMutation(GQL.updatePostMutation, {
        variables: {
            ...formData,
            tag_names: tagsName,
        },
        refetchQueries: () => [
            {
                query: GQL.userProfileQuery,
                variables: { id: userStore.me.id },
                fetchPolicy: 'network-only',
            },
        ],
        onError: (error: any) => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '保存失败',
            });
        },
        onCompleted: (mutationResult: any) => {
            const result = mutationResult?.updatePost;
            Toast.show({
                content: '保存成功',
            });
            navigation.replace('PostDetail', {
                post: Object.assign({}, post, {
                    content: result?.content,
                    description: result?.description,
                    tags: result?.tags,
                }),
            });
        },
    });

    const changeContent = useCallback((content) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, content };
        });
    }, []);

    const changeDescription = useCallback((description) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, description };
        });
    }, []);

    const selectTagName = useCallback((selectedTagName) => {
        setTagsName((tagsName) => {
            if (tagsName.length > 3) {
                Toast.show({ content: '最多关联3个标签哦' });
            } else if (tagsName.indexOf(selectedTagName) !== -1) {
                Toast.show({ content: '该标签已经添加过了' });
            } else {
                return [selectedTagName, ...tagsName];
            }
            return tagsName;
        });
    }, []);

    const deleteTagName = useCallback((index) => {
        setTagsName((tagsName) => {
            tagsName.splice(index, 1);
            return [...tagsName];
        });
    }, []);

    const overlayKey = useRef();

    const closeAddTagModal = useCallback(() => {
        Overlay.hide(overlayKey.current);
    }, []);

    const showShopWindow = useCallback(() => {
        const Operation = (
            <Overlay.PopView style={{ alignItems: 'center', justifyContent: 'center' }}>
                <AddTags selectTag={selectTagName} tagsData={tagsData} onClose={closeAddTagModal} />
            </Overlay.PopView>
        );
        overlayKey.current = Overlay.show(Operation);
    }, [tagsData]);

    const postTagsName = useMemo(() => {
        if (Array.isArray(tagsName)) {
            return tagsName.slice(0, 3).map((tagName, index) => {
                return (
                    <View key={tagName} style={styles.tagItem}>
                        <Iconfont name="biaoqian" size={font(15)} color="#fff" style={{ marginRight: pixel(4) }} />
                        <View style={{ maxWidth: pixel(100) }}>
                            <Text style={styles.tagName} numberOfLines={1}>
                                {tagName}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.deleteTag} onPress={() => deleteTagName(index)}>
                            <Iconfont name="guanbi1" size={pixel(13)} color="#fff" />
                        </TouchableOpacity>
                    </View>
                );
            });
        }
        return null;
    }, [tagsName]);

    return (
        <PageContainer
            submitting={loading}
            title="编辑"
            rightView={
                <TouchableOpacity
                    disabled={isDisableButton}
                    style={[styles.publishButton, isDisableButton && styles.disabledButton]}
                    onPress={createPost}>
                    <Text style={styles.publishText}>保 存</Text>
                </TouchableOpacity>
            }>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.contentContainerStyle}
                    showsVerticalScrollIndicator={false}
                    bounces={false}>
                    <View style={styles.creatorContainer}>
                        <View style={styles.textInputArea}>
                            <View style={styles.labelItem}>
                                <View style={styles.label}>
                                    <Text style={styles.labelName}>标题</Text>
                                </View>
                                <Text style={styles.countText}>{`${formData.description.length}/40`}</Text>
                            </View>
                            <HxfTextInput
                                style={styles.descriptionTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeDescription}
                                value={formData.description}
                                multiline={true}
                                maxLength={40}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.textInputArea}>
                            <View style={styles.labelItem}>
                                <View style={styles.label}>
                                    <Text style={styles.labelName}>内容</Text>
                                </View>
                                <Text style={styles.countText}>{`${formData.content.length}/200`}</Text>
                            </View>
                            <HxfTextInput
                                style={styles.contentTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeContent}
                                value={formData.content}
                                multiline={true}
                                maxLength={200}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.postCover}>
                            <Image style={styles.videoCover} source={{ uri: post?.video?.cover }} />
                            <View style={styles.videoMark}>
                                <Iconfont name="bofang1" size={font(20)} color={'#fff'} style={{ opacity: 0.8 }} />
                            </View>
                        </View>
                        {/* 添加专题 */}
                        <TouchableOpacity style={styles.operation} onPress={showShopWindow} activeOpacity={0.9}>
                            {tagsName.length < 1 ? (
                                <View style={styles.operationBtn}>
                                    <Iconfont
                                        name="biaoqian"
                                        size={pixel(15)}
                                        color="#2b2b2b"
                                        style={{ marginRight: pixel(2) }}
                                    />
                                    <Text style={styles.operationName}>添加标签</Text>
                                </View>
                            ) : (
                                <ScrollView style={styles.tagsContainer} horizontal={true}>
                                    {postTagsName}
                                </ScrollView>
                            )}
                            <Iconfont name="right" size={pixel(15)} color="#b2b2b2" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: contentGap,
    },
    contentContainerStyle: { flexGrow: 1, paddingBottom: Theme.HOME_INDICATOR_HEIGHT },
    publishButton: {
        backgroundColor: Theme.watermelon,
        borderRadius: pixel(5),
        height: pixel(30),
        justifyContent: 'center',
        paddingHorizontal: pixel(12),
    },
    disabledButton: {
        backgroundColor: '#f0f0f0',
    },
    publishText: {
        color: '#fff',
        fontSize: font(14),
        textAlign: 'center',
    },
    creatorContainer: {
        backgroundColor: '#fff',
        paddingVertical: pixel(20),
    },
    textInputArea: {
        marginBottom: pixel(20),
    },
    labelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: pixel(10),
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(18),
        marginBottom: pixel(5),
        borderLeftWidth: pixel(4),
        borderLeftColor: 'rgba(5, 132, 255, 1)',
        paddingLeft: pixel(4),
    },
    labelName: {
        fontSize: font(15),
        color: '#2b2b2b',
    },
    countText: {
        fontSize: font(12),
        color: '#b2b2b2',
    },
    descriptionTextInput: {
        height: font(60),
        paddingTop: pixel(10),
        padding: pixel(10),
        fontSize: font(15),
        lineHeight: font(20),
        borderRadius: pixel(4),
        backgroundColor: '#f0f0f0',
    },
    contentTextInput: {
        height: font(120),
        paddingTop: pixel(10),
        padding: pixel(10),
        lineHeight: pixel(20),
        borderRadius: pixel(4),
        backgroundColor: '#f0f0f0',
    },
    postCover: {
        width: MediaItemWidth,
        height: MediaItemWidth,
        marginBottom: pixel(20),
        backgroundColor: '#f0f0f0',
    },
    videoCover: {
        width: null,
        height: null,
        ...StyleSheet.absoluteFillObject,
    },
    videoMark: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    operation: {
        paddingRight: pixel(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: pixel(1),
        borderColor: '#f0f0f0',
    },
    operationBtn: {
        paddingVertical: pixel(12),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    operationName: {
        color: '#2b2b2b',
        fontSize: font(15),
    },
    tagsContainer: {
        flex: 1,
        marginTop: pixel(12),
        marginRight: pixel(12),
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pixel(32),
        paddingHorizontal: pixel(6),
        borderRadius: pixel(3),
        marginRight: pixel(10),
        marginBottom: pixel(12),
        backgroundColor: '#0584FF',
    },
    tagName: {
        color: '#fff',
        fontSize: font(12),
    },
    deleteTag: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: pixel(6),
        marginRight: -pixel(6),
    },
    productItem: {
        flexDirection: 'row',
        paddingVertical: pixel(12),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    productCover: {
        width: pixel(90),
        height: pixel(90),
        borderRadius: pixel(2),
    },
    productDetail: {
        flex: 1,
        marginLeft: pixel(12),
        justifyContent: 'space-between',
    },
    goodsIntro: {
        marginBottom: pixel(4),
    },
    introduction: {
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
    },
    goodsPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    price: {
        fontSize: font(16),
        color: '#FD567E',
    },
    addBtn: {
        width: pixel(80),
        height: pixel(30),
        borderRadius: pixel(4),
        backgroundColor: '#FE2C54',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: font(15),
        color: '#fff',
        fontWeight: 'bold',
    },
});
