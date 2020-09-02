import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, ListItem, ItemSeparator, PopOverlay, Avatar } from '@src/components';
import { userStore } from '@src/store';
import { checkUpdate } from '@src/common';

export default (props: any) => {
    const user = props.route.params?.user;
    const { navigation } = props;
    const [me, setMe] = useState(user);
    const [storageSize, setStorageSize] = useState((Math.random() * 10).toFixed(1) + 'M');
    const [logoutConfirm, setLogoutConfirm] = useState(false);
    const { login } = userStore;
    const signOut = () => {
        if (!logoutConfirm) {
            if (me.phone === null || me.phone === undefined) {
                PopOverlay({
                    content: '账号未绑定，退出登录可能会丢失数据！可以前往【设置】中绑定手机号',
                    leftContent: '我再想想',
                    rightContent: '前去绑定',
                    onConfirm: async () => {
                        navigation.navigate('BindingAccount');
                    },
                });
            } else {
                PopOverlay({
                    content: '确定退出登录吗?',
                    onConfirm: async () => {
                        userStore.signOut();
                        navigation.navigate('Main', null, navigation.navigate('Profile'));
                    },
                });
            }
            setLogoutConfirm(true);
        } else {
            // 第二次点击退出登录时弹出确定退出窗口
            PopOverlay({
                content: '确定退出登录吗?',
                onConfirm: async () => {
                    userStore.signOut();
                    navigation.navigate('Main', null, navigation.navigate('Profile'));
                },
            });
        }
    };

    return (
        <PageContainer title="设置" white>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{
                    paddingBottom: pixel(20),
                }}
                bounces={false}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}>
                {login && (
                    <View>
                        <ItemSeparator />
                        <ListItem
                            onPress={() => navigation.navigate('EditProfile')}
                            style={styles.listItem}
                            leftComponent={
                                <View style={styles.UserComment}>
                                    <Avatar source={user.avatar} style={styles.avatarImage} />
                                    <Text style={styles.avatarName}>{user.name}</Text>
                                </View>
                            }
                            rightComponent={
                                <View style={styles.UserComment}>
                                    <Text style={styles.informationUser}>个人信息</Text>
                                    <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                                </View>
                            }
                        />
                        <ItemSeparator />
                        <ListItem
                            onPress={() => navigation.navigate('AccountSecurity', { user })}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}> 账号绑定 </Text>}
                            rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                        />
                        <ItemSeparator />
                        <ListItem
                            onPress={() => navigation.navigate('UserBlockList')}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}> 黑名单 </Text>}
                            rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                        />
                    </View>
                )}
                <ItemSeparator />
                <ListItem
                    onPress={() => checkUpdate()}
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}>检查更新</Text>}
                    rightComponent={<Text style={styles.rigthText}> {Config.Version} </Text>}
                />
                <ItemSeparator />

                <ListItem
                    onPress={() => navigation.navigate('VersionInformation')}
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}>其他 </Text>}
                    rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                />
                <ItemSeparator />
                <ListItem
                    onPress={() =>
                        setTimeout(() => {
                            setStorageSize('0M');

                            Toast.show({ content: '已清除缓存' });
                        }, 300)
                    }
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}> 清除缓存 </Text>}
                    rightComponent={<Text style={styles.rigthText}> {storageSize} </Text>}
                />

                <ItemSeparator />
                {login && (
                    <TouchFeedback
                        style={[
                            styles.listItem,
                            {
                                justifyContent: 'center',
                            },
                        ]}
                        onPress={signOut}>
                        <Text style={styles.logout}>退出登录</Text>
                    </TouchFeedback>
                )}
            </ScrollView>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    UserComment: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    avatarImage: {
        borderRadius: pixel(100),
        height: pixel(50),
        marginVertical: pixel(8),
        width: pixel(50),
    },
    avatarName: {
        color: 'rgba(0, 0, 0, 1)',
        fontSize: font(16),
        fontWeight: 'bold',
        marginLeft: pixel(15),
    },
    container: {
        backgroundColor: Theme.groundColour,
        flex: 1,
    },
    informationUser: {
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: font(16),
        marginRight: pixel(10),
    },
    itemText: {
        color: Theme.defaultTextColor,
        fontSize: font(15),
        marginRight: pixel(15),
    },
    listItem: {
        backgroundColor: '#fff',
        height: pixel(50),
        paddingHorizontal: pixel(16),
    },
    logout: {
        alignSelf: 'center',
        color: Theme.primaryColor,
        fontSize: font(14),
    },
    rigthText: {
        color: Theme.subTextColor,
        fontSize: font(14),
    },
});
