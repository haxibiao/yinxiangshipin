'use strict';

import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { Overlay } from 'teaset';
import { TouchFeedback } from '@src/components';
import { Share } from '@src/native';
import * as WeChat from 'react-native-wechat-lib';
import viewShotUtil from './viewShotUtil';
import QuestionShareCard from './QuestionShareCard';

class QuestionShareCardOverlay {
    static show(image, post) {
        let overlayView = (
            <Overlay.View animated>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ height: 25 }} />
                    <QuestionShareCard post={post} ref={(ref) => (this._shareCard = ref)} />
                </ScrollView>
                <View style={{ backgroundColor: '#FFF' }}>
                    <View style={styles.top}>
                        <TouchFeedback
                            style={{ alignItems: 'center' }}
                            onPress={async () => {
                                QuestionShareCardOverlay.hide();
                                await viewShotUtil.saveImage(image, true);
                            }}>
                            <Image
                                source={require('@app/assets/images/more_video_download.png')}
                                style={styles.imageStyle}
                            />

                            <Text style={{ color: Theme.grey, fontSize: 12 }}>保存至本地</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                QuestionShareCardOverlay.hide();
                                console.log('result ', image);
                                try {
                                    WeChat.shareImage({
                                        type: 'imageFile',
                                        title: '我在印象视频发现一个有意思的东西，快来看看吧',
                                        description: post.description,
                                        imageUrl: image,
                                        scene: 0,
                                    });
                                } catch (e) {
                                    console.log('e', e);
                                    Toast.show({
                                        content: '未安装微信或当前微信版本较低',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('@app/assets/images/share_wx.png')} style={styles.imageStyle} />

                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微信好友</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                QuestionShareCardOverlay.hide();
                                try {
                                    await WeChat.shareImage({
                                        type: 'imageFile',
                                        title: '我在印象视频发现一个有意思的东西，快来看看吧',
                                        description: post.description,
                                        imageUrl: image,
                                        scene: 1,
                                    });
                                } catch (e) {
                                    Toast.show({
                                        content: '未安装微信或当前微信版本较低',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('@app/assets/images/share_pyq.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>朋友圈</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                QuestionShareCardOverlay.hide();
                                let callback = await Share.shareImageToQQ(result);
                                if (callback == false) {
                                    Toast.show({
                                        content: '请先安装QQ客户端',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('@app/assets/images/share_qq.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ好友</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                QuestionShareCardOverlay.hide();
                                let callback = await Share.shareToSinaFriends(result);
                                if (callback == false) {
                                    Toast.show({
                                        content: '请先安装微博客户端',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('@app/assets/images/share_wb.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微博</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={async () => {
                                QuestionShareCardOverlay.hide();
                                let callback = await Share.shareImageToQQZone(result);
                                if (callback == false) {
                                    Toast.show({
                                        content: '请先安装QQ空间客户端',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('@app/assets/images/share_qqz.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ空间</Text>
                        </TouchFeedback>
                    </View>
                    <TouchFeedback
                        style={styles.closeItem}
                        onPress={() => {
                            QuestionShareCardOverlay.hide();
                        }}>
                        <Text style={styles.headerText}>取消</Text>
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
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: pixel(Theme.itemSpace),
    },
    imageStyle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginBottom: 10,
    },
    headerText: {
        fontSize: pixel(15),
        color: Theme.confirmColor,
        textAlign: 'center',
    },
    closeItem: {
        height: pixel(40),
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: pixel(6),
    },
});

export default QuestionShareCardOverlay;
