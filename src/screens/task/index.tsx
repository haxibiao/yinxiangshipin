import React, { Component, useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    ImageBackground,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Iconfont, Row, HxfButton, NavBarHeader } from '@src/components';
import { useCirculationAnimation } from '@src/common';
import { observer, appStore, userStore, adStore, notificationStore } from '@src/store';
import { GQL, useMutation, useQuery } from '@src/apollo';
import AttendanceBook from './components/AttendanceBook';
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

    const animation = useCirculationAnimation({ duration: 3000, start: true });
    const scale = animation.interpolate({
        inputRange: [0, 0.1, 0.2, 0.3, 0.4, 1],
        outputRange: [1, 1.09, 1.03, 1.09, 1, 1],
    });

    const withdrawTips = useMemo(() => {
        if (userStore.me?.balance) {
            const accountMoney = Number(
                Number(userStore.me?.balance || 0) +
                    Helper.goldExchange(userStore.me?.gold || 0, userStore.me?.exchangeRate),
            ).toFixed(2);
            return `大约可提现${accountMoney}元`;
        } else {
            return `新用户当日提现秒到账，最高可提现10元`;
        }
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container} bounces={false}>
            <NavBarHeader
                hasGoBackButton={false}
                isTransparent={true}
                statusbarProperties={{ barStyle: 'light-content' }}
                navBarStyle={{ position: 'absolute', left: 0, right: 0, zIndex: 1 }}
            />
            <TouchableWithoutFeedback onPress={() => authNavigator('Wallet', { user: userProfile })}>
                <ImageBackground
                    style={styles.taskTopContainer}
                    source={require('@app/assets/images/bg/task_top_bg.png')}>
                    <View style={{ flex: 1, backgroundColor: '#FFE500' }}>
                        <View style={styles.assetContainer}>
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
                                <Text style={styles.assetCount}>{userProfile?.gold || 0}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.assetItem}
                                onPress={() =>
                                    notificationStore.sendRemindNotice({
                                        title: `${Config.ticketAlias}描述`,
                                        content: `部分任务的进行需要消耗相应${Config.ticketAlias}，次日恢复满额${Config.ticketAlias}，不可累积`,
                                    })
                                }>
                                <Image
                                    source={require('@app/assets/images/wallet/icon_wallet_giftAward.png')}
                                    style={styles.walletItemIcon}
                                />
                                <Text style={styles.assetName}>{Config.ticketAlias}</Text>
                                <Text style={styles.assetCount}>{userProfile?.ticket || 0}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.assetTip}>
                            <Text style={styles.assetRate}>{withdrawTips}</Text>
                            <Animated.View style={{ transform: [{ scale }] }}>
                                <HxfButton
                                    gradient={true}
                                    colors={['#FEDB86', '#FDB528']}
                                    style={styles.withdrawButton}
                                    title={'去提现'}
                                    titleStyle={styles.withdrawText}
                                    onPress={() => authNavigator('Wallet', { user: userProfile })}
                                />
                            </Animated.View>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
            <View style={styles.taskContent}>
                <AttendanceBook />
                <TaskList />
            </View>
        </ScrollView>
    );
});

const BUTTON_WIDTH = Math.max(Device.WIDTH * 0.48, pixel(168));

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F6FB',
        paddingBottom: Theme.BOTTOM_HEIGHT + Theme.HOME_INDICATOR_HEIGHT + pixel(15),
    },
    taskTopContainer: {
        width: Device.WIDTH,
        height: Device.WIDTH * 0.65,
        paddingTop: Theme.statusBarHeight + Theme.NAVBAR_HEIGHT - pixel(35),
        paddingBottom: Device.WIDTH * 0.2,
    },
    taskContent: {
        marginTop: -Device.WIDTH * 0.15,
    },
    assetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    assetItem: {
        flex: 1,
        paddingVertical: pixel(15),
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
        fontWeight: 'bold',
        color: '#703C0B',
        marginRight: pixel(5),
    },
    assetCount: {
        fontSize: font(16),
        color: '#703C0B',
        fontWeight: 'bold',
    },
    assetTip: {
        alignContent: 'center',
        alignItems: 'center',
    },
    assetRate: {
        color: '#703C0B',
        fontSize: font(11),
        marginBottom: pixel(5),
        fontWeight: 'bold',
    },
    withdrawButton: {
        width: BUTTON_WIDTH,
        height: BUTTON_WIDTH * 0.22,
        borderRadius: BUTTON_WIDTH * 0.22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    withdrawText: {
        color: '#703C0B',
        fontSize: font(16),
        fontWeight: 'bold',
    },
});
