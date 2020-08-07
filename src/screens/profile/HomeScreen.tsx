import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Platform } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Avatar, PageContainer, SettingItem, WriteModal, Iconfont, WheelPicker, Toast } from '@src/components';
import { Mutation, GQL, useApolloClient, useQuery } from '@src/apollo';
import { observer } from 'mobx-react';
import { userStore } from '@src/store';

export default observer((props: any) => {
    const client = useApolloClient();

    let nickname = '';
    let introduction = '';
    let { me: user } = userStore;

    const qianM = user.introduction || '这个人不是很勤快的亚子，啥也没留下…';

    const [nameModalVisible, setNameModalVisible] = useState(false),
        [qianModalVisible, setQianModalVisible] = useState(false),
        [userGender, setUserGender] = useState(user.gender || '女'),
        [userBirthday, setUserBirthday] = useState(user.birthday_msg || '2000-01-01');

    const setNameModal = () => {
        setNameModalVisible(!nameModalVisible);
    };
    const setQianModal = () => {
        setQianModalVisible(!qianModalVisible);
    };

    const saveAvatar = (imagePath: any) => {
        if (Platform.OS === 'ios') {
            return userStore.changeProfile({ avatar: imagePath });
        }
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
                userStore.changeProfile({ avatar: res });
            })
            .catch((err) => {});
    };

    const _changeAvatar = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            cropperCircleOverlay: true,
            useFrontCamera: true,
            showCropGuidelines: false,
            enableRotationGesture: true,
        })
            .then((image) => {
                saveAvatar(image.path);
            })
            .catch((error) => {
                console.warn('error', error);
            });
    };

    const parseBirthday = () => {
        if (userBirthday) {
            // 兼容时间选择器去除个位数的0开头
            const date = userBirthday.split('-');
            for (let i = date.length - 1; i > 0; i--) {
                date[i] = parseInt(date[i], 10);
            }
            return date;
        }
        return [2000, 1, 1];
    };

    const onDatePickerConfirm = (value, index) => {
        const date = value
            .join('')
            .replace(/(年)|(月)/gi, '-')
            .replace(/(日)/gi, '');
        setUserBirthday(date);

        client
            .mutate({
                mutation: GQL.updateUserBirthday,
                variables: {
                    id: user.id,
                    input: {
                        birthday: date,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.userQuery,
                            variables: { id: user.id },
                        },
                    ],
                },
            })
            .then((result) => {
                setUserBirthday(date);
                // 更新 store 里的 me
                userStore.changeProfile({ birthday_msg: date });
            })
            .catch((error) => {
                Toast.show({ content: '生日修改失败,服务器内部错误' });
            });
    };
    const showDatePicker = () => {
        const Picker = new WheelPicker({
            onPickerConfirm: onDatePickerConfirm,
        });
        Picker._showDatePicker(parseBirthday());
    };

    function setGender() {
        let Gender = '';
        if (userGender === '女') {
            Gender = '男';
        } else {
            Gender = '女';
        }
        client
            .mutate({
                mutation: GQL.updateUserGender,
                variables: { id: user.id, gender: Gender },
            })
            .then((result) => {
                const gender = Helper.syncGetter('data.updateUserInfo.gender', result);
                setUserGender(gender);
                // 更新store里的me
                userStore.changeProfile({ gender });
            })
            .catch((error) => {
                Toast.show({ content: '性别修改失败,服务器内部错误' });
                if (userGender === '女') {
                    // 用户性别是女 ，改成男
                    setUserGender('男');
                } else {
                    // 用户性别是男 ，改成女
                    setUserGender('女');
                }
            });
    }

    return (
        <PageContainer title="修改资料">
            <View style={styles.container}>
                <ScrollView style={styles.container} bounces={false} removeClippedSubviews={true}>
                    <View style={styles.settingType}>
                        <View>
                            <Text style={styles.settingTypeText}>常规设置</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={_changeAvatar}>
                        <SettingItem itemName="更改头像" rightComponent={<Avatar source={user.avatar} size={34} />} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={setNameModal}>
                        <View style={styles.settingItem}>
                            <SettingItem itemName="修改昵称" rightContent={user.name} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setGender}>
                        <View style={styles.settingItem}>
                            <SettingItem itemName="性别" rightContent={user.gender || userGender} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showDatePicker}>
                        <View style={styles.settingItem}>
                            <SettingItem itemName="生日" rightContent={userBirthday} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={setQianModal}>
                        <View style={styles.settingItem}>
                            <SettingItem itemName="签名" rightContent={qianM} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <Mutation mutation={GQL.updateUserName}>
                {(updateUserName: any) => {
                    return (
                        <WriteModal
                            modalName="修改昵称"
                            placeholder={user.name}
                            visible={nameModalVisible}
                            value={nickname}
                            handleVisible={setNameModal}
                            changeVaule={(val: any) => {
                                nickname = val;
                            }}
                            submit={() => {
                                if (nickname.length < 1) {
                                    setNameModal();
                                    return;
                                }
                                setNameModal();
                                updateUserName({
                                    variables: {
                                        input: {
                                            name: nickname,
                                        },
                                        id: user.id,
                                    },
                                });
                                userStore.changeProfile({ name: nickname });
                            }}
                        />
                    );
                }}
            </Mutation>
            <Mutation mutation={GQL.updateUserIntroduction}>
                {(updateUserIntroduction: any) => {
                    return (
                        <WriteModal
                            modalName="修改签名"
                            placeholder={qianM}
                            visible={qianModalVisible}
                            value={introduction}
                            handleVisible={setQianModal}
                            changeVaule={(val: any) => {
                                introduction = val;
                            }}
                            submit={() => {
                                if (introduction.length < 1) {
                                    setQianModal();
                                    return;
                                }
                                setQianModal();
                                updateUserIntroduction({
                                    variables: {
                                        input: {
                                            introduction,
                                        },
                                        id: user.id,
                                    },
                                });
                                userStore.changeProfile({ introduction });
                            }}
                        />
                    );
                }}
            </Mutation>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.skinColor || '#FFF',
        flex: 1,
    },
    settingItem: {
        flex: 1,
    },
    settingType: {
        backgroundColor: Theme.lightGray,
        borderBottomWidth: 10,
        borderColor: '#FAFAFA',
        justifyContent: 'flex-end',
        paddingBottom: 8,
        paddingLeft: 15,
        paddingTop: 16,
    },
    settingTypeText: {
        color: Theme.themeColor,
        fontSize: font(13),
    },
    // settingItemContent: {
    //     fontSize: font(17),
    //     color: Theme.tintFontColor,
    // },
});
