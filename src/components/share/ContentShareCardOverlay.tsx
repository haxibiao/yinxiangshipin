import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Overlay } from 'teaset';
import { Share } from '@src/native';
import * as WeChat from 'react-native-wechat-lib';
import viewShotUtil from './viewShotUtil';
import ContentShareCard from './ContentShareCard';

class ContentShareCardOverlay {
    static shareCardRef;

    static show(post) {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.container}>
                    <ContentShareCard post={post} ref={(ref) => (this.shareCardRef = ref)} />
                    <View style={styles.bottomOperation}>
                        <View style={styles.sharePlatforms}>
                            <TouchableOpacity
                                style={styles.shareButton}
                                onPress={async () => {
                                    this.hide();
                                    const image = await this.shareCardRef.onCapture(true);
                                    viewShotUtil.saveImage(image, true);
                                }}>
                                <Image
                                    source={require('@app/assets/images/icons/ic_download.png')}
                                    style={styles.imageStyle}
                                />

                                <Text style={styles.shareName}>保存至本地</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    this.hide();
                                    try {
                                        WeChat.shareImage({
                                            type: 'imageFile',
                                            title: '我在印象视频发现一个有意思的东西，快来看看吧',
                                            description: post.description,
                                            imageUrl: image,
                                            scene: 0,
                                        });
                                    } catch (e) {
                                        Toast.show({
                                            content: '未安装微信或当前微信版本较低',
                                        });
                                    }
                                }}
                                style={styles.shareButton}>
                                <Image
                                    source={require('@app/assets/images/share/share_wx.png')}
                                    style={styles.imageStyle}
                                />

                                <Text style={styles.shareName}>微信好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    this.hide();
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
                                style={styles.shareButton}>
                                <Image
                                    source={require('@app/assets/images/share/share_pyq.png')}
                                    style={styles.imageStyle}
                                />
                                <Text style={styles.shareName}>朋友圈</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    this.hide();
                                    let callback = await Share.shareImageToQQ(result);
                                    if (callback == false) {
                                        Toast.show({
                                            content: '请先安装QQ客户端',
                                        });
                                    }
                                }}
                                style={styles.shareButton}>
                                <Image
                                    source={require('@app/assets/images/share/share_qq.png')}
                                    style={styles.imageStyle}
                                />
                                <Text style={styles.shareName}>QQ好友</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    this.hide();
                                    let callback = await Share.shareToSinaFriends(result);
                                    if (callback == false) {
                                        Toast.show({
                                            content: '请先安装微博客户端',
                                        });
                                    }
                                }}
                                style={styles.shareButton}>
                                <Image
                                    source={require('@app/assets/images/share/share_wb.png')}
                                    style={styles.imageStyle}
                                />
                                <Text style={styles.shareName}>微博</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    this.hide();
                                    let callback = await Share.shareImageToQQZone(result);
                                    if (callback == false) {
                                        Toast.show({
                                            content: '请先安装QQ空间客户端',
                                        });
                                    }
                                }}
                                style={styles.shareButton}>
                                <Image
                                    source={require('@app/assets/images/share/share_qqz.png')}
                                    style={styles.imageStyle}
                                />
                                <Text style={styles.shareName}>QQ空间</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.closeBar}
                            onPress={() => {
                                this.hide();
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
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bottomOperation: {
        marginTop: pixel(20),
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        padding: pixel(10),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT ? pixel(30) : pixel(10),
    },
    sharePlatforms: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    shareButton: {
        paddingTop: pixel(10),
        paddingHorizontal: pixel(5),
        marginBottom: pixel(10),
        alignItems: 'center',
    },
    imageStyle: {
        width: pixel(48),
        height: pixel(48),
        borderRadius: pixel(24),
        marginBottom: pixel(10),
    },
    shareName: { color: '#2b2b2b', fontSize: font(12) },
    closeBar: {
        height: pixel(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: pixel(15),
        color: '#2b2b2b',
    },
});

export default ContentShareCardOverlay;
