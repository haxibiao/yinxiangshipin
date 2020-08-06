import React, { Fragment, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Overlay } from 'teaset';
import { appStore, userStore } from '@src/store';
import Iconfont from '../Iconfont';
import Row from '../Basic/Row';
import HxfButton from '../Form/HxfButton';
import { authNavigate } from '@src/router';

interface Reward {
    gold?: number;
    contribute?: number;
}

interface Props {
    reward: Reward;
    title: string;
    type: any;
}

let OverlayKey: any = null;

const rewardTitle = (rewardList: { value: any; name: any }[]) => {
    return <Text style={styles.title}>{`恭喜获得${rewardList[0].value + rewardList[0].name}`}</Text>;
};

const RewardOverlay = (props) => {
    const { reward, title, type } = props;
    const { gold, contribute } = reward;
    const currentGold = userStore.me?.gold + gold;
    const [adShow, setAdShow] = useState(false);

    const constructRewardList = [
        {
            value: gold || 0,
            name: gold ? Config.goldAlias : null,
            image: require('@app/assets/images/icon_wallet_dmb.png'),
        },
        {
            value: contribute || 0,
            name: contribute ? '贡献点' : null,
            image: require('@app/assets/images/diamond.png'),
            style: styles.contributeImage,
        },
    ];

    const rewardList = constructRewardList.filter((elem) => {
        return elem.value > 0;
    });

    const body = rewardList.length > 1 ? '额外奖励' : title || '偷偷告诉你一个小秘密，看视频点详情更有贡献点奖励哦';
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.content,
                    adShow ? {} : { borderBottomLeftRadius: pixel(10), borderBottomRightRadius: pixel(10) },
                ]}>
                <TouchableOpacity style={styles.operation} onPress={hide}>
                    <Iconfont name={'guanbi1'} color={'#D8D8D8'} size={font(16)} />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Image
                        source={require('@app/assets/images/bg_reward_overlay_top.png')}
                        style={styles.headerImage}
                    />
                </View>
                <View style={styles.header}>
                    <View style={{}}>
                        {rewardTitle(rewardList)}
                        <View style={styles.rewardContainer}>
                            <Text style={{ color: Theme.grey }}>{body}</Text>

                            {rewardList.slice(1).map((data, index) => {
                                return (
                                    <Fragment key={index}>
                                        {/*  <Image source={data.image} style={data.style} /> */}
                                        <Text style={{ color: Theme.theme, paddingLeft: pixel(3) }}>
                                            {data.value}
                                            <Text style={{ color: Theme.theme }}>{data.name}</Text>
                                        </Text>
                                    </Fragment>
                                );
                            })}
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: pixel(5), paddingBottom: pixel(15) }}>
                    <HxfButton
                        style={styles.button}
                        textColor={'#623605'}
                        title={'查看详情'}
                        onPress={() => {
                            hide();
                            authNavigate('WithdrawHistory', {
                                tabPage: 2,
                            });
                        }}
                    />
                </View>
                {!appStore.disableAd && (
                    <Row style={{ justifyContent: 'center' }}>
                        <Text
                            style={{
                                fontSize: font(13),
                                color: '#999999',
                            }}>
                            当前{Config.goldAlias}:
                        </Text>
                        <Image
                            source={require('@app/assets/images/icon_wallet_dmb.png')}
                            style={{ width: pixel(17), height: pixel(17), marginHorizontal: pixel(3) }}
                        />
                        <Text
                            style={{
                                fontSize: font(13),
                                color: '#999999',
                            }}>
                            {currentGold}
                            <Text style={{ color: Theme.themeRed }}>
                                ≈{Helper.goldExchange(currentGold, userStore.me?.exchange_rate)}元
                            </Text>
                        </Text>
                    </Row>
                )}
            </View>
            {adShow && (
                <Image
                    source={require('@app/assets/images/bg_feed_overlay_line.png')}
                    style={{
                        width: Device.WIDTH - pixel(48),
                        height: ((Device.WIDTH - pixel(48)) * 30) / 640,
                    }}
                />
            )}
        </View>
    );
};

const show = (props: Props) => {
    const overlayView = (
        <Overlay.View animated={true}>
            <RewardOverlay {...props} />
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
const hide = () => {
    Overlay.hide(OverlayKey);
};

export default {
    show,
    hide,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: Device.WIDTH - pixel(48),
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingBottom: pixel(15),
        borderTopLeftRadius: pixel(10),
        borderTopRightRadius: pixel(10),
        // alignItems: 'center',
    },
    contributeImage: {
        width: 15,
        height: 15,
        marginLeft: 3,
        paddingTop: 2,
        marginRight: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pixel(25),
        marginBottom: pixel(15),
    },
    headerImage: {
        width: (Device.WIDTH * 0.28 * 318) / 216,
        height: Device.WIDTH * 0.28,
        marginTop: pixel(-75),
    },
    modalFooter: {
        borderTopWidth: pixel(0.5),
        borderTopColor: '#f0f0f0',
        flexDirection: 'row',
        marginTop: pixel(15),
    },
    operation: {
        position: 'absolute',
        right: pixel(0),
        top: pixel(0),
        paddingTop: pixel(10),
        paddingHorizontal: pixel(15),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    operationText: {
        fontSize: font(15),
        fontWeight: '400',
        color: '#969696',
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
    },
    button: {
        backgroundColor: '#FCE03D',
        borderRadius: pixel(19),
        height: pixel(38),
        width: Device.WIDTH * 0.6,
    },
    title: {
        fontSize: font(18),
        color: '#202020',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default { show, hide };
