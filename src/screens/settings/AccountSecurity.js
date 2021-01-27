import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PageContainer, Iconfont, Avatar, ListItem, PopOverlay } from '@src/components';
import { userStore, appStore, observer } from '@src/store';
import { bindWeChat } from '@src/common';

const AccountSecurity = observer(() => {
    const navigation = useNavigation();
    const user = userStore.me;
    const [isBindWechat, setIsBindWechat] = React.useState(!!Helper.syncGetter('wallet.platforms.wechat', user));
    const isBindAliPay = React.useMemo(() => !!Helper.syncGetter('wallet.platforms.alipay', user), [user]);

    const aliPayHandler = () => {
        if (!user.phone) {
            PopOverlay({
                content: '该账号还未绑定手机号,先去绑定手机号?',
                onConfirm: () => {
                    navigation.navigate('BindingAccount');
                },
            });
        } else {
            navigation.navigate('VerifyAliPay');
        }
    };

    const modifyPassword = async () => {
        if (!user.phone) {
            PopOverlay({
                content: '该账号还未绑定手机号,先去绑定手机号?',
                onConfirm: async () => {
                    navigation.navigate('BindingAccount');
                },
            });
        } else {
            navigation.navigate('ModifyPassword');
        }
    };

    const phoneAccountHandler = async () => {
        if (!user.phone) {
            navigation.navigate('BindingAccount');
        }
    };

    const handlerBindWechat = () => {
        if (isBindWechat) {
            Toast.show({
                content: '已绑定微信',
            });
        } else {
            bindWeChat({
                onSuccess: () => {
                    Toast.show({
                        content: '绑定成功',
                    });
                    setIsBindWechat(true);
                },
            });
        }
    };

    return (
        <PageContainer title="账号安全" loading={!user} white>
            <View style={styles.container}>
                <View style={styles.panelLeft}>
                    <Avatar source={user.avatar} size={52} borderStyle={{ borderWidth: 1, borderColor: '#ffffff' }} />
                    <View style={styles.panelContent}>
                        <Text style={{ color: Theme.defaultTextColor, fontSize: font(15) }}>{user.name}</Text>
                    </View>
                </View>

                <ListItem
                    style={styles.listItem}
                    onPress={() => {
                        Clipboard.setString(user.id || '0x00');
                        Toast.show({ content: '账号已复制到剪切板' });
                    }}
                    leftComponent={<Text style={styles.itemText}>{Config.AppName}账号</Text>}
                    rightComponent={
                        <View style={styles.rightWrap}>
                            <Text style={styles.rightText}>{user.id}</Text>
                        </View>
                    }
                />

                <ListItem
                    style={styles.listItem}
                    onPress={() => {
                        Clipboard.setString(user.uuid || '未知身份');
                        Toast.show({ content: '身份标识已复制到剪切板' });
                    }}
                    leftComponent={<Text style={styles.itemText}>身份标识</Text>}
                    rightComponent={
                        <View style={[styles.rightWrap, { maxWidth: 200 }]}>
                            <Text style={styles.rightText} numberOfLines={1}>
                                {user.uuid || '未知身份'}
                            </Text>
                        </View>
                    }
                />

                <ListItem
                    onPress={phoneAccountHandler}
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}>手机账号</Text>}
                    rightComponent={
                        user.phone ? (
                            <View style={styles.rightWrap}>
                                <Text style={styles.rightText}>{user.title_phone}</Text>
                                <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                            </View>
                        ) : (
                            <View style={styles.rightWrap}>
                                <Text style={styles.linkText}>去设置</Text>
                                <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                            </View>
                        )
                    }
                />

                {appStore.enableWallet && (
                    <ListItem
                        style={styles.listItem}
                        disabled={isBindAliPay}
                        onPress={aliPayHandler}
                        leftComponent={<Text style={styles.itemText}>支付宝账号</Text>}
                        rightComponent={
                            isBindAliPay ? (
                                <View style={styles.rightWrap}>
                                    <Text style={styles.rightText}>已绑定</Text>
                                    <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                                </View>
                            ) : (
                                <View style={styles.rightWrap}>
                                    <Text style={styles.linkText}>未绑定</Text>
                                    <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                                </View>
                            )
                        }
                    />
                )}

                {/* {!Device.IOS && (
                    <ListItem
                        onPress={handlerBindWechat}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>微信账号</Text>}
                        rightComponent={
                            <View style={styles.rightWrap}>
                                <Text style={isBindWechat ? styles.rightText : styles.linkText}>
                                    {isBindWechat ? '已绑定' : '去绑定'}
                                </Text>
                                <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                            </View>
                        }
                    />
                )} */}

                <ListItem
                    style={styles.listItem}
                    onPress={modifyPassword}
                    leftComponent={<Text style={styles.itemText}>修改密码</Text>}
                    rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                />
                {/* <ListItem
                    style={styles.listItem}
                    onPress={() => {
                        navigation.navigate('LogoutAccount');
                    }}
                    leftComponent={<Text style={styles.itemText}>注销账号</Text>}
                    rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                /> */}
            </View>
        </PageContainer>
    );
});

export default AccountSecurity;

const styles = StyleSheet.create({
    avatarTip: {
        color: Theme.subTextColor,
        fontSize: font(13),
        marginVertical: pixel(15),
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: pixel(Theme.edgeDistance),
        // marginHorizontal: pixel(Theme.edgeDistance),
    },
    field: {
        color: '#666',
        fontSize: font(14),
    },
    fieldGroup: {
        marginBottom: pixel(30),
        paddingHorizontal: Theme.edgeDistance,
    },
    genderGroup: {
        alignItems: 'center',
        flexDirection: 'row',
        width: pixel(100),
    },
    genderItem: { height: pixel(20), marginRight: pixel(8), width: pixel(20) },
    inputStyle: {
        color: Theme.defaultTextColor,
        flex: 1,
        fontSize: font(15),
        marginTop: pixel(6),
        paddingVertical: pixel(10),
    },
    inputWrap: {
        alignItems: 'center',
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(1),
        flexDirection: 'row',
    },
    itemText: {
        color: Theme.defaultTextColor,
        fontSize: font(15),
        marginRight: pixel(15),
    },
    linkText: {
        color: '#407FCF',
        fontSize: font(15),
        marginRight: pixel(6),
    },
    listItem: {
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(1),
        height: pixel(50),
    },
    panelContent: {
        height: 34,
        justifyContent: 'space-between',
        marginLeft: 15,
        marginTop: 15,
    },
    panelLeft: {
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#6661',
    },
    rightText: {
        color: Theme.subTextColor,
        fontSize: font(15),
        marginRight: pixel(6),
    },
    rightWrap: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    userLevel: {
        color: Theme.subTextColor,
        fontSize: font(12),
        fontWeight: '300',
        paddingTop: 3,
    },
    userPanel: {
        alignItems: 'center',
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(1),
        flexDirection: 'row',
        height: pixel(80),
        justifyContent: 'space-between',
    },
});
