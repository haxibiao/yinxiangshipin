import React, { useState, useMemo, useCallback, useContext, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    Text,
    Keyboard,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { PageContainer, HxfTextInput, Iconfont, MediaUploader } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { observer, userStore, appStore } from '@src/store';
import { GQL, useMutation } from '@src/apollo';
import { useApolloClient, ApolloProvider } from '@apollo/react-hooks';
import { observable } from 'mobx';
import { Overlay } from 'teaset';
import Video from 'react-native-video';

const contentGap = pixel(20);
const MediaItemWidth = (Device.WIDTH - pixel(60)) / 3;

export default (props: any) => {
    const route = useRoute();
    const category = useMemo(() => route.params?.category, [props]);
    const navigation = useNavigation();
    const client = useApolloClient();
    const [categories, setCategories] = useState(() => (category ? [category] : []));
    const [formData, setFormData] = useState({ body: '', qcvod_fileid: '', images: [], category_ids: [] });

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
            category_ids: categories.map((c) => c.id),
            type: 'POST',
        },
        onError: (error: any) => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '发布失败',
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

    const selectCategory = useCallback(
        (category) => {
            if (categories.length > 3) {
                Toast.show({ content: '最多关联3个专题哦' });
            }
            if (
                __.find(categories, function (item) {
                    return item.id === category.id;
                })
            ) {
                Toast.show({ content: '该专题已经添加过了' });
            } else {
                categories.unshift(category);
                setCategories([...categories]);
            }
        },
        [categories],
    );

    const addedCategories = useMemo(() => {
        if (Array.isArray(categories)) {
            return categories.slice(0, 3).map((category, index) => {
                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        key={category.id}
                        style={styles.categoryItem}
                        onPress={() => navigation.navigate('Category', { category })}>
                        <View style={{ maxWidth: pixel(100) }}>
                            <Text style={styles.categoryName} numberOfLines={1}>
                                #{category.name}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteCategory}
                            onPress={() => {
                                categories.splice(index, 1);
                                setCategories([...categories]);
                            }}>
                            <Iconfont name="guanbi1" size={pixel(13)} color="#4CA7F0" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                );
            });
        }
        return null;
    }, [categories]);

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

    return (
        <PageContainer
            submitting={loading}
            leftView={
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Iconfont name="guanbi1" size={pixel(22)} color={Theme.primaryAuxiliaryColor} />
                </TouchableOpacity>
            }
            rightView={
                <TouchableOpacity
                    disabled={isDisableButton}
                    style={[styles.publishButton, isDisableButton && styles.disabledButton]}
                    onPress={createPost}>
                    <Text style={[styles.publishText, isDisableButton && styles.disabledPublishText]}>发布动态</Text>
                </TouchableOpacity>
            }>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.contentContainerStyle}
                    showsVerticalScrollIndicator={false}
                    bounces={false}>
                    <View style={styles.creatorContainer}>
                        {/* 动态内容 */}
                        <View style={styles.bodyTextInputArea}>
                            <HxfTextInput
                                style={styles.bodyTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeBody}
                                multiline={true}
                                maxLength={100}
                                textAlignVertical="top"
                                placeholder="记录你此刻的生活，分享给有趣的人看..."
                            />
                            <View style={styles.textInputLimit}>
                                <Text style={styles.countInputText}>{`${formData.body.length}/100`}</Text>
                            </View>
                        </View>
                        {/* 添加视频/图片 */}
                        <View style={styles.mediaContainer}>
                            <MediaUploader
                                onResponse={uploadResponse}
                                maxWidth={Device.WIDTH / 2}
                                style={styles.mediaItem}
                            />
                        </View>
                        {/* 添加专题 */}
                        <TouchableOpacity
                            style={styles.operation}
                            onPress={() => navigation.navigate('SelectCategory', { selectCategory, categories })}
                            activeOpacity={0.9}>
                            {categories.length < 1 ? (
                                <View style={styles.operationBtn}>
                                    <Text style={styles.operationName}>添加话题</Text>
                                </View>
                            ) : (
                                <ScrollView style={styles.categoriesContainer} horizontal={true}>
                                    {addedCategories}
                                </ScrollView>
                            )}
                            <Iconfont name="right" size={pixel(15)} color={Theme.secondaryTextColor} />
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
        borderRadius: pixel(15),
        height: pixel(30),
        justifyContent: 'center',
        paddingHorizontal: pixel(10),
    },
    disabledButton: {
        backgroundColor: '#f0f0f0',
    },
    publishText: {
        color: '#fff',
        fontSize: font(14),
        textAlign: 'center',
    },
    disabledPublishText: {
        color: Theme.subTextColor,
    },
    creatorContainer: {
        backgroundColor: '#fff',
        borderRadius: pixel(3),
        paddingVertical: pixel(20),
    },
    bodyTextInput: {
        height: pixel(120),
    },
    bodyTextInputArea: {},
    countInputText: {
        color: Theme.slateGray1,
        fontSize: font(13),
    },
    textInputLimit: {
        alignItems: 'flex-end',
    },
    mediaContainer: {
        marginRight: -pixel(10),
        marginBottom: pixel(5),
    },
    mediaItem: { width: MediaItemWidth, height: MediaItemWidth, marginTop: pixel(10), marginRight: pixel(10) },
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
    categoriesContainer: {
        flex: 1,
        marginTop: pixel(12),
        marginRight: pixel(12),
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pixel(32),
        paddingHorizontal: pixel(6),
        borderRadius: pixel(3),
        marginRight: pixel(10),
        marginBottom: pixel(12),
        backgroundColor: '#E7F5FE',
    },
    categoryName: {
        color: '#4CA7F0',
        fontSize: font(12),
    },
    deleteCategory: {
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
