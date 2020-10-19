import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Overlay } from 'teaset';
import { Share } from '@src/native';
import * as WeChat from 'react-native-wechat-lib';
import viewShotUtil from './viewShotUtil';
import QuestionShareCard from './QuestionShareCard';

class QuestionShareCardOverlay {
    static show(image, post) {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <QuestionShareCard post={post} />
                    <View
                        style={{
                            backgroundColor: '#FFF',
                            paddingBottom: Theme.HOME_INDICATOR_HEIGHT ? pixel(30) : pixel(5),
                        }}>
                        <View style={styles.sharePlatforms}>
                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={async () => {
                                    QuestionShareCardOverlay.hide();
                                    await viewShotUtil.saveImage(image, true);
                                }}>
                                <Image
                                    source={require('@app/assets/images/icons/ic_download.png')}
                                    style={styles.imageStyle}
                                />

                                <Text style={{ color: Theme.grey, fontSize: 12 }}>保存至本地</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
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
                                <Image
                                    source={require('@app/assets/images/share/share_wx.png')}
                                    style={styles.imageStyle}
                                />

                                <Text style={{ color: Theme.grey, fontSize: 12 }}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
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
                                <Image
                                    source={require('@app/assets/images/share/share_pyq.png')}
                                    style={styles.imageStyle}
                                />
                                <Text style={{ color: Theme.grey, fontSize: 12 }}>朋友圈</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
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
                                <Image
                                    source={require('@app/assets/images/share/share_qq.png')}
                                    style={styles.imageStyle}
                                />
                                <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
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
                                <Image
                                    source={require('@app/assets/images/share/share_wb.png')}
                                    style={styles.imageStyle}
                                />
                                <Text style={{ color: Theme.grey, fontSize: 12 }}>微博</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
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
                                QuestionShareCardOverlay.hide();
                            }}>
                            <Text style={styles.closeText}>取消</Text>
                        </TouchableOpacity>
                    </View>
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
        justifyContent: 'flex-end',
    },
    sharePlatforms: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: pixel(Theme.itemSpace),
        paddingHorizontal: pixel(Theme.itemSpace),
    },
    imageStyle: {
        width: pixel(44),
        height: pixel(44),
        borderRadius: pixel(22),
        marginBottom: pixel(10),
    },
    closeText: {
        fontSize: pixel(15),
        color: Theme.confirmColor,
        textAlign: 'center',
    },
    closeItem: {
        height: pixel(40),
        borderRadius: pixel(6),
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
});

export default QuestionShareCardOverlay;
