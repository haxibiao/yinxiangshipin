import React, { useState, useMemo, useCallback, useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, ScrollView, Text, Keyboard, StatusBar, TouchableOpacity } from 'react-native';
import { PageContainer, HxfTextInput, Iconfont } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { observer, userStore, appStore } from '@src/store';
import { useMutation, useQuery, GQL, errorMessage } from '@src/apollo';
import { Overlay } from 'teaset';
import Video from 'react-native-video';

const contentGap = pixel(20);
const MediaItemWidth = (Device.WIDTH - pixel(60)) / 3;

export default (props: any) => {
    const route = useRoute();
    const navigation = useNavigation();
    const post = useMemo(() => route.params?.post, [route]);
    const postTags = useMemo(() => {
        const postTagsData = post?.tags?.data;
        if (postTagsData?.length > 0) {
            return postTagsData;
        }
        return [];
    }, [post]);

    const [tags, setTags] = useState(postTags);

    const [formData, setFormData] = useState({
        id: post?.id,
        content: post?.content,
        description: post?.description,
    });

    const isDisableButton = useMemo(() => {
        if (postTags !== tags) {
            return false;
        }
        for (const key of Object.keys(formData)) {
            if (formData[key] !== post[key]) {
                return false;
            }
        }
        return true;
    }, [post, tags, formData]);

    const [createPost, { data, loading }] = useMutation(GQL.updatePostMutation, {
        variables: {
            ...formData,
            tag_names: tags.map((c) => c.name),
        },
        refetchQueries: () => [
            {
                query: GQL.userQuery,
                variables: { id: userStore.me.id },
                fetchPolicy: 'network-only',
            },
        ],
        onError: (error: any) => {
            Toast.show({
                content: errorMessage(error) || '保存失败',
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
        if (Array.isArray(tags)) {
            return tags.map((tag, index) => {
                return (
                    <View key={tag?.id || tag?.name} style={styles.tagItem}>
                        <Iconfont name="biaoqian" size={font(15)} color="#fff" style={{ marginRight: pixel(4) }} />
                        <View style={{ maxWidth: pixel(100) }}>
                            <Text style={styles.tagName} numberOfLines={1}>
                                {tag?.name}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.deleteTag} onPress={() => deleteTag(index)}>
                            <Iconfont name="guanbi1" size={pixel(13)} color="#fff" />
                        </TouchableOpacity>
                    </View>
                );
            });
        }
        return null;
    }, [tags]);

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
                                <Text style={styles.countText}>{`${formData?.description?.length}/40`}</Text>
                            </View>
                            <HxfTextInput
                                style={styles.descriptionTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeDescription}
                                value={formData?.description}
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
                                <Text style={styles.countText}>{`${formData?.content?.length}/200`}</Text>
                            </View>
                            <HxfTextInput
                                style={styles.contentTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeContent}
                                value={formData?.content}
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
                        <TouchableOpacity
                            style={styles.operation}
                            activeOpacity={0.9}
                            disabled={tags.length >= 5}
                            onPress={() => navigation.navigate('TagList', { selectTag })}>
                            {tags.length < 1 ? (
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
                                    {renderTagNames}
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
    contentContainerStyle: { flexGrow: 1, paddingBottom: Theme.bottomInset },
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
