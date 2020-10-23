import React, { useState, useMemo, useCallback, useContext, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, ScrollView, Text, Keyboard, StatusBar, TouchableOpacity } from 'react-native';
import { PageContainer, HxfTextInput, Iconfont, MediaUploader, SafeText, OverlayViewer } from '@src/components';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useRoute, useNavigation } from '@react-navigation/native';
import { observer, userStore, appStore } from '@src/store';
import { useMutation, useQuery, GQL, errorMessage } from '@src/apollo';
import { Overlay } from 'teaset';
import Video from 'react-native-video';

const contentGap = pixel(20);
const MediaItemWidth = (Device.WIDTH - pixel(60)) / 3;
const maxMediaWidth = Device.WIDTH - Theme.itemSpace * 4;
const mediaWidth = maxMediaWidth / 3;

const EditCollection = (props: any) => {
    const route = useRoute();
    const navigation = useNavigation();
    const collection = useMemo(() => route.params?.collection, [route]);

    const [formData, setFormData] = useState({
        name: collection?.name,
        logo: collection?.logo,
        description: collection?.description,
    });

    const isOriginLogo = collection?.logo === formData.logo;

    const isDisableButton = useMemo(() => {
        for (const key of Object.keys(formData)) {
            if (formData[key] !== collection[key]) {
                return false;
            }
        }
        return true;
    }, [collection, formData]);

    const [editCollection, { data, loading }] = useMutation(GQL.editCollectionMutation, {
        variables: {
            ...formData,
            logo: formData.logo === '' ? collection?.logo : formData.logo,
            collection_id: collection?.id,
            type: 'POST',
        },
        refetchQueries: () => [
            {
                query: GQL.collectionsQuery,
                variables: { user_id: userStore.me.id },
                fetchPolicy: 'network-only',
            },
        ],
        onError: (error: any) => {
            Toast.show({
                content: errorMessage(error) || '保存失败',
            });
        },
        onCompleted: (mutationResult: any) => {
            const result = mutationResult?.editCollection;
            Toast.show({
                content: '保存成功',
            });
            navigation.navigate('CollectionDetail', {
                collection: Object.assign({}, collection, {
                    name: result?.name,
                    description: result?.description,
                    logo: result?.logo,
                }),
            });
        },
    });

    const changeTitle = useCallback((name) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, name };
        });
    }, []);

    const changeDescription = useCallback((description) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, description };
        });
    }, []);

    const uploadResponse = useCallback((response) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, logo: response[0] ? response[0] : '' };
        });
    }, []);
    const removeLogo = useCallback(() => {
        setFormData((prevFormData) => {
            return { ...prevFormData, logo: '' };
        });
    });

    const showImage = useCallback((url) => {
        const overlayView = (
            <ImageViewer
                onSwipeDown={() => OverlayViewer.hide()}
                imageUrls={[{ url }]}
                index={0}
                enableSwipeDown={true}
            />
        );
        OverlayViewer.show(overlayView);
    }, []);

    return (
        <PageContainer
            submitting={loading}
            title="编辑"
            titleStyle={{ fontSize: font(16) }}
            rightView={
                <TouchableOpacity
                    disabled={isDisableButton}
                    style={[styles.publishButton, isDisableButton && styles.disabledButton]}
                    onPress={editCollection}>
                    <SafeText style={styles.publishText}>保 存</SafeText>
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
                                    <View style={styles.dotStyle} />
                                    <Text style={styles.labelName}>标题</Text>
                                </View>
                                <Text style={styles.countText}>{`${formData?.name?.length}/10`}</Text>
                            </View>
                            <HxfTextInput
                                style={styles.titleTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeTitle}
                                value={formData?.name}
                                multiline={true}
                                maxLength={10}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.textInputArea}>
                            <View style={styles.labelItem}>
                                <View style={styles.label}>
                                    <View style={styles.dotStyle} />
                                    <Text style={styles.labelName}>简介</Text>
                                </View>
                                <Text style={styles.countText}>{`${formData?.description?.length}/100`}</Text>
                            </View>
                            <HxfTextInput
                                style={styles.descriptionTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeDescription}
                                value={formData?.description}
                                multiline={true}
                                maxLength={100}
                                textAlignVertical="top"
                            />
                        </View>
                        <View style={styles.postCover}>
                            {isOriginLogo ? (
                                <TouchableOpacity onPress={() => showImage(collection?.logo)} style={styles.uploadView}>
                                    <Image style={styles.videoCover} source={{ uri: collection?.logo }} />
                                    <TouchableOpacity style={styles.close} onPress={removeLogo}>
                                        <Iconfont name="guanbi1" size={pixel(12)} color="#fff" />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ) : (
                                <MediaUploader
                                    type="image"
                                    maximum={1}
                                    onResponse={uploadResponse}
                                    maxWidth={Device.WIDTH / 2}
                                    style={styles.mediaItem}
                                />
                            )}
                        </View>
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
        paddingHorizontal: Theme.itemSpace,
    },
    contentContainerStyle: { flexGrow: 1, paddingBottom: Theme.HOME_INDICATOR_HEIGHT },
    publishButton: {
        backgroundColor: Theme.watermelon,
        borderRadius: pixel(5),
        height: pixel(28),
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
        // borderLeftWidth: pixel(4),
        // borderLeftColor: 'rgba(5, 132, 255, 1)',
        paddingLeft: pixel(4),
    },
    dotStyle: {
        width: pixel(5),
        height: pixel(5),
        borderRadius: percent(50),
        backgroundColor: 'rgba(5, 132, 255, 1)',
        marginRight: pixel(4),
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
        height: font(120),
        paddingTop: pixel(10),
        padding: pixel(10),
        fontSize: font(15),
        lineHeight: font(20),
        borderRadius: pixel(4),
        backgroundColor: '#f0f0f0',
    },
    titleTextInput: {
        height: font(60),
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
    uploadView: {
        alignItems: 'center',
        backgroundColor: Theme.slateGray2,
        borderRadius: pixel(5),
        height: mediaWidth,
        justifyContent: 'center',
        marginRight: Theme.itemSpace,
        overflow: 'hidden',
        width: mediaWidth,
    },
    videoCover: {
        width: null,
        height: null,
        ...StyleSheet.absoluteFillObject,
        borderRadius: pixel(3),
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
    mediaItem: {
        width: mediaWidth,
        height: mediaWidth,
        // backgroundColor: Theme.slateGray2,
        backgroundColor: '#f0f0f0',
        borderRadius: pixel(3),
    },
});

export default EditCollection;
