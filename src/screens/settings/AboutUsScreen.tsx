/*
 * @flow
 * created by wyk made in 2019-03-21 14:13:47
 */

import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { PageContainer, SafeText } from '@src/components';
export default function AboutUs() {
    return (
        <PageContainer title={'关于' + Config.AppName} white>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' }}>
                    <View style={{ marginTop: pixel(30) }}>
                        <View style={{ alignItems: 'center', paddingVertical: pixel(15) }}>
                            <Image
                                source={require('@app/Logo.png')}
                                style={{
                                    width: pixel(150),
                                    height: pixel(150),
                                    borderRadius: pixel(10),
                                }}
                            />
                            <Text style={styles.AppVersion}>
                                {Config.AppName} {Config.Version}
                            </Text>
                        </View>
                        <View style={{ paddingHorizontal: pixel(20) }}>
                            <Text style={styles.sectionTitle}>关于{Config.AppName}</Text>
                            <SafeText style={styles.appIntro}>
                                {Config.AppName}
                                是一款集健康小知识，
                                休闲短视频于一身的健康科普软件。视频内容将不断更新，让您不停获取到最新的健康小知识，每天完成任务还能不断获得收益哦！在等朋友，等公交，等开饭等闲暇之余，玩
                                {Config.AppName}
                                获得乐趣，健康知识的同时还能够赚点金币，
                                {Config.AppName}
                                是您killtime的最佳搭档。如果您想要获得各类健康知识就来印象视频吧，娱乐，健康，冷门知识科普应有尽有。
                            </SafeText>
                        </View>

                        <View style={{ marginTop: pixel(30) }}>
                            <View style={{ paddingHorizontal: pixel(20) }}>
                                <Text style={styles.sectionTitle}>联系我们</Text>
                                {/* <Text style={{ fontSize: font(13), color: Theme.subTextColor, marginTop: 15 }}>QQ交流群: 4337413</Text>*/}
                                <Text style={styles.officialText}>官网地址： {Config.PackageName}.com</Text>
                                <Text style={styles.officialText}>商务合作： db@{Config.PackageName}.com</Text>
                                <Text style={styles.officialText}>新浪微博： 印象视频</Text>
                                <Text style={styles.officialText}>官方QQ群： 1036821462</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.copyright}>
                        <Text>近邻乐(深圳)有限责任公司</Text>
                        <Text>www.{Config.PackageName}.com</Text>
                    </View>
                </View>
            </ScrollView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    AppVersion: { color: Theme.defaultTextColor, fontSize: font(15), margin: pixel(20) },
    appIntro: {
        color: Theme.subTextColor,
        fontSize: font(13),
        fontWeight: '300',
        lineHeight: font(18),
        marginTop: pixel(15),
    },
    container: {
        backgroundColor: Theme.white || '#FFF',
        flexGrow: 1,
        paddingBottom: Device.bottomInset || pixel(15),
    },
    copyright: {
        alignItems: 'center',
        paddingTop: pixel(15),
    },
    officialText: { color: Theme.subTextColor, fontSize: font(13), marginTop: pixel(10) },
    sectionTitle: { color: Theme.defaultTextColor, fontSize: font(15) },
});
