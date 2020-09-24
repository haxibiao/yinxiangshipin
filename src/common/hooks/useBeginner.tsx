import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { SafeText } from '@src/components';
import { Overlay } from 'teaset';
import { Storage } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
const UserAgreementGuide = 'UserAgreementGuide' + Config.Version;

export const useBeginner = () => {
    const backListener = useRef();
    const OverlayKey = useRef();
    const isAgreed = useRef(true);
    const navigation = useNavigation();

    useEffect(() => {
        (async function () {
            isAgreed.current = await Storage.getItem(UserAgreementGuide);
            addBackListener();
            onFocus();
        })();
    }, []);

    const addBackListener = useCallback(() => {
        if (Device.Android && !isAgreed.current && OverlayKey.current) {
            backListener.current = BackHandler.addEventListener('hardwareBackPress', () => {
                return true;
            });
        }
    }, []);

    const removeBackListener = useCallback(() => {
        if (Device.Android && backListener.current) {
            backListener.current.remove();
        }
    }, []);

    const navigate = useCallback((routeName) => {
        onBlur();
        removeBackListener();
        navigation.navigate(routeName);
    }, []);

    const agreement = useCallback(() => {
        isAgreed.current = true;
        onBlur();
        removeBackListener();
        Storage.setItem(UserAgreementGuide, JSON.stringify({}));
    }, []);

    const refused = useCallback(() => {
        onBlur();
        removeBackListener();
        BackHandler.exitApp();
    }, []);

    const content = useMemo(() => {
        return (
            <View style={styles.container}>
                <View style={styles.contentView}>
                    <ScrollView contentContainerStyle={styles.agreementContent} showsVerticalScrollIndicator={false}>
                        <SafeText style={styles.title}>个人信息保护指引</SafeText>
                        <View>
                            <Text style={styles.tintFont}>感谢您信任并使用{Config.AppName}</Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                1.我们会遵循隐私政策收集、使用信息，但不会仅因同意本隐私政策而采取强制捆绑的方式收集信息；
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                2.在仅浏览时，为保障服务所必需，我们会收集设备信息与日志信息用于视频和信息推送；
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                3.GPS、摄像头、麦克风、相册权限均不会默认开启，只有经过明示授权才会在为实现功能或服务时使用，不会在功能或服务不需要时而通过您授权的权限收集信息。
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>
                                你可以查看完整版
                                <Text style={styles.link} activeOpacity={0.8} onPress={() => navigate('UserProtocol')}>
                                    <Text>{`《${Config.AppName}用户协议》`}</Text>
                                </Text>
                                和
                                <Text style={styles.link} activeOpacity={0.8} onPress={() => navigate('PrivacyPolicy')}>
                                    <Text>{`《${Config.AppName}隐私政策》`}</Text>
                                </Text>
                                。我们将竭尽全力保护您的个人信息和合法权益，再次感谢您的信任。
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.tintFont}>如果你同意请点击下面的按钮以接受我们的服务。</Text>
                        </View>
                    </ScrollView>
                    <View style={styles.footer}>
                        {/* <TouchableOpacity
                            style={[styles.bottomBtn, { borderColor: '#EAEAEA', borderRightWidth: pixel(0.5) }]}
                            onPress={refused}>
                            <SafeText style={{ marginRight: 5, color: '#191919', fontWeight: 'bold' }}>不同意</SafeText>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.bottomBtn} onPress={agreement}>
                            <SafeText style={{ marginRight: 5, color: Theme.primaryColor, fontWeight: 'bold' }}>
                                知道了
                            </SafeText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }, []);

    const onFocus = useCallback(() => {
        if (!isAgreed.current && !OverlayKey.current) {
            OverlayKey.current = Overlay.show(
                <Overlay.View animated={false} modal={true} overlayOpacity={0.1}>
                    {content}
                </Overlay.View>,
            );
        }
    }, []);

    const onBlur = useCallback(() => {
        if (OverlayKey.current) {
            Overlay.hide(OverlayKey.current);
            OverlayKey.current = null;
        }
    }, []);

    useEffect(() => {
        const navFocusListener = navigation.addListener('focus', () => {
            onFocus();
            addBackListener();
        });
        return () => {
            navFocusListener();
        };
    }, [onFocus]);
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
