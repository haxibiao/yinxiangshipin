import React, { useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Iconfont, SvgIcon, SvgPath } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { observer, userStore, notificationStore } from '@src/store';

const SystemNotificationInfo = (props: Props) => {
    const { data } = props;
    // console.log('data', data);
    const navigation = useNavigation();
    // 账户信息
    const userProfile = userStore.me;
    // 路由跳转
    const navigateType = data.type;
    const navigateHandle = useCallback(() => {
        // |default:deduction[金币扣除通知]|public_notice: 公共消息通知|activity: 活动通知|
        switch (navigateType) {
            case 'public_notice':
                break;
            case 'activity':
                console.log('====================================');
                console.log('activity');
                console.log('====================================');
                break;
            default:
                navigation.navigate('WithdrawHistory', {
                    wallet_id: userProfile?.wallet.id,
                    tabPage: 1,
                });
                break;
        }
    }, [navigateType]);

    return (
        <TouchableOpacity disabled={navigateType === 'public_notice'} onPress={navigateHandle}>
            <View style={styles.containers}>
                <Text style={styles.containerTop}>{data.created_at}</Text>
                <View style={styles.containerBottom}>
                    {data?.cover && (
                        <Image
                            style={styles.containerBtmImg}
                            resizeMode="cover"
                            source={{
                                uri:
                                    'http://img1.gamersky.com/image2014/11/20141105zx_6/gamersky_01small_02_2014115111123A.jpg',
                            }}
                        />
                    )}
                    <Text style={styles.containerBtmTitle}>{data.title}</Text>
                    <Text
                        style={[
                            styles.containerBtmContent,
                            navigateType == 'public_notice' && { borderBottomWidth: pixel(0) },
                        ]}>
                        {data.content}
                    </Text>
                    {navigateType == 'public_notice' ? (
                        <View></View>
                    ) : (
                        <View style={styles.containerBtmHandle}>
                            <Text style={styles.handleText}>立即查看</Text>
                            <SvgIcon
                                style={{ marginRight: -pixel(7) }}
                                name={SvgPath.rightArrow}
                                size={25}
                                color={'#aaaaaa'}
                            />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default SystemNotificationInfo;

const itemWidth = Device.width - pixel(20);

const styles = StyleSheet.create({
    containers: {
        width: Device.width,
        alignItems: 'center',
    },
    containerTop: {
        marginTop: pixel(10),
        backgroundColor: '#ffffff',
        paddingHorizontal: pixel(8),
        paddingVertical: pixel(4),
        borderRadius: pixel(25),
        color: '#a8a8a8',
        fontSize: font(12),
    },
    containerBottom: {
        width: itemWidth,
        backgroundColor: '#ffffff',
        borderRadius: pixel(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: pixel(10),
    },
    containerBtmTitle: {
        width: itemWidth - pixel(30),
        marginTop: pixel(15),
        fontSize: font(16),
        fontWeight: 'bold',
    },
    containerBtmContent: {
        width: itemWidth - pixel(30),
        paddingVertical: pixel(10),
        color: '#a8a8a8',
        borderBottomWidth: pixel(0.5),
        borderBottomColor: '#f0f0f0',
        fontSize: font(13),
        lineHeight: pixel(20),
    },
    containerBtmHandle: {
        flexDirection: 'row',
        width: itemWidth - pixel(30),
        marginVertical: pixel(10),
        justifyContent: 'space-between',
    },
    handleText: {
        color: Theme.primaryColor,
        lineHeight: pixel(25),
        fontSize: font(14),
    },
    containerBtmImg: {
        width: itemWidth - pixel(30),
        height: (itemWidth - pixel(30)) / 2,
        marginTop: pixel(15),
        borderRadius: pixel(15),
    },
});
