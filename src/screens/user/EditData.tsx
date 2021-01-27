import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Platform, TextInput, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Avatar, PageContainer, SettingItem, WriteModal, Iconfont, WheelPicker, HxfModal } from '@src/components';
import { Mutation, GQL, useApolloClient, useQuery, useMutation } from '@src/apollo';
import { observer } from 'mobx-react';
import { userStore } from '@src/store';
import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation } from '@react-navigation/native';
import { AutonomousModal } from '@src/components/modal';

export default observer((props: any) => {
    const client = useApolloClient();
    const [nickname, setName] = useState('');
    const [introduction, setIntroduction] = useState('');
    const { me: user } = userStore;
    const qianM = user.introduction || '这个人不是很勤快的亚子，啥也没留下…';
    const [nameModalVisible, setNameModalVisible] = useState(false),
        [qianModalVisible, setQianModalVisible] = useState(false),
        [userGender, setUserGender] = useState(user.gender || '女'),
        [userBirthday, setUserBirthday] = useState(user.birthday_msg || '2000-01-01'),
        [signatureHeight, setSignatureHeight] = useState(18),
        [sexModalVisible, setSexModalVisible] = useState(false);

    // 设置头像审核提示,前端假提示改变状态
    const [iconStatus, setIconStatus] = useState(true);

    const setNameModal = () => {
        setNameModalVisible(!nameModalVisible);
    };
    const setQianModal = () => {
        setQianModalVisible(!qianModalVisible);
    };
    const setSexModal = () => {
        setSexModalVisible(!sexModalVisible);
    };

    const saveAvatar = (image: any) => {
        const { token } = userStore.me;
        const data = new FormData();
        data.append('avatar', image);
        const config = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data,
        };

        fetch(Config.ServerRoot + '/api/user/save-avatar?api_token=' + token, config)
            .then(response => response.text())
            .then(res => {
                userStore.changeAvatar(res);
            })
            .catch(err => {});
    };

    const _changeAvatar = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            includeBase64: true,
            compressImageQuality: 0.1,
        })
            .then(image => {
                if (image.size > 12000) {
                    Toast.show({ content: '头像上传失败，图片质量过大' });
                } else {
                    saveAvatar(`data:${image.mime};base64,${image.data}`);
                    setIconStatus(!iconStatus);
                    setTimeout(() => {
                        setIconStatus(!iconStatus);
                    }, 60000);
                }
            })
            .catch(error => {});
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
            .then(result => {
                setUserBirthday(date);
                // 更新 store 里的 me
                userStore.changeProfile({ birthday_msg: date });
            })
            .catch(error => {
                Toast.show({ content: '生日修改失败,服务器内部错误' });
            });
    };
    const showDatePicker = () => {
        const Picker = new WheelPicker({
            onPickerConfirm: onDatePickerConfirm,
        });
        Picker._showDatePicker(parseBirthday());
    };

    // 修改性别

    function setGender(selectGender) {
        let Gender = selectGender;
        // if (userGender === user.gender) {
        //     Gender = user.gender;
        // } else if (userGender !== user.gender && userGender == '女') {
        //     Gender = '女';
        // } else {
        //     Gender = '男';
        // }
        client
            .mutate({
                mutation: GQL.updateUserGender,
                variables: { id: user.id, gender: Gender },
            })
            .then(result => {
                const gender = Helper.syncGetter('data.updateUserInfo.gender', result);
                setUserGender(gender);
                // 更新store里的me
                userStore.changeProfile({ gender });
                // setSexModalVisible(!sexModalVisible);
            })
            .catch(error => {
                Toast.show({ content: '性别修改失败,服务器内部错误' });
                if (userGender === '女') {
                    // 用户性别是女 ，改成男
                    setUserGender('男');
                } else {
                    // 用户性别是男 ，改成女
                    setUserGender('女');
                }
                // setSexModalVisible(!sexModalVisible);
            });
    }
    const genderHandle = useCallback(
        man => {
            setUserGender(man);
            setGender(man);
            setTimeout(() => {
                setSexModalVisible(!sexModalVisible);
            }, 300);
        },
        [setUserGender, setGender],
    );
    // 修改昵称
    const [updateUserName] = useMutation(GQL.updateUserName, {
        variables: {
            input: {
                name: nickname,
            },
            id: user.id,
        },
    });

    // 修改签名
    const [updateUserIntroduction] = useMutation(GQL.updateUserIntroduction, {
        variables: {
            input: {
                introduction: introduction,
            },
            id: user.id,
        },
        // onCompleted: () => {
        // },
    });

    const navigation = useNavigation();

    const finishButton = useCallback(() => {
        introduction && updateUserIntroduction() && userStore.changeProfile({ introduction: introduction });
        nickname && updateUserName() && userStore.changeProfile({ name: nickname });
        navigation.goBack();
    }, [introduction, updateUserIntroduction, nickname, setName]);

    return (
        <PageContainer
            title="编辑资料"
            rightView={
                <TouchableOpacity onPress={() => finishButton()}>
                    <Text>完成</Text>
                </TouchableOpacity>
            }>
            <View style={styles.container}>
                <ScrollView style={styles.container} bounces={false}>
                    {/* removeClippedSubviews={true} */}
                    {/* <View style={styles.settingType}>
                        <View>
                            <Text style={styles.settingTypeText}>常规设置</Text>
                        </View>
                    </View> */}
                    <TouchableOpacity disabled={iconStatus ? false : true} onPress={_changeAvatar}>
                        {/* <SettingItem itemName="更改头像" rightComponent={<Avatar source={user.avatar} size={34} />} /> */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: pixel(25) }}>
                            <Avatar source={user.avatar} size={102} />
                            <Text style={{ marginTop: pixel(8), fontSize: font(14), color: '#d0d0d0' }}>
                                {iconStatus ? '点击更换头像' : '审核中...'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        {/* onPress={setNameModal} */}
                        <View style={styles.settingItem}>
                            <SettingItem
                                itemName="昵称"
                                column={true}
                                itemNameStyle={styles.itemNameStyle}
                                rightComponent={
                                    <TextInput
                                        style={{
                                            fontSize: font(16),
                                            paddingHorizontal: pixel(0),
                                        }}
                                        autoFocus={true}
                                        placeholder={user.name}
                                        onChangeText={value => setName(value)}
                                    />
                                }
                            />
                            {/* rightContent={user.name} */}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={setSexModal}>
                        <View style={styles.settingItem}>
                            <SettingItem
                                itemName="性别"
                                itemNameStyle={styles.itemNameStyle}
                                rightContent={user.gender + ' >' || userGender + ' >'}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showDatePicker}>
                        <View style={styles.settingItem}>
                            <SettingItem
                                itemNameStyle={styles.itemNameStyle}
                                itemName="生日"
                                rightContent={userBirthday + ' >'}
                                endItem={true}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity>
                        <View style={styles.settingItem}>
                            <SettingItem itemNameStyle={styles.itemNameStyle} itemName="所在地" rightContent={'>'} />
                        </View>
                    </TouchableOpacity> */}
                    <View style={styles.line} />

                    <TouchableOpacity>
                        {/* onPress={setQianModal} */}
                        <View style={styles.settingItem}>
                            <SettingItem itemNameStyle={styles.itemNameStyle} itemName="个性签名" endItem={true} />
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <View
                                    style={{
                                        backgroundColor: '#F0F0F0',
                                        minHeight: pixel(145),
                                        position: 'relative',
                                    }}>
                                    <TextInput
                                        style={{
                                            backgroundColor: '#F0F0F0',
                                            width: Device.width - pixel(30),
                                            paddingVertical: pixel(8),
                                            paddingHorizontal: pixel(8),
                                            height: pixel(signatureHeight),
                                            fontSize: font(16),
                                        }}
                                        placeholder={qianM}
                                        multiline={true}
                                        onContentSizeChange={e => {
                                            setSignatureHeight(e.nativeEvent.contentSize.height);
                                        }}
                                        onChangeText={value => setIntroduction(value)}
                                    />
                                    {/* <Text style={{ position: 'absolute', right: 8, bottom: 16 }}>0/20</Text> */}
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* <WriteModal
                modalName="修改昵称"
                placeholder={user.name}
                visible={nameModalVisible}
                value={nickname}
                handleVisible={setNameModal}
                changeVaule={(val: any) => {
                    // nickname = val;
                    setName(val);
                }}
                submit={() => {
                    if (nickname.length < 1) {
                        setNameModal();
                        return;
                    }
                    setNameModal();
                    updateUserName();
                    userStore.changeProfile({ name: nickname });
                }}
            /> */}
            {/* <WriteModal
                modalName="修改签名"
                placeholder={qianM}
                visible={qianModalVisible}
                value={introduction}
                handleVisible={setQianModal}
                changeVaule={(val: any) => {
                    setIntroduction(val);
                }}
                submit={() => {
                    if (introduction.length < 1) {
                        setQianModal();
                        return;
                    }
                    setQianModal();
                    updateUserIntroduction();
                    userStore.changeProfile({ introduction: introduction });
                }}
            /> */}
            <AutonomousModal
                style={{ position: 'relative' }}
                visible={sexModalVisible}
                onToggleVisible={setSexModalVisible}>
                {(visible, changeVisible) => {
                    return (
                        <View style={styles.modalBody}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => genderHandle('男')}>
                                    <View style={[styles.selectGender]}>
                                        <Image
                                            source={
                                                userGender == '男'
                                                    ? require('@app/assets/images/selectGender/icon_selectedBoy.png')
                                                    : require('@app/assets/images/selectGender/icon_selectBoy.png')
                                            }
                                        />
                                        <Text style={[styles.GenderText, userGender == '男' && { color: '#1296db' }]}>
                                            男
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => genderHandle('女')}>
                                    <View style={styles.selectGender}>
                                        <Image
                                            source={
                                                userGender == '女'
                                                    ? require('@app/assets/images/selectGender/icon_selectedGirl.png')
                                                    : require('@app/assets/images/selectGender/icon_selectGirl.png')
                                            }
                                        />
                                        <Text style={[styles.GenderText, userGender == '女' && { color: '#d81e06' }]}>
                                            女
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
            </AutonomousModal>
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
    itemNameStyle: {
        fontWeight: 'bold',
        fontSize: font(16),
        color: Theme.defaultTextColor,
    },
    line: {
        height: pixel(8),
        backgroundColor: '#F0F0F0',
        // width
    },
    modalBody: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(10),
        borderTopRightRadius: pixel(10),
        position: 'absolute',
        bottom: 0,
        width: Device.width,
        height: pixel(180),
        justifyContent: 'center',
    },
    selectGender: {
        justifyContent: 'space-between',
        // alignContent: 'center',
        alignItems: 'center',
        height: pixel(90),
    },
    GenderText: {
        color: '#d0d0d0',
    },
});
