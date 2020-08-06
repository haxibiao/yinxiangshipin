import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { PageContainer, Avatar, PopOverlay } from '@src/components';
import { userStore, appStore } from '@src/store';
import { GQL } from '@src/apollo';

const LogoutAccount = props => {
    const { navigation } = props;
    return (
        <PageContainer title="注销账号" white>
            <View style={styles.container}>
                <Avatar style={styles.caveat} size={pixel(55)} source={require('@app/assets/images/logout.png')} />

                <Text style={{ fontSize: font(22), color: '#000000' }}>将现在的账号注销</Text>

                <Text style={{ margin: 15 }}>注意，注销账号后以下信息将被清空且无法找回</Text>

                <View style={styles.information}>
                    <Text style={styles.textStyle}>1.点墨阁将再也无法使用此账号</Text>
                    <Text style={styles.textStyle}>{`2.${Config.goldAlias}以及余额将被清零`}</Text>
                    <Text style={styles.textStyle}>3.交易记录将被清零</Text>
                    <Text style={styles.description}>
                        请确保所有交易已完结且无纠结，账户删除后的历史交易可能产生的资金等将视作自动放弃
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        if (!userStore.me.phone) {
                            PopOverlay({
                                content: '确定注销账号吗?',
                                onConfirm: () => {
                                    appStore.client
                                        .mutate({
                                            mutation: GQL.destoryUserMutation,
                                        })
                                        .then((result: any) => {
                                            if (result.data.destoryUser) {
                                                Toast.show({
                                                    content: '注销成功',
                                                });
                                            }
                                        })
                                        .catch((err: any) => {
                                            Toast.show({
                                                content: '注销失败',
                                            });
                                        });
                                    userStore.signOut();
                                    navigation.navigate('Main', null, navigation.navigate({ routeName: '主页' }));
                                },
                            });
                        } else {
                            navigation.navigate('PhoneVerification');
                        }
                    }}>
                    <Text style={{ fontSize: font(20) }}>下一步</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', margin: 5 }}>
                    <Text>点击【下一步】即代表你已经同意</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('CancellationAgreement');
                        }}>
                        <Text style={{ color: '#000000' }}>《用户注销协议》</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </PageContainer>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F4F4F4',
        flex: 1,
        alignItems: 'center',
    },
    caveat: {
        borderRadius: pixel(15),
        margin: 15,
        marginTop: 30,
        alignContent: 'center',
        backgroundColor: '#F4F4F4',
    },
    information: {
        padding: 15,
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    textStyle: {
        fontSize: font(16),
        paddingVertical: 8,
    },
    button: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: pixel(35),
        width: pixel(320),
        backgroundColor: '#FEC200',
        margin: 15,
    },
    description: {
        fontSize: font(16),
        lineHeight: 25,
        paddingTop: 15,
        marginTop: 5,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6',
    },
});

export default LogoutAccount;
