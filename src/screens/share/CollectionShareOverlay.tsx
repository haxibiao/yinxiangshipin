import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { Overlay } from 'teaset';
import { TouchFeedback } from '@src/components';
import { Share } from '@src/native';
import * as WeChat from 'react-native-wechat-lib';
import viewShotUtil from './viewShotUtil';

class CollectionShareOverlay {
    static show(imageUrl, collection) {
        let overlayView = (
            <Overlay.View animated style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
                <View
                    style={{
                        borderTopLeftRadius: pixel(12),
                        borderTopRightRadius: pixel(12),
                        backgroundColor: '#FFF',
                        paddingBottom: Theme.HOME_INDICATOR_HEIGHT - 10 || 0,
                    }}>
                    <View style={styles.top}>
                        <TouchFeedback
                            onPress={async () => {
                                CollectionShareOverlay.hide();
                                console.log('result ', imageUrl);
                                if (Device.IOS) {
                                    ShareIOS.open({
                                        title: '分享给朋友',
                                        url: imageUrl,
                                    });
                                    return;
                                }
                                try {
                                    await WeChat.shareWebpage({
                                        title: '我在印象视频发现一个有意思的东西，快来看看吧',
                                        description: collection.description,
                                        webpageUrl: imageUrl,
                                        thumbImageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
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
                                CollectionShareOverlay.hide();
                                if (Device.IOS) {
                                    ShareIOS.open({
                                        title: '分享给朋友',
                                        url: imageUrl,
                                    });
                                    return;
                                }
                                try {
                                    await WeChat.shareWebpage({
                                        title: collection.name,
                                        description: collection.description,
                                        webpageUrl: imageUrl,
                                        thumbImageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
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
                            onPress={() => {
                                CollectionShareOverlay.hide();
                                ShareIOS.open({
                                    title: '分享给朋友',
                                    url: imageUrl,
                                });
                                return;
                                // let callback = await Share.shareImageToQQ(result);
                                // if (callback == false) {
                                //     Toast.show({
                                //         content: '请先安装QQ客户端',
                                //     });
                                // }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('@app/assets/images/share_qq.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ好友</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={() => {
                                CollectionShareOverlay.hide();
                                ShareIOS.open({
                                    title: '分享给朋友',
                                    url: imageUrl,
                                });
                                // let callback = await Share.shareToSinaFriends(result);
                                // if (callback == false) {
                                //     Toast.show({
                                //         content: '请先安装微博客户端',
                                //     });
                                // }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('@app/assets/images/share_wb.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微博</Text>
                        </TouchFeedback>
                        <TouchFeedback
                            onPress={() => {
                                CollectionShareOverlay.hide();
                                ShareIOS.open({
                                    title: '分享给朋友',
                                    url: imageUrl,
                                });
                                return;
                                // let callback = await Share.shareImageToQQZone(result);
                                // if (callback == false) {
                                //     Toast.show({
                                //         content: '请先安装QQ空间客户端',
                                //     });
                                // }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image source={require('@app/assets/images/share_qqz.png')} style={styles.imageStyle} />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ空间</Text>
                        </TouchFeedback>
                    </View>
                    <TouchFeedback
                        style={styles.closeItem}
                        onPress={() => {
                            CollectionShareOverlay.hide();
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

export default CollectionShareOverlay;
