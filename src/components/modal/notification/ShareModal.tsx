import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, Modal, ScrollView } from 'react-native';
import { observer, autorun, adStore, userStore, notificationStore } from '@src/store';
import { useOperations } from '@src/apollo';
import { ShareUtil } from '@src/common';
import Iconfont from '../../Iconfont';
import { DebouncedPressable } from '../../Basic/DebouncedPressable';
import ContentShareCard from '../../share/ContentShareCard';
import viewShotUtil from '../../share/viewShotUtil';

const MODAL_WIDTH = Device.width * 0.84 > pixel(320) ? pixel(320) : Device.width * 0.84;
const BUTTON_WIDTH = MODAL_WIDTH * 0.66;
const BUTTON_HEIGHT = BUTTON_WIDTH * 0.2;

const sharePlatForm = [
    {
        name: '微信好友',
        image: require('@app/assets/images/share/share_wx.png'),
        shareContent: ShareUtil.shareToWeChat,
        shareImage: ShareUtil.shareImageToWeChat,
    },
    {
        name: '朋友圈',
        image: require('@app/assets/images/share/share_pyq.png'),
        shareContent: ShareUtil.shareToTimeline,
        shareImage: ShareUtil.shareImageToTimeline,
    },
    {
        name: 'QQ好友',
        image: require('@app/assets/images/share/share_qq.png'),
        shareContent: ShareUtil.shareToQQ,
        shareImage: ShareUtil.shareImageToQQ,
    },
    {
        name: '微博',
        image: require('@app/assets/images/share/share_wb.png'),
        shareContent: ShareUtil.shareToSina,
        shareImage: ShareUtil.shareImageToSina,
    },
    {
        name: 'QQ空间',
        image: require('@app/assets/images/share/share_qqz.png'),
        shareContent: ShareUtil.shareToQQZone,
        shareImage: ShareUtil.shareImageToQQZone,
    },
];

const operationIcon = {
    下载视频: require('@app/assets/images/operation/more_video_download.png'),
    分享合集: require('@app/assets/images/operation/more_content.png'),
    复制链接: require('@app/assets/images/operation/more_links.png'),
    分享长图: require('@app/assets/images/operation/more_large_img.png'),
    保存长图: require('@app/assets/images/operation/more_large_img.png'),
    不感兴趣: require('@app/assets/images/operation/more_dislike.png'),
    举报: require('@app/assets/images/operation/more_report.png'),
    删除: require('@app/assets/images/operation/more_delete.png'),
    拉黑: require('@app/assets/images/operation/more_shield.png'),
};

