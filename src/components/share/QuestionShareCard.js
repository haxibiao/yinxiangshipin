import React, { Component, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import Avatar from '../Basic/Avatar';
import SafeText from '../Basic/SafeText';
import QRCode from 'react-native-qrcode-svg';
import { userStore } from '@src/store';
import viewShotUtil from './viewShotUtil';

const contentWidth = Device.WIDTH * 0.76;
const contentHeight = (contentWidth * 1040) / 1450;
const imageWidth = contentWidth * 0.5;

class QuestionShareCard extends Component {
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
                                }}>
                                <Avatar
                                    source={{ uri: post?.user?.avatar }}
                                    size={pixel(40)}
                                    style={{ backgroundColor: '#b2b2b2' }}
                                />
                                <View style={{ marginLeft: pixel(15) }}>
                                    <SafeText
                                        style={{
                                            color: '#363636',
                                            fontSize: pixel(18),
                                            fontWeight: 'bold',
                                        }}>
                                        @{post?.user?.name}
                                    </SafeText>
                                </View>
                            </View>
                            <Text
                                style={{ color: '#363636', fontSize: pixel(15), lineHeight: pixel(22) }}
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
                        <Text style={styles.bottomText}>保存长图到手机，打开印象视频App可查看内容详情</Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    onCapture = async (isShow) => {
        let image = await viewShotUtil.capture(this.shareCard);
        // let result = await viewShotUtil.saveImage(image, isShow);
        console.log('Api.viewShotUtil.saveImage(image);', image);
        // this.props.navigation.goBack();
        return image;
    };
}

function correctRate(correct, count) {
    if (typeof correct === 'number' && typeof count === 'number') {
        let result = (correct / count) * 100;
        if (result) {
            return result.toFixed(1) + '%';
        }
        return '0';
    }
}

const styles = StyleSheet.create({
    container: {},
    contentCover: {
        width: contentWidth,
        height: contentHeight,
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
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
        backgroundColor: '#f0f0f0',
        paddingHorizontal: pixel(15),
        paddingVertical: pixel(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomText: {
        color: '#b2b2b2',
        fontSize: pixel(15),
    },
});

export default QuestionShareCard;
