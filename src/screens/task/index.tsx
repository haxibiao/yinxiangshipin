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
import { Iconfont, Row, HxfButton, FocusAwareStatusBar } from '@src/components';
import { useCirculationAnimation } from '@src/common';
import { observer, appStore, userStore, adStore, notificationStore } from '@src/store';
import { GQL, useMutation, useQuery } from '@src/apollo';
import AttendanceBook from './components/AttendanceBook';
import TaskList from './components/TaskList';

export default observer((props: any) => {
    const navigation = useNavigation();
    const userProfile = userStore.me;

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
            <FocusAwareStatusBar barStyle="light-content" />
            <TouchableWithoutFeedback onPress={() => authNavigator('Wallet', { user: userProfile })}>
                <ImageBackground
                    style={styles.taskTopContainer}
                    source={require('@app/assets/images/bg/bg_task_cover.png')}>
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
                            onPress={() => authNavigator('Wallet', { user: userProfile })}>
                            <Image
                                source={require('@app/assets/images/wallet/icon_wallet_giftAward.png')}
                                style={styles.walletItemIcon}
                            />
                            <Text style={styles.assetName}>余额</Text>
                            <Text style={styles.assetCount}>{userProfile?.balance || 0}</Text>
                            <Animated.Image
                                style={[styles.redPacketIcon, { transform: [{ scale }] }]}
                                source={require('@app/assets/images/wallet/ic_home_red_packet.png')}
                            />
                        </TouchableOpacity>
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

const BUTTON_WIDTH = Math.max(Device.width * 0.48, pixel(168));

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        paddingBottom: Device.tabBarHeight + Device.bottomInset + pixel(15),
    },
    taskTopContainer: {
        width: Device.width,
        height: Device.width * 0.47,
        paddingTop: Device.statusBarHeight + Device.navBarHeight - pixel(35),
        paddingBottom: pixel(50),
    },
    taskContent: {
        marginTop: -pixel(50),
    },
    assetContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: pixel(10),
    },
    assetItem: {
        flex: 1,
        position: 'relative',
        padding: pixel(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletItemIcon: {
        width: pixel(28),
        height: pixel(28),
        marginRight: pixel(10),
        borderRadius: pixel(14),
        backgroundColor: '#FFF',
    },
    redPacketIcon: {
        position: 'absolute',
        right: pixel(15),
        top: -pixel(6),
        width: pixel(32),
        height: pixel(32) * 1.19,
    },
    assetName: {
        fontSize: font(15),
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
