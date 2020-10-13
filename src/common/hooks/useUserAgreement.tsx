import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { Overlay } from 'teaset';
import { Storage, userStore } from '@src/store';
const UserAgreementGuide = 'UserAgreementGuide' + Config.Version;

export const useUserAgreement = () => {
    const backListener = useRef();
    const OverlayKey = useRef();
    const isAgreed = useRef(true);

    const hideOverlay = useCallback(() => {
        if (OverlayKey.current) {
            Overlay.hide(OverlayKey.current);
            OverlayKey.current = null;
        }
    }, []);

    const showOverlay = useCallback(() => {
        if (!isAgreed.current && !OverlayKey.current) {
            OverlayKey.current = Overlay.show(
                <Overlay.View animated={false} modal={true} overlayOpacity={0.1}>
                    {content}
                </Overlay.View>,
            );
        }
    }, []);

    const addBackListener = useCallback(() => {
        if (Device.Android && !isAgreed.current && OverlayKey.current) {
            backListener.current = BackHandler.addEventListener('hardwareBackPress', () => {
                return true;
            });
        }
    }, []);

    useEffect(() => {
        (async function () {
            isAgreed.current = await Storage.getItem(UserAgreementGuide);
            addBackListener();
            showOverlay();
        })();
    }, []);

    const removeBackListener = useCallback(() => {
        if (Device.Android && backListener.current) {
            backListener.current.remove();
        }
    }, []);

    const agreement = useCallback(() => {
        isAgreed.current = true;
        userStore.me.agreement = true;
        hideOverlay();
        removeBackListener();
        Storage.setItem(UserAgreementGuide, JSON.stringify({}));
    }, []);

    const content = useMemo(() => {
        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    <ScrollView contentContainerStyle={styles.agreementContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>个人信息保护指引</Text>
                        <View>
                            <Text style={styles.tintFont}>感谢您的信任和支持：</Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                &nbsp;&nbsp;&nbsp;&nbsp;1.我们会遵循隐私政策收集、使用信息，但不会仅因同意本隐私政策而采取强制捆绑的方式收集信息。
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                &nbsp;&nbsp;&nbsp;&nbsp;2.在仅浏览时，为保障服务所必需，我们会收集设备信息与日志信息用于视频和信息推送。
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                &nbsp;&nbsp;&nbsp;&nbsp;3.GPS、摄像头、麦克风、相册权限均不会默认开启，只有经过明示授权才会在为实现功能或服务时使用，不会在功能或服务不需要时而通过您授权的权限收集信息。
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                &nbsp;&nbsp;&nbsp;&nbsp;4.您在使用{Config.AppName}
                                时应自觉遵守法律法规、维护国家利益、社会公共秩序等“七条底线”要求。
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                &nbsp;&nbsp;&nbsp;&nbsp;您可以前往App中的设置=>其它查看完整的 《用户协议》和
                                《隐私政策》
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                &nbsp;&nbsp;&nbsp;&nbsp;如果您同意协议请点击下方按钮接受我们的服务，我们将竭尽全力保护您的个人信息和合法权益。
                            </Text>
                        </View>
                    </ScrollView>
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.bottomBtn} onPress={agreement}>
                            <Text style={{ color: Theme.primaryColor, fontWeight: 'bold', fontSize: font(16) }}>
                                知道了
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }, []);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    contentView: {
        backgroundColor: '#FFF',
        borderRadius: pixel(10),
        overflow: 'hidden',
        height: Device.WIDTH,
        width: Device.WIDTH * 0.8,
    },
    footer: {
        height: pixel(46),
        backgroundColor: '#FFF',
        borderColor: '#EAEAEA',
        borderTopWidth: pixel(0.5),
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    bottomBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    agreementContent: {
        flexGrow: 1,
        backgroundColor: '#FFF',
        padding: pixel(Theme.itemSpace),
    },
    title: {
        color: '#212121',
        fontSize: font(16),
        fontWeight: 'bold',
        marginBottom: pixel(10),
        textAlign: 'center',
    },
    tintFont: {
        color: '#969696',
        fontSize: font(15),
        lineHeight: font(22),
        marginVertical: pixel(2),
    },
    link: {
        color: '#00B1FE',
        fontSize: font(15),
        lineHeight: font(20),
    },
});
