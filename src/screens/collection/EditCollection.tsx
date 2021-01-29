import React, { useCallback, useState, useMemo, useRef } from 'react';
import { StyleSheet, ScrollView, Text, View, Image, TextInput, Pressable } from 'react-native';
import { NavBarHeader, MediaUploader, Iconfont, SafeText } from '@src/components';
import { appStore, userStore, notificationStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GQL, useMutation, errorMessage } from '@src/apollo';
import { openImagePicker } from '@src/common';
import { AutonomousModal } from '@src/components/modal';
import PostManage from './components/PostManage';

const mediaWidth = Device.width * 0.28;

export default function EditCollection(props) {
    const route = useRoute();
    const collection = useMemo(() => route.params?.collection, [route.params]);
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        logo: collection?.logo,
        name: collection?.name,
        description: collection?.description,
    });
    const [deleteEnable, setDeleteEnable] = useState(false);
    const [addEnable, setAddEnable] = useState(false);

    const [editCollectionHandler] = useMutation(GQL.editCollectionMutation, {
        variables: {
            collection_id: collection?.id,
            logo: formData.logo,
            name: formData.name,
            description: formData.description,
            type: 'POST',
        },
        onCompleted: () => {
            notificationStore.toggleLoadingVisible();
            navigation.goBack();
        },
        onError: (error) => {
            notificationStore.toggleLoadingVisible();
            Toast.show({
                content: errorMessage(error, '编辑失败'),
            });
        },
        refetchQueries: () => [
            {
                query: GQL.collectionPostsQuery,
                variables: {
                    collection_id: collection.id,
                    count: 10,
                },
            },
        ],
    });

    const pickCollectionLogo = useCallback(() => {
        openImagePicker({ mediaType: 'photo', includeBase64: true })
            .then((image) => {
                const imagePath = `data:${image.mime};base64,${image.data}`;
                setFormData((prevFormData) => {
                    return { ...prevFormData, logo: imagePath };
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
            editCollectionHandler();
        }
        function validator() {
            const tips = {
                logo: '给合集取个名字哦',
                description: '简单介绍一下合集吧',
                name: '请上传一张图片作为合集的封面',
            };
            for (const k of Object.keys(tips)) {
                if (!formData[k]) {
                    Toast.show({
                        content: tips[k],
                    });
                    return false;
                }
            }
            return true;
        }
    };
    const disabled =
        formData.logo &&
        formData.name &&
        formData.description &&
        (collection.logo !== formData.logo ||
            collection.name !== formData.name ||
            collection.description !== formData.description);

    return (
        <View style={styles.container}>
            <NavBarHeader
                title={'编辑合集'}
                rightComponent={
                    <Pressable style={styles.publishButton} disabled={!disabled} onPress={onSubmit}>
                        <Text style={[styles.publishText, !disabled && { color: '#b2b2b2' }]}>完成</Text>
                    </Pressable>
                }
            />
            <ScrollView contentContainerStyle={styles.formView} showsVerticalScrollIndicator={false}>
                <View style={styles.collectionLogo}>
                    <Pressable style={styles.logoArea} onPress={pickCollectionLogo}>
                        {formData.logo ? (
                            <Image source={{ uri: formData.logo }} style={styles.logoImage} />
                        ) : (
                            <Iconfont name="xiangji" size={pixel(20)} color="#fff" />
                        )}
                    </Pressable>
                    <Text style={styles.collectionTitle}>为您的合集选择一张封面</Text>
                </View>
                <TextInput
                    style={styles.fromInput}
                    onChangeText={(val) =>
                        setFormData((prevFormData) => {
                            return { ...prevFormData, name: val };
                        })
                    }
                    value={formData.name}
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
                        maxLength={200}
                        placeholder="请输入合集的简介"
                    />
                    <Text style={styles.wordCount}>{formData.description.length}/200</Text>
                </View>
            </ScrollView>
            <View style={styles.footerOperation}>
                <Pressable
                    style={[styles.operationButton, { backgroundColor: Theme.secondaryColor }]}
                    onPress={() => setDeleteEnable(true)}>
                    <Text style={styles.operationButtonText}>删除章节</Text>
                </Pressable>
                <View style={{ width: pixel(Theme.edgeDistance), height: 1 }}></View>
                <Pressable style={styles.operationButton} onPress={() => setAddEnable(true)}>
                    <Text style={styles.operationButtonText}>添加章节</Text>
                </Pressable>
            </View>
            <AutonomousModal visible={deleteEnable} onToggleVisible={setDeleteEnable} style={styles.modalContainer}>
                {(visible, changeVisible) => {
                    return (
                        <PostManage
                            collection={collection}
                            operation={'delete'}
                            onClose={() => setDeleteEnable(false)}
                        />
                    );
                }}
            </AutonomousModal>
            <AutonomousModal visible={addEnable} onToggleVisible={setAddEnable} style={styles.modalContainer}>
                {(visible, changeVisible) => {
                    return <PostManage collection={collection} operation={'add'} onClose={() => setAddEnable(false)} />;
                }}
            </AutonomousModal>
        </View>
    );
}

function PostSelector({ changePostIds, navigation }) {
    return (
        <QueryList
            gqlDocument={GQL.postsQuery}
            dataOptionChain="posts.data"
            paginateOptionChain="posts.paginatorInfo"
            options={{
                variables: {
                    user_id: userStore.me.id,
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.content}
        />
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
        paddingBottom: Device.bottomInset,
    },
    footerOperation: {
        position: 'absolute',
        flexDirection: 'row',
        height: pixel(44),
        left: pixel(Theme.edgeDistance),
        right: pixel(Theme.edgeDistance),
        bottom: Device.bottomInset + pixel(20),
    },
    operationButton: {
        flex: 1,
        alignSelf: 'stretch',
        borderRadius: pixel(4),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FE2C54',
    },
    operationButtonText: {
        fontSize: font(16),
        fontWeight: 'bold',
        color: '#ffffff',
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
    collectionTitle: {
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
    modalContainer: {
        justifyContent: 'flex-end',
    },
});
