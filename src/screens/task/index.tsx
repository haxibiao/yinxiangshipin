import React, { Component, useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { PageContainer, Iconfont, Row, HxfModal, HxfButton, PopOverlay, StatusView } from '@src/components';
import { authNavigate, useNavigation } from '@src/router';
import { observer, appStore, userStore } from '@src/store';
import { GQL, useMutation, useQuery } from '@src/apollo';
import { AppUtil } from '@src/native';
import AttendanceBook from './attendance/AttendanceBook';
import TaskList from './components/TaskList';

const batTop = pixel(Theme.statusBarHeight);

export default observer((props: any) => {
    const navigation = useNavigation();
    const { data, refetch } = useQuery(GQL.MeMetaQuery, {
        fetchPolicy: 'network-only',
    });
    const userProfile = useMemo(() => Object.assign(userStore.me, data?.me), [data]);

    const authNavigator = useCallback(
        (route, params) => {
            if (userStore.login) {
                navigation.navigate(route, params);
            } else {
                navigation.navigate('Login');
            }
        },
        [userStore.login],
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={{ backgroundColor: Theme.primaryColor }}>
                <Image style={styles.titleCover} source={require('@app/assets/images/wallet_back.png')} />
                <Text style={styles.pageTitle}>任务中心</Text>
                <Row style={{ paddingVertical: pixel(20) }}>
                    <TouchableOpacity
                        style={styles.assetItem}
                        onPress={() => {
                            authNavigator('WithdrawHistory', {
                                wallet_id: Helper.syncGetter('wallet.id', userProfile),
                            });
                        }}>
                        <Image
                            source={require('@app/assets/images/icon_wallet_dmb.png')}
                            style={styles.walletItemIcon}
                        />
                        <Text style={styles.assetName}>{Config.goldAlias}</Text>
                        <Text style={styles.assetCount}>{Helper.syncGetter('gold', userProfile) || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.assetItem}
                        onPress={() => {
                            authNavigator('Wallet', { user: userProfile });
                        }}>
                        <Image
                            source={require('@app/assets/images/icon_wallet_rmb.png')}
                            style={styles.walletItemIcon}
                        />
                        <Text style={styles.assetName}>余额(元)</Text>
                        <Text style={styles.assetCount}>{Helper.syncGetter('balance', userProfile) || 0}</Text>
                    </TouchableOpacity>
                </Row>
                <View style={styles.assetTip}>
                    <Text style={{ color: '#FFFC', fontSize: font(13) }}>
                        每天凌晨自动将{Config.goldAlias}兑换为余额
                    </Text>
                    <Text style={styles.assetRate}>
                        今日汇率：{userProfile.exchangeRate || '1000'} {Config.goldAlias} / 1元
                    </Text>
                </View>
            </View>
            {userStore.login ? (
                <>
                    <AttendanceBook />
                    <TaskList />
                </>
            ) : (
                <StatusView.EmptyView
                    title="精彩的东西往往需要去登陆！"
                    imageSource={require('@app/assets/images/default_empty.png')}
                />
            )}
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F6FB',
        paddingBottom: pixel(Theme.BOTTOM_HEIGHT),
    },
    titleCover: {
        position: 'absolute',
        top: 0,
        flex: 1,
        bottom: 0,
        right: 0,
        left: 0,
        resizeMode: 'cover',
        height: '100%',
        width: '100%',
    },
    pageTitle: {
        color: '#fff',
        fontSize: font(19),
        fontWeight: 'bold',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginTop: batTop,
    },
    assetItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletItemIcon: {
        borderRadius: pixel(10),
        height: pixel(20),
        marginRight: pixel(5),
        width: pixel(20),
    },
    assetName: {
        fontSize: font(16),
        color: '#FFF',
        marginRight: pixel(5),
    },
    assetCount: {
        fontSize: font(16),
        color: '#FFF',
        fontWeight: 'bold',
    },
    assetTip: {
        alignContent: 'center',
        alignItems: 'center',
        paddingBottom: pixel(15),
    },
    assetRate: {
        color: '#F6DB4A',
        fontSize: font(13),
        marginTop: pixel(5),
        fontWeight: 'bold',
    },
});
