import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from '@src/router';
import Iconfont from '../Iconfont';
import { observer, Provider, inject } from 'mobx-react';
import { appStore } from '@src/store';

import Slider from '@react-native-community/slider';

@observer
class VideoControl extends Component {
    render() {
        let {
            sliderMoveing,
            sliderValue,
            showControl,
            currentTime,
            duration,
            paused,
            onSliderValueChanged,
            onSlidingComplete,
            playButtonHandler,
            onFullScreen,
        } = this.props.videoStore;
        let { isFullScreen } = appStore;

        if (!showControl) {
            return null;
        }

        console.log('isFullScreen', isFullScreen);
        return (
            <View style={styles.videoControl}>
                {!isFullScreen && (
                    <View style={styles.headerControl}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                console.log('video play control go back...');
                                this.props.navigation.goBack();
                            }}>
                            <Iconfont name="zuojiantou" size={pixel(22)} color="#fff" />
                        </TouchableWithoutFeedback>
                    </View>
                )}

                <TouchableWithoutFeedback style={styles.pauseMark} onPress={playButtonHandler}>
                    <View style={{ padding: pixel(20) }}>
                        <Iconfont name={paused ? 'bofang1' : 'zanting'} size={pixel(40)} color="#fff" />
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.bottomControl}>
                    <Text style={styles.timeText}>{Helper.moment(sliderMoveing ? sliderValue : currentTime)}</Text>
                    <Slider
                        style={{ flex: 1, marginHorizontal: pixel(10) }}
                        maximumTrackTintColor="rgba(225,225,225,0.5)" //滑块右侧轨道的颜色
                        minimumTrackTintColor={'#fff'} //滑块左侧轨道的颜色
                        thumbTintColor="#fff"
                        value={sliderMoveing ? sliderValue : currentTime}
                        minimumValue={0}
                        maximumValue={Number(duration)}
                        onValueChange={onSliderValueChanged}
                        onSlidingComplete={onSlidingComplete}
                    />
                    <Text style={styles.timeText}>{Helper.moment(duration)}</Text>
                    <TouchableOpacity activeOpacity={1} onPress={onFullScreen} style={styles.layoutButton}>
                        <Iconfont
                            name={appStore.isFullScreen ? 'cancel-full-screen' : 'quanping'}
                            size={pixel(20)}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    videoControl: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerControl: {
        position: 'absolute',
        top: pixel(30),
        left: pixel(15),
        flexDirection: 'row',
    },
    pauseMark: {
        width: pixel(60),
        height: pixel(60),
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomControl: {
        position: 'absolute',
        left: pixel(20),
        right: pixel(20),
        bottom: pixel(10),
        flexDirection: 'row',
        alignItems: 'center',
    },
    layoutButton: {
        marginLeft: pixel(10),
        width: pixel(40),
        height: pixel(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: font(12),
        color: '#fff',
    },
});

export default VideoControl;
