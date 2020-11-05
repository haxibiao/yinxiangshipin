import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Modal, ScrollView } from 'react-native';
import { authNavigate } from '@src/router';
import { observer, autorun, adStore, userStore, notificationStore } from '@src/store';
import Iconfont from '../../../components/Iconfont';
import { DebouncedPressable } from '../../../components/Basic/DebouncedPressable';

const MODAL_WIDTH = Device.WIDTH * 0.84 > pixel(320) ? pixel(320) : Device.WIDTH * 0.84;
const BUTTON_WIDTH = MODAL_WIDTH * 0.66;
const BUTTON_HEIGHT = BUTTON_WIDTH * 0.2;

const sharePlatForm = [
    {
        name: '微信好友',
        image: require('@app/assets/images/share/share_wx.png'),
        callback: () => null,
        // callback: shareToWechat,
    },
    {
        name: '朋友圈',
        image: require('@app/assets/images/share/share_pyq.png'),
        callback: () => null,
        // callback: shareToTimeline,
    },
    {
        name: 'QQ好友',
        image: require('@app/assets/images/share/share_qq.png'),
        callback: () => null,
        // callback: shareToQQ,
    },
    {
        name: '微博',
        image: require('@app/assets/images/share/share_wb.png'),
        callback: () => null,
        // callback: shareToWeiBo,
    },
    {
        name: 'QQ空间',
        image: require('@app/assets/images/share/share_qqz.png'),
        callback: () => null,
        // callback: shareToQQZone,
    },
];

const options = [
    {
        name: '下载',
        image: require('@app/assets/images/operation/more_video_download.png'),
        callback: () => null,
        // callback: downloadVideo,
    },
    {
        name: '复制链接',
        image: require('@app/assets/images/operation/more_links.png'),
        callback: () => null,
        // callback: copyLink,
    },
    {
        name: '分享长图',
        image: require('@app/assets/images/operation/more_large_img.png'),
        callback: () => null,
        // callback: shareCard,
    },
    {
        name: '举报',
        image: require('@app/assets/images/operation/more_report.png'),
        callback: () => null,
        // callback: reportArticle,
    },
    {
        name: '删除',
        image: require('@app/assets/images/operation/more_delete.png'),
        callback: () => null,
        // callback: deleteArticle,
    },
    {
        name: '不感兴趣',
        image: require('@app/assets/images/operation/more_dislike.png'),
        callback: () => null,
        // callback: dislike,
    },
    {
        name: '拉黑',
        image: require('@app/assets/images/operation/more_shield.png'),
        callback: () => null,
        // callback: shield,
    },
    {
        name: '分享合集',
        image: require('@app/assets/images/operation/more_content.png'),
        callback: () => null,
        // callback: shareCollection,
    },
];

export const OperationModal = observer(() => {
    const [visible, setVisible] = useState(false);
    const [noticeData, setNoticeData] = useState({});
    const shown = useRef(false);

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
            setNoticeData(data);
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            notificationStore.reduceOperationNotice();
            setVisible(false);
            setNoticeData({});
            shown.current = false;
        }
    }, []);

    useEffect(
        () =>
            autorun(() => {
                if (notificationStore.operationNotice.length > 0) {
                    showModal(notificationStore.operationNotice[0]);
                }
            }),
        [],
    );

    return (
        <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <DebouncedPressable style={{ flex: 1 }} onPress={hideModal} />
                <View style={styles.modalContainer}>
                    {/* <View style={styles.header}>
                            <Text style={styles.headerText}>取消</Text>
                        </View> */}
                    <View style={styles.modalBody}>
                        <ScrollView
                            contentContainerStyle={styles.rowContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {sharePlatForm.map((item: any, index: number) => {
                                return (
                                    <DebouncedPressable
                                        key={index}
                                        style={styles.optionItem}
                                        onPress={() => {
                                            hideModal();
                                            item.callback(noticeData);
                                        }}>
                                        <View style={{ margin: pixel(3) }}>
                                            <Image style={styles.platformIcon} source={item.image} />
                                        </View>
                                        <Text style={styles.optionName}>{item.name}</Text>
                                    </DebouncedPressable>
                                );
                            })}
                        </ScrollView>
                        <ScrollView
                            contentContainerStyle={styles.rowContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {options.map((item: any, index: number) => {
                                return (
                                    <DebouncedPressable
                                        key={index}
                                        style={styles.optionItem}
                                        onPress={() => {
                                            hideModal();
                                            item.callback(noticeData);
                                        }}>
                                        <Image style={styles.optionIcon} source={item.image} />
                                        <Text style={styles.optionName}>{item.name}</Text>
                                    </DebouncedPressable>
                                );
                            })}
                        </ScrollView>
                    </View>
                    <DebouncedPressable style={styles.footer} onPress={hideModal}>
                        <Text style={styles.footerText}>取消</Text>
                    </DebouncedPressable>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
    modalBody: {
        paddingVertical: pixel(12),
    },
    header: {
        alignItems: 'center',
        paddingVertical: pixel(15),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: Theme.borderColor,
    },
    headerText: {
        color: '#212121',
        fontSize: font(17),
        fontWeight: 'bold',
    },
    rowContainer: {
        paddingHorizontal: pixel(6),
    },
    optionItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: Device.WIDTH * 0.22,
        padding: pixel(12),
    },
    platformIcon: {
        height: pixel(50),
        width: pixel(50),
    },
    optionIcon: {
        height: pixel(56),
        width: pixel(56),
    },
    optionName: {
        color: '#212121',
        fontSize: font(12),
        marginTop: pixel(8),
    },
    footer: {
        alignItems: 'center',
        paddingVertical: pixel(15),
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: Theme.borderColor,
    },
    footerText: {
        color: '#212121',
        fontSize: font(16),
    },
});
