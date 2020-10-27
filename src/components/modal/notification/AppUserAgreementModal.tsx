import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal, ScrollView, BackHandler } from 'react-native';
import { observer, Storage, appStore, userStore, notificationStore } from '@src/store';
import { GQL, useApolloClient } from '@src/apollo';
import { authNavigate } from '@src/router';
import { DebouncedPressable } from '../../../components/Basic/DebouncedPressable';
import Iconfont from '../../../components/Iconfont';

const UserAgreementGuide = 'UserAgreementGuide' + Config.Version;
const MODAL_WIDTH = Device.WIDTH * 0.82 > pixel(300) ? pixel(300) : Device.WIDTH * 0.82;

// 用户协议
export const AppUserAgreementModal = observer(() => {
    const shown = useRef(false);
    const [visible, setVisible] = useState(false);
    const isAgreed = useRef(true);

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            setVisible(false);
            shown.current = false;
        }
    }, []);

    // const backListener = useRef();
    // const addBackListener = useCallback(() => {
    //     if (Device.Android && !isAgreed.current) {
    //         backListener.current = BackHandler.addEventListener('hardwareBackPress', () => {
    //             return true;
    //         });
    //     }
    // }, []);

    // const removeBackListener = useCallback(() => {
    //     if (Device.Android && backListener.current) {
    //         backListener.current.remove();
    //     }
    // }, []);

    const agreement = useCallback(() => {
        appStore.guides.UserAgreementGuide = isAgreed.current = true;
        Storage.setItem(UserAgreementGuide, JSON.stringify({}));
        hideModal();
    }, []);

    useEffect(() => {
        (async function () {
            isAgreed.current = await Storage.getItem(UserAgreementGuide);
            appStore.guides.UserAgreementGuide = isAgreed.current;
            if (!isAgreed.current) {
                showModal();
            }
        })();
    }, []);

    return (
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
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
                        <DebouncedPressable style={styles.bottomBtn} onPress={agreement}>
                            <Text style={styles.bottomBtnText}>知道了</Text>
                        </DebouncedPressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
        width: MODAL_WIDTH,
        height: MODAL_WIDTH * 1.35,
        borderRadius: pixel(5),
        overflow: 'hidden',
    },
    modalContent: {
        flexGrow: 1,
        backgroundColor: '#FFF',
        padding: pixel(15),
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
    footer: {
        height: pixel(46),
        backgroundColor: '#FFF',
        borderColor: '#EAEAEA',
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    bottomBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBtnText: {
        color: Theme.primaryColor,
        fontWeight: 'bold',
        fontSize: font(16),
    },
});
