import React, { Component, useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconfont, Row, HxfButton, NavBarHeader, SafeText } from '@src/components';
import { observer, appStore, userStore, adStore } from '@src/store';
import { GQL, useMutation, useQuery } from '@src/apollo';
import AttendanceBook from './attendance/AttendanceBook';
import TaskList from './components/TaskList';

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
            <NavBarHeader
                title="任务中心"
                isTransparent={true}
                statusbarProperties={{ barStyle: 'light-content' }}
                navBarStyle={{ position: 'absolute', left: 0, right: 0, zIndex: 1 }}
            />
            <TouchableWithoutFeedback
                onPress={() => {
                    if (adStore.enableWallet) {
                        authNavigator('Wallet', { user: userProfile });
                    }
                }}>
                <View style={styles.assetContainer}>
                    <Image style={styles.walletBg} source={require('@app/assets/images/wallet_back.png')} />
                    <Row style={{ paddingVertical: pixel(20) }}>
                        <TouchableOpacity
                            style={styles.assetItem}
                            onPress={() => {
                                authNavigator('WithdrawHistory', {
                                    wallet_id: Helper.syncGetter('wallet.id', userProfile),
                                    tabPage: 2,
                                });
                            }}>
                            <Image
                                source={require('@app/assets/images/wallet/icon_wallet_diamond.png')}
                                style={styles.walletItemIcon}
                            />
                            <Text style={styles.assetName}>{Config.goldAlias}</Text>
                            <SafeText style={styles.assetCount}>{userProfile?.gold || 0}</SafeText>
                        </TouchableOpacity>
                        <View style={styles.assetItem}>
                            <Image
                                source={require('@app/assets/images/wallet/icon_wallet_giftAward.png')}
                                style={styles.walletItemIcon}
                            />
                            <Text style={styles.assetName}>{Config.ticketAlias}</Text>
                            <SafeText style={styles.assetCount}>{userProfile?.ticket || 0}</SafeText>
                        </View>
                    </Row>
                    <View style={styles.assetTip}>
                        <Text style={{ color: '#fff', fontSize: font(13) }}>
                            每天凌晨自动将{Config.goldAlias}兑换为余额
                        </Text>
                        <SafeText style={styles.assetRate}>
                            今日汇率：{userProfile.exchangeRate || '500'} {Config.goldAlias} / 1元
                        </SafeText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <AttendanceBook />
            <TaskList />
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F6FB',
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + pixel(30),
    },
    assetContainer: {
        backgroundColor: '#FE4966',
        paddingTop: Theme.statusBarHeight + Theme.NAVBAR_HEIGHT - pixel(10),
    },
    walletBg: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        height: '100%',
        width: '100%',
    },
    assetItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletItemIcon: {
        height: pixel(28),
        width: pixel(28),
        marginRight: pixel(10),
        borderRadius: pixel(14),
        backgroundColor: '#FFF',
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