export const ShareModal = observer(() => {
    const [visible, setVisible] = useState(false);
    const [noticeData, setNoticeData] = useState({});
    const [sharedTargetType, setSharedTargetType] = useState();
    const [imageRef, setImageRef] = useState();
    const shown = useRef(false);
    const cardRef = useRef();

    const showModal = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setVisible(true);
            setNoticeData(data?.target);
            setSharedTargetType(data?.type);
        }
    }, []);

    const hideModal = useCallback(() => {
        if (shown.current) {
            notificationStore.reduceShareNotice();
            setVisible(false);
            setNoticeData({});
            setSharedTargetType('');
            setImageRef();
            shown.current = false;
        }
    }, []);

    useEffect(
        () =>
            autorun(() => {
                if (notificationStore.shareNotice.length > 0) {
                    showModal(notificationStore.shareNotice[0]);
                }
            }),
        [],
    );

    const shareQRCard = useCallback(async () => {
        try {
            const image = await cardRef.current.onCapture();
            if (Platform.OS === 'ios') {
                viewShotUtil.saveImage(image, noticeData?.id);
                hideModal();
            } else {
                setImageRef(image);
            }
        } catch (error) {
            hideModal();
            Toast.show({ content: '保存长图失败' });
        }
    }, [noticeData]);

    const shareCollection = useCallback(async () => {
        const collection = noticeData?.collections?.[0];
        hideModal();
        if (collection) {
            const description = `${collection.name}：${collection.description}`;
            notificationStore.sendShareNotice({ target: { ...collection, description }, type: 'collection' });
        } else {
            Toast.show({ content: '分享合集失败' });
        }
    }, [noticeData]);

    const { copyLink, downloadVideo, deleteArticle, addArticleBlock, addUserBlock } = useOperations(noticeData);

    const showReportModal = useCallback(() => {
        hideModal();
        notificationStore.sendReportNotice({ target: noticeData, type: 'post' });
    }, [noticeData]);

    const operationList = useMemo(() => {
        const result = [
            { name: Platform.OS === 'ios' ? '保存长图' : '分享长图', handler: shareQRCard },
            { name: '复制链接', handler: copyLink },
        ];
        const collection = noticeData?.collections?.[0];
        const videoUrl = noticeData?.video?.url;
        const isSelf = noticeData?.user?.id == userStore.me.id;
        if (isSelf) {
            result.push({ name: '删除', handler: deleteArticle });
        } else {
            result.splice(1, 0, { name: '举报', handler: showReportModal });
            result.splice(2, 0, { name: '不感兴趣', handler: addArticleBlock });
        }
        if (collection) {
            result.unshift({ name: '分享合集', handler: shareCollection });
        }
        if (videoUrl) {
            result.unshift({ name: '下载视频', handler: downloadVideo });
        }
        return result;
    }, [noticeData]);

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={hideModal}
            animated={true}
            transparent={true}
            statusBarTranslucent={true}
            hardwareAccelerated={true}>
            <View style={styles.modalView}>
                <DebouncedPressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={hideModal} />
                {sharedTargetType === 'post' && (
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: Device.width * 0.6,
                            alignItems: 'center',
                            zIndex: imageRef ? 1 : -10,
                            opacity: imageRef ? 1 : 0,
                        }}>
                        <ContentShareCard post={noticeData} ref={cardRef} />
                    </View>
                )}
                <View style={styles.modalContainer}>
                    <View style={styles.modalBody}>
                        <ScrollView
                            contentContainerStyle={styles.rowContainer}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            {imageRef && (
                                <DebouncedPressable
                                    style={styles.optionItem}
                                    onPress={() => {
                                        viewShotUtil.saveImage(imageRef, noticeData?.id);
                                        hideModal();
                                    }}>
                                    <View style={{ margin: pixel(3) }}>
                                        <Image
                                            style={styles.platformIcon}
                                            source={require('@app/assets/images/icons/ic_download.png')}
                                        />
                                    </View>
                                    <Text style={styles.optionName}>保存到本地</Text>
                                </DebouncedPressable>
                            )}
                            {sharePlatForm.map((item: any, index: number) => {
                                return (
                                    <DebouncedPressable
                                        key={index}
                                        style={styles.optionItem}
                                        onPress={() => {
                                            hideModal();
                                            setTimeout(async () => {
                                                if (imageRef) {
                                                    const filePath = await viewShotUtil.saveImage(
                                                        imageRef,
                                                        noticeData?.id,
                                                    );
                                                    item.shareImage(filePath);
                                                } else {
                                                    item.shareContent(noticeData, sharedTargetType);
                                                }
                                            }, 100);
                                        }}>
                                        <View style={{ margin: pixel(3) }}>
                                            <Image style={styles.platformIcon} source={item.image} />
                                        </View>
                                        <Text style={styles.optionName}>{item.name}</Text>
                                    </DebouncedPressable>
                                );
                            })}
                        </ScrollView>
                        {sharedTargetType === 'post' && !imageRef && (
                            <ScrollView
                                contentContainerStyle={styles.rowContainer}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                {operationList.map((item: any, index: number) => {
                                    return (
                                        <DebouncedPressable
                                            key={index}
                                            style={styles.optionItem}
                                            onPress={() => {
                                                if (item.name !== '分享长图' && item.name !== '保存长图') {
                                                    hideModal();
                                                }
                                                item.handler(noticeData);
                                            }}>
                                            <Image style={styles.optionIcon} source={operationIcon[item.name]} />
                                            <Text style={styles.optionName}>{item.name}</Text>
                                        </DebouncedPressable>
                                    );
                                })}
                            </ScrollView>
                        )}
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
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        paddingBottom: pixel(Device.bottomInset),
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
        minWidth: Device.width * 0.22,
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
