import React, { Component, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import Avatar from '../Basic/Avatar';
import SafeText from '../Basic/SafeText';
import QRCode from 'react-native-qrcode-svg';
import { userStore } from '@src/store';
import viewShotUtil from './viewShotUtil';

const contentWidth = Device.WIDTH * 0.76;
const contentHeight = (contentWidth * 1450) / 1040;
const imageWidth = contentWidth * 0.5;

class ContentShareCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { post } = this.props;
        const imageUri = post?.video?.cover || post?.images?.[0]?.url;
        return (
            <View style={styles.container} ref={(ref) => (this.shareCard = ref)}>
                <ImageBackground
                    style={styles.contentCover}
                    source={require('@app/assets/images/capture_video_cover.png')}>
                    {imageUri && (
                        <Image
                            source={{
                                uri: imageUri,
                            }}
                            style={{
                                width: imageWidth,
                                height: (imageWidth * 4) / 3,
                            }}
                        />
                    )}
                    <View style={styles.questionBody}>
                        <View style={{ flex: 1, overflow: 'hidden', marginRight: pixel(10) }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: pixel(5),
                                }}>
                                <Avatar
                                    source={{ uri: post?.user?.avatar }}
                                    size={pixel(32)}
                                    style={{ backgroundColor: '#f0f0f0' }}
                                />
                                <View style={{ marginLeft: pixel(10) }}>
                                    <SafeText
                                        style={{
                                            color: '#2b2b2b',
                                            fontSize: font(15),
                                            fontWeight: 'bold',
                                        }}>
                                        @{post?.user?.name}
                                    </SafeText>
                                </View>
                            </View>
                            <Text
                                style={{ color: '#2b2b2b', fontSize: pixel(14), lineHeight: pixel(22) }}
                                numberOfLines={2}>
                                {post?.description || post?.content}
                            </Text>
                        </View>
                        <View style={{ width: pixel(80), height: pixel(80) }}>
                            <QRCode
                                value={`https://yinxiangshipin.com/share/post/${post?.id}?post_id=${post?.id}&user_id=${userStore?.me?.id}`}
                                size={pixel(80)}
                                color={'#000'}
                                backgroundColor={'#FFF'}
                            />
                        </View>
                    </View>
                    <View style={styles.bottomInfo}>
                        <Text style={styles.bottomText}>保存图片到手机</Text>
                        <Text style={styles.bottomText}>打开印象视频App</Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    onCapture = async () => {
        const image = await viewShotUtil.screenshots(this.shareCard);
        return image;
    };
}

const styles = StyleSheet.create({
    container: {
        width: contentWidth,
        height: contentHeight,
        borderRadius: pixel(2),
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    contentCover: {
        width: contentWidth,
        height: contentHeight,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    questionBody: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pixel(15),
        paddingVertical: pixel(20),
    },
    description: {
        color: '#2b2b2b',
        fontSize: pixel(15),
        lineHeight: pixel(22),
    },
    bottomInfo: {
        alignSelf: 'stretch',
        backgroundColor: '#f6f6f6',
        padding: pixel(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomText: {
        color: '#a1a1a1',
        fontSize: pixel(13),
        lineHeight: pixel(18),
    },
});

export default ContentShareCard;
