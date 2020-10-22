import React from 'react';
import { Text, View, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { PageContainer, Avatar } from '@src/components';
import ImagePicker from 'react-native-image-crop-picker';
import { ActionSheet } from 'teaset';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userStore, observer } from '@src/store';
import { GQL, useApolloClient, useQuery } from '@src/apollo';

const ReplaceImage = (props) => {
    const client = useApolloClient();
    const navigation = useNavigation();
    let { me: user } = userStore;
    const { data: walletData } = useQuery(GQL.userQuery, {
        variables: { id: user.id },
        fetchPolicy: 'network-only',
    });
    const userData = Helper.syncGetter('user', walletData) || {};
    user = Object.assign({}, user, { ...userData });
    const saveAvatarImage = (imagePath: any) => {
        const { token } = userStore.me;
        const data = new FormData();
        data.append('avatar', {
            uri: imagePath,
            name: 'avatar.jpg',
            type: 'image/jpg',
        });
        const config = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data,
        };
        fetch(Config.ServerRoot + '/api/user/save-avatar?api_token=' + token, config)
            .then((response) => response.text())
            .then((res) => {
                console.log('avatar：', res);
                userStore.changeAvatar(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // 相册选择
    const clickOpenPicker = () => {
        ImagePicker.openPicker({
            width: pixel(100),
            height: pixel(100),
            cropping: true,
            cropperCircleOverlay: true,
            useFrontCamera: true,
            showCropGuidelines: false,
            enableRotationGesture: true,
        })
            .then((image) => {
                saveAvatarImage(image.path);
                console.log(image.path, '用户选择的头像');
            })
            .catch((error) => {});
    };
    // 相机拍照
    function clickOpenCamera() {
        ImagePicker.openCamera({
            width: pixel(300),
            height: pixel(400),
            cropping: true,
        }).then((image) => {
            navigation.goBack();
            console.log(image, '相机拍照的头像');
        });
    }
    // 图片的换取选项
    function selectOptions() {
        const options = [
            {
                title: '相机',
                onPress: () => {
                    clickOpenCamera();
                },
            },
            {
                title: '从手机相册选择',
                onPress: () => {
                    clickOpenPicker();
                },
            },
        ];
        const cancelItem = { title: <Text style={styles.text}>取消</Text> };
        ActionSheet.show(options, cancelItem);
    }
    return (
        <PageContainer title="更改头像" white>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={selectOptions}>
                    <View>
                        <Avatar source={user} style={styles.avatarImage} size={34} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </PageContainer>
    );
};
const styles = StyleSheet.create({
    avatarImage: {
        height: pixel(350),
        width: pixel(350),
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        alignSelf: 'center',
        color: 'rgba(23, 171, 255, 1)',
        fontSize: font(18),
    },
});
export default ReplaceImage;
