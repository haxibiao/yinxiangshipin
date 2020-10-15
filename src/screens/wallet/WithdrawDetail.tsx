import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { Avatar, PageContainer, SafeText } from '@src/components';
import { userStore } from '@src/store';
import { Query, GQL } from '@src/apollo';

const WithdrawDetail = (props) => {
    const { route } = props;
    const item = route?.params?.item;

    return (
        <PageContainer title="提现详情" white>
            <Query
                query={GQL.withdrawDetailQuery}
                variables={{
                    id: item.id,
                }}>
                {({ data, error, loading, refetch }) => {
                    if (error) return null;
                    if (loading) return null;
                    if (!(data && data.withdraw)) return null;
                    let withdraw = data.withdraw;

                    return (
                        <View style={{ backgroundColor: Theme.white || '#FFF' }}>
                            <View style={{ paddingHorizontal: pixel(15) }}>
                                <View style={styles.header}>
                                    <Avatar size={38} source={userStore.me.avatar} />
                                    <SafeText style={styles.name}>{userStore.me.name}</SafeText>
                                </View>
                                <View style={styles.info}>
                                    <SafeText style={styles.money}>{withdraw.amount}</SafeText>
                                    {withdraw.status === 1 ? (
                                        <SafeText
                                            style={{
                                                fontSize: font(16),
                                                color: Theme.teaGreen,
                                            }}>
                                            交易成功
                                        </SafeText>
                                    ) : (
                                        <SafeText
                                            style={{
                                                fontSize: font(16),
                                                color: '#FF4C4C',
                                            }}>
                                            交易失败
                                        </SafeText>
                                    )}
                                </View>
                                <View style={styles.row}>
                                    <SafeText style={styles.textLeft}>提现平台 </SafeText>
                                    <SafeText style={styles.textRight}>{item.platform} </SafeText>
                                </View>
                                <View style={styles.row}>
                                    <SafeText style={styles.textLeft}>提现单号 </SafeText>
                                    <SafeText style={styles.textRight}>
                                        {withdraw.status === 1 ? withdraw.biz_no : '无'}
                                    </SafeText>
                                </View>
                                <View style={styles.row}>
                                    <SafeText style={styles.textLeft}>转帐备注 </SafeText>
                                    <SafeText style={styles.textRight}>{`${Config.goldAlias}提现`} </SafeText>
                                </View>

                                {withdraw.to_platform == 'Alipay' && (
                                    <View
                                        style={[
                                            styles.row,
                                            {
                                                paddingBottom: pixel(15),
                                            },
                                        ]}>
                                        <SafeText style={styles.textLeft}>收款账户</SafeText>
                                        <SafeText style={styles.textRight}> {withdraw.to_account}</SafeText>
                                    </View>
                                )}
                                <View style={styles.borderRow}>
                                    <SafeText style={styles.textLeft}>提现时间</SafeText>
                                    <SafeText style={styles.textRight}>{withdraw.created_at}</SafeText>
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.row,
                                    {
                                        paddingBottom: pixel(15),
                                        paddingHorizontal: pixel(15),
                                    },
                                ]}>
                                <SafeText style={styles.textLeft}>订单号</SafeText>
                                <View style={{ flex: 1, marginLeft: 20 }}>
                                    <SafeText style={styles.text}>
                                        {withdraw.status === 1 ? withdraw.trade_no : '无'}
                                    </SafeText>
                                </View>
                            </View>

                            <View
                                style={{
                                    paddingHorizontal: pixel(15),
                                    borderTopWidth: pixel(10),
                                    borderTopColor: '#F0F0F0',
                                }}>
                                <View style={styles.footer}>
                                    <SafeText
                                        style={[
                                            styles.textLeft,
                                            {
                                                lineHeight: font(22),
                                            },
                                        ]}>
                                        回执信息 {'   '}{' '}
                                        <SafeText style={[styles.textRight]}> {withdraw.remark}</SafeText>
                                    </SafeText>
                                </View>
                            </View>
                        </View>
                    );
                }}
            </Query>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: pixel(15),
    },
    name: {
        paddingLeft: pixel(10),
        fontSize: font(18),
        color: Theme.defaultTextColor,
    },
    info: {
        alignItems: 'center',
        marginVertical: pixel(20),
    },
    money: {
        fontSize: font(36),
        paddingBottom: pixel(15),
        color: Theme.defaultTextColor,
        textAlign: 'center',
    },
    row: {
        paddingBottom: pixel(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textLeft: {
        fontSize: font(15),
        color: Theme.subTextColor,
    },
    textRight: {
        fontSize: font(15),
        color: Theme.defaultTextColor,
        textAlign: 'right',
    },
    text: {
        fontSize: font(14),
        color: Theme.defaultTextColor,
        // width: (SCREEN_WIDTH * 3) / 4,
        textAlign: 'right',
    },
    borderRow: {
        paddingBottom: pixel(20),
        paddingTop: pixel(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: pixel(1),
        borderTopColor: Theme.borderColor,
    },
    footer: {
        paddingVertical: pixel(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default WithdrawDetail;
