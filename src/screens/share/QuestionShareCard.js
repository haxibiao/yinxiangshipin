import React, { Component, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { Avatar } from '@src/components';
import { BoxShadow } from 'react-native-shadow';
import QRCode from 'react-native-qrcode-svg';
import { userStore } from '@src/store';
import viewShotUtil from './viewShotUtil';

const marginWidth = pixel(40);
const contentWidth = Device.WIDTH - marginWidth * 2;
const imageWidth = contentWidth - marginWidth;

const shadowOpt = {
    width: contentWidth,
    color: '#E8E8E8',
    border: pixel(10),
    radius: pixel(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        marginVertical: pixel(20),
    },
};

class QuestionShareCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { post } = this.props;
        const images = post?.images;
        const video = post?.video;

        return (
            <ScrollView style={styles.container}>
                <View style={styles.content} ref={(ref) => (this.shareCard = ref)}>
                    {(video || (images && Array.isArray(images), images.length > 0)) && (
                        <Image
                            source={{
                                uri: video?.cover || images[0]?.url,
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
                                    <Text
                                        style={{
                                            color: '#363636',
                                            fontSize: pixel(18),
                                            fontWeight: 'bold',
                                        }}>
                                        @{post?.user?.name}
                                    </Text>
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
                </View>
            </ScrollView>
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
    container: {
        flex: 1,
    },
    content: {
        width: contentWidth,
        padding: pixel(20),
        marginTop: pixel(30),
        marginHorizontal: marginWidth,
        backgroundColor: '#fff',
    },
    questionBody: {
        marginTop: pixel(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    description: {
        color: '#2b2b2b',
        fontSize: pixel(15),
        lineHeight: pixel(22),
    },
});

export default QuestionShareCard;
