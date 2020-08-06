import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native';
import { observer, Provider, inject } from 'mobx-react';
import { withNavigation } from '@src/router';
import Iconfont from '../Iconfont';

@observer
class VideoStatus extends Component {
    render() {
        let { status, replay, continueToPlay } = this.props.videoStore;
        switch (status) {
            case 'error':
                return (
                    <View style={styles.videoStatus}>
                        <TouchableWithoutFeedback onPress={replay}>
                            <View style={styles.error}>
                                <Iconfont name="shuaxin1" size={pixel(25)} color="#fff" />
                                <Text style={styles.statusText}>好像迷路啦，请检查网络或者重试</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                );
                break;
            case 'notWifi':
                return (
                    <View style={styles.videoStatus}>
                        <TouchableOpacity style={styles.playButton} onPress={continueToPlay}>
                            <Iconfont name="zanting" size={pixel(25)} color="#fff" />
                            <Text style={styles.continueText}>继续播放</Text>
                        </TouchableOpacity>
                        <Text style={styles.statusText}>您正在使用非WiFi网络，播放将产生流量费用</Text>
                    </View>
                );
                break;
            case 'loading':
                return (
                    <View style={styles.videoStatus}>
                        <ActivityIndicator color={'#fff'} size={'large'} />
                    </View>
                );
                break;
            case 'finished':
                return (
                    <View style={styles.videoStatus}>
                        <TouchableWithoutFeedback onPress={replay}>
                            <View style={styles.replay}>
                                <Iconfont name="shuaxin1" size={pixel(25)} color="#fff" />
                                <Text style={styles.refreshText}>重播</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                );
                break;
            default:
                return null;
        }
    }
}

const styles = StyleSheet.create({
    videoStatus: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    replay: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: pixel(40),
        paddingHorizontal: pixel(16),
        borderWidth: pixel(1),
        borderRadius: pixel(20),
        borderColor: '#fff',
    },
    playButton: {
        marginBottom: pixel(10),
        paddingVertical: pixel(8),
        paddingHorizontal: pixel(16),
        backgroundColor: '#666666',
        borderRadius: pixel(6),
        flexDirection: 'row',
        alignItems: 'center',
    },
    continueText: {
        marginLeft: pixel(10),
        fontSize: font(13),
        color: '#fff',
    },
    statusText: {
        marginTop: pixel(10),
        fontSize: font(14),
        color: '#fff',
    },
    refreshText: {
        marginLeft: pixel(15),
        fontSize: font(14),
        color: '#fff',
    },
});

export default VideoStatus;
