import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Overlay } from 'teaset';
import { Row } from '@src/components';
import { appStore, userStore } from '@src/store';
import { GQL } from '@src/apollo';

type rewardObj = {
    message: string | null;
    gold: number | null;
    contribute: number | null;
};

type Props = {
    reward: rewardObj;
    navigation: any;
};

export default (props: Props) => {
    const { reward, navigation } = props;

    let overlayRef: any;
    return Overlay.show(
        <Overlay.View
            visible={false}
            style={{ justifyContent: 'center', alignItems: 'center' }}
            ref={(ref: any) => {
                overlayRef = ref;
            }}>
            <View style={styles.SuccessModule}>
                <Row>
                    <Image
                        source={require('@app/assets/images/icon_wallet_rmb.png')}
                        style={{ width: pixel(50), height: pixel(50) }}
                    />
                    <View style={styles.SuccessModuleTextBack}>
                        <Text numberOfLines={1}>{reward.message || '完成任务获得奖励！'}</Text>
                        <Text numberOfLines={1}>
                            {(reward.gold ? Config.goldAlias + ' +' + reward.gold : '') +
                                (reward.gold && reward.contribute ? '，' : '') +
                                (reward.contribute ? `${Config.limitAlias} +` + reward.contribute : '')}
                        </Text>
                    </View>
                </Row>

                <Row style={styles.SuccessModuleButtonBack}>
                    <TouchableOpacity
                        style={styles.SuccessModuleButton}
                        onPress={() => {
                            // console.log("测试",userStore.me.wallet.id);
                            overlayRef.close();
                            navigation.navigate('WithdrawHistory', {
                                wallet_id: Helper.syncGetter('wallet.id', 0),
                                tabPage: 2,
                            });
                        }}>
                        <Text style={styles.SuccessModuleButtonTitle}>我的账单</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.SuccessModuleButton}
                        onPress={() => {
                            overlayRef.close();
                        }}>
                        <Text style={styles.SuccessModuleButtonTitle}>关闭浮层</Text>
                    </TouchableOpacity>
                </Row>
            </View>
        </Overlay.View>,
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingTop: Device.WIDTH * 0.75,
    },
    profileView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: Device.WIDTH,
        height: Device.WIDTH * 0.75,
        overflow: 'hidden',
    },
    SuccessModuleBack: {
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: '#66666699',
        position: 'absolute',
        zIndex: 66,
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignContent: 'center',
    },
    SuccessModule: {
        marginHorizontal: '15%',
        backgroundColor: '#FFF',
        position: 'absolute',
        zIndex: 68,
        padding: pixel(20),
        borderRadius: pixel(10),
    },
    SuccessModuleTextBack: {
        width: Device.WIDTH - (Device.WIDTH * 0.3 + pixel(90)),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    SuccessModuleButtonBack: {
        paddingTop: pixel(20),
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    SuccessModuleButton: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SuccessModuleButtonTitle: {
        fontWeight: 'bold',
    },
});
