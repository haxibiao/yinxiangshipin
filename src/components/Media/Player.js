import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, BackHandler } from 'react-native';
import Video from 'react-native-video';

import VideoStatus from './VideoStatus';
import VideoControl from './VideoControl';

import { observer, Provider, inject } from 'mobx-react';
import { appStore } from '@src/store';
import VideoStore from './VideoStore';
import Orientation from 'react-native-device-orientation';

@observer
class Player extends Component {
    constructor(props) {
        super(props);
        let { video, inScreen, navigation } = props;
        this.videoStore = new VideoStore({ video, inScreen, navigation });
        this.state = {
            muted: false,
        };
    }

    componentDidMount() {
        let { navigation } = this.props;
        // let BackHandler = ReactNative.BackHandler ? ReactNative.BackHandler : ReactNative.BackAndroid;
        if (Device.Android) {
            BackHandler.addEventListener('hardwareBackPress', this._backButtonPress);
        }
        this.willBlurSubscription = navigation.addListener('blur', (payload) => {
            this.videoStore.paused = true;
        });
    }

    componentWillUnmount() {
        this.willBlurSubscription.remove();
        // 离开固定竖屏
        Orientation.lockToPortrait();
    }

    _backButtonPress = () => {
        if (appStore.isFullScreen) {
            this.videoStore.onFullScreen();
            return true;
        }
        return false;
    };

    render() {
        let { video, style, navigation } = this.props;
        let {
            status,
            orientation,
            paused,
            getVideoRef,
            controlSwitch,
            onAudioBecomingNoisy,
            onAudioFocusChanged,
            loadStart,
            onLoaded,
            onProgressChanged,
            onPlayEnd,
            onPlayError,
        } = this.videoStore;
        return (
            <View
                style={[
                    styles.playContainer,
                    style,
                    appStore.isFullScreen
                        ? {
                              width: Device.WIDTH,
                              height: Device.HEIGHT,
                              marginTop: 0,
                              position: 'absolute',
                              zIndex: 10000,
                          }
                        : styles.defaultSize,
                ]}>
                {status !== 'notWifi' && (
                    <Video
                        style={styles.videoStyle}
                        ref={getVideoRef}
                        source={{
                            uri: video.url,
                        }}
                        // poster={video.cover}
                        rate={1.0}
                        volume={1.0}
                        muted={false}
                        paused={paused}
                        resizeMode={'contain'}
                        disableFocus={true}
                        useTextureView={false}
                        playWhenInactive={false}
                        playInBackground={false}
                        onLoadStart={loadStart} // 当视频开始加载时的回调函数
                        onLoad={onLoaded} // 当视频加载完毕时的回调函数
                        onProgress={onProgressChanged} //每250ms调用一次，以获取视频播放的进度
                        onEnd={onPlayEnd}
                        onError={onPlayError}
                        onAudioBecomingNoisy={onAudioBecomingNoisy}
                        onAudioFocusChanged={onAudioFocusChanged}
                        ignoreSilentSwitch="obey"
                    />
                )}
                <TouchableOpacity activeOpacity={1} onPress={controlSwitch} style={styles.controlContainer}>
                    <VideoControl videoStore={this.videoStore} navigation={navigation} />
                </TouchableOpacity>
                <VideoStatus videoStore={this.videoStore} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    playContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    defaultSize: {
        width: Device.WIDTH,
        height: Device.WIDTH * 0.65,
    },
    videoStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controlContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
export default Player;
