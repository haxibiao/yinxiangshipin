import React, { Component, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { Avatar } from '@src/components';
import { BoxShadow } from 'react-native-shadow';
import QRCode from 'react-native-qrcode-svg';
import viewShotUtil from './viewShotUtil';

const shadowOpt = {
    width: Device.WIDTH - pixel(80),
    color: '#E8E8E8',
    border: pixel(10),
    radius: pixel(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        marginVertical: 20,
    },
};

class QuestionShareCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerHeight: 78,
        };
    }
    render() {
        const { post } = this.props;
        const images = post?.images;
        const video = post?.video;

        return (
            <ScrollView style={{ flex: 1 }}>
                <View
                    style={{
                        width: Device.WIDTH - pixel(80),
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: pixel(40),
                        marginVertical: 20,
                        paddingVertical: 15,
                    }}
                    ref={(ref) => (this.shareCard = ref)}>
                    {(video || (images && Array.isArray(images), images.length > 0)) && (
                        <Image
                            source={{
                                uri: video?.cover || images[0]?.url,
                            }}
                            style={{
                                marginTop: pixel(Theme.itemSpace),
                                width: ((Device.WIDTH - pixel(80)) / 4) * 3,
                                height: Device.WIDTH - pixel(80),
                            }}
                        />
                    )}
                    <View style={styles.questionBody}>
                        <View style={{ flex: 1, overflow: 'hidden', marginRight: 10 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#fff',
                                    marginBottom: 10,
                                }}
                                onLayout={(event) => {
                                    this.setState({
                                        headerHeight: event.nativeEvent.layout.height,
                                    });
                                }}>
                                <Avatar source={{ uri: post.user.avatar }} userId={post.user.id} size={40} />
                                <View style={{ marginLeft: 15 }}>
                                    <Text
                                        style={{ color: '#363636', fontSize: 20, lineHeight: 30, fontWeight: 'bold' }}>
                                        @{post.user.name}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ color: '#363636', fontSize: 15, lineHeight: 22 }} numberOfLines={2}>
                                {post.description}
                            </Text>
                        </View>
                        <View style={{ width: pixel(80), height: pixel(80) }}>
                            <QRCode
                                value={`https://yinxiangshipin.com`}
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
    questionBody: {
        marginVertical: 30,
        marginBottom: 50,
        paddingHorizontal: 15,
        paddingVertical: 15,
        // borderRadius: 3,
        backgroundColor: Theme.white,
        width: Device.WIDTH - pixel(80),
        flexDirection: 'row',
        alignItems: 'center',
    },
    description: {
        color: Theme.defaultTextColor,
        fontSize: pixel(15),
        lineHeight: pixel(22),
    },
    questionType: {
        position: 'absolute',
        top: 2,
        left: 0,
        width: pixel(36),
        height: pixel(18),
        borderTopLeftRadius: pixel(9),
        borderBottomRightRadius: pixel(9),
        backgroundColor: Theme.primaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerType: {
        fontSize: pixel(11),
        color: '#fff',
    },
});

export default QuestionShareCard;
