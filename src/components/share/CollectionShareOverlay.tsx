import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Overlay } from 'teaset';
import { Share } from '@src/native';
import * as WeChat from 'react-native-wechat-lib';
import ShareIOS from 'react-native-share';
import viewShotUtil from './viewShotUtil';

class CollectionShareOverlay {
    static show(shareLink, pageUrl, collection) {
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
                        <TouchableOpacity
                            onPress={async () => {
                                CollectionShareOverlay.hide();
                                console.log('result ', pageUrl);
                                if (Device.IOS) {
                                    ShareIOS.open({
                                        title: '分享给朋友',
                                        url: pageUrl,
                                    });
                                    return;
                                }
                                try {
                                    await WeChat.shareWebpage({
                                        title: '我在印象视频发现一个有意思的东西，快来看看吧',
                                        description: `${collection.name}：${collection.description}`,
                                        webpageUrl: pageUrl,
                                        thumbImageUrl: collection.logo,
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
                            <Image
                                source={require('@app/assets/images/share/share_wx.png')}
                                style={styles.imageStyle}
                            />

                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微信好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => {
                                CollectionShareOverlay.hide();
                                if (Device.IOS) {
                                    ShareIOS.open({
                                        title: '分享给朋友',
                                        url: pageUrl,
                                    });
                                    return;
                                }
                                try {
                                    await WeChat.shareWebpage({
                                        title: collection.name,
                                        description: collection.description,
                                        webpageUrl: pageUrl,
                                        thumbImageUrl: collection.logo,
                                        scene: 1,
                                    });
                                } catch (e) {
                                    Toast.show({
                                        content: '未安装微信或当前微信版本较低',
                                    });
                                }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image
                                source={require('@app/assets/images/share/share_pyq.png')}
                                style={styles.imageStyle}
                            />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>朋友圈</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                CollectionShareOverlay.hide();
                                ShareIOS.open({
                                    title: '分享给朋友',
                                    url: shareLink,
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
                            <Image
                                source={require('@app/assets/images/share/share_qq.png')}
                                style={styles.imageStyle}
                            />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ好友</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                CollectionShareOverlay.hide();
                                ShareIOS.open({
                                    title: '分享给朋友',
                                    url: shareLink,
                                });
                                // let callback = await Share.shareToSinaFriends(result);
                                // if (callback == false) {
                                //     Toast.show({
                                //         content: '请先安装微博客户端',
                                //     });
                                // }
                            }}
                            style={{ alignItems: 'center' }}>
                            <Image
                                source={require('@app/assets/images/share/share_wb.png')}
                                style={styles.imageStyle}
                            />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>微博</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                CollectionShareOverlay.hide();
                                ShareIOS.open({
                                    title: '分享给朋友',
                                    url: shareLink,
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
                            <Image
                                source={require('@app/assets/images/share/share_qqz.png')}
                                style={styles.imageStyle}
                            />
                            <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ空间</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.closeItem}
                        onPress={() => {
                            CollectionShareOverlay.hide();
                        }}>
                        <Text style={styles.headerText}>取消</Text>
                    </TouchableOpacity>
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
