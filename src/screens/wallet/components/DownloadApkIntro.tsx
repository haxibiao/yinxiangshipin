/*
 * @Author: Gaoxuan
 * @Date:   2019-03-21 16:28:10
 */
import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Row, TouchFeedback, Iconfont } from '@src/components';

import { Overlay } from 'teaset';

import DownLoadApk from './DownLoadApk';

class DownloadApkIntro {
    static OverlayKey: any;
    static show() {
        const overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Row style={{ marginTop: pixel(25) }}>
                            <Image source={require('@app/assets/images/dongdezhuan.png')} style={styles.icon} />
                            <View style={{ marginLeft: pixel(5) }}>
                                <Text style={styles.title}>懂得赚</Text>
                                <Text style={styles.appInfo} numberOfLines={1}>
                                    高收益，秒提现，不限时，不限额！
                                </Text>
                            </View>
                        </Row>
                        <View style={styles.intro}>
                            <Text style={styles.text}>1.下载安装打开懂得赚</Text>
                            <Text style={styles.text}>2.前往设置-账号中心设置手机与密码</Text>
                            <Text style={styles.text}>3.回到{Config.AppName}绑定懂得赚账号，提现到懂得赚</Text>
                        </View>
                        <View style={{ marginBottom: pixel(20), marginTop: pixel(40) }}>
                            <DownLoadApk
                                hide={() => {
                                    Overlay.hide(this.OverlayKey);
                                }}
                            />
                        </View>
                    </View>
                    <TouchFeedback
                        style={{ marginTop: pixel(40), alignItems: 'center' }}
                        onPress={() => {
                            Overlay.hide(this.OverlayKey);
                        }}>
                        <View style={styles.close}>
                            <Iconfont name={'guanbi1'} color={'#FFF'} size={30} />
                        </View>
                    </TouchFeedback>
                </View>
            </Overlay.View>
        );
        this.OverlayKey = Overlay.show(overlayView);
    }

    static hide() {
        Overlay.hide(this.OverlayKey);
    }
}

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
        borderRadius: pixel(6),
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    title: {
        fontSize: font(17),
        color: '#000',
    },

    appInfo: {
        fontSize: font(13),
        color: Theme.subTextColor,
        marginTop: pixel(3),
    },
    intro: {
        marginVertical: pixel(20),
        paddingHorizontal: pixel(25),
    },
    icon: {
        width: pixel(58),
        height: pixel(58),
        borderRadius: pixel(5),
    },
    text: {
        lineHeight: font(22),
        color: Theme.subTextColor,
        paddingTop: pixel(6),
        fontSize: font(15),
    },
    close: {
        width: pixel(42),
        height: pixel(42),
        borderRadius: pixel(29),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: pixel(1),
    },
});

export default DownloadApkIntro;
