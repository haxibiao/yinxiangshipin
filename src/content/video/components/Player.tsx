import React, { useRef, useMemo, useState, useCallback, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native';
import { Iconfont } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import BufferingVideo from './BufferingVideo';
import { font, pixel } from '../../helper';

interface Props {
    store: any;
    media: any;
    viewable: boolean;
    resizeMode: 'cover' | 'contain';
}

export default React.forwardRef((props: Props, ref) => {
    const { store, media, viewable, resizeMode } = props;
    const navigation = useNavigation();
    const [loading, setLoaded] = useState(true);
    const [progress, setProgress] = useState(0);
    const [paused, setPause] = useState(false);
    const currentTime = useRef(0);
    const duration = useRef(20);

    const togglePause = useCallback(() => {
        setPause(v => !v);
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            togglePause,
        }),
        [togglePause],
    );

    const source = useMemo(() => {
        return media?.video?.url;
    }, [media]);

    // const onPress = useDoubleHandler({ doubleClick: likePost, singleClick: togglePause });

    const videoEvents = useMemo((): object => {
        return {
            onLoadStart() {
                setProgress(0);
                store.playedVideoIds.push(media.id);
                currentTime.current = 0;
            },

            onLoad(data) {
                duration.current = data.duration;
                setLoaded(false);
            },

            onProgress(data) {
                // if (!media.watched) {
                //     (rewardProgress => {
                //         setTimeout(() => {
                //             store.rewardProgress += rewardProgress;
                //         }, 20);
                //     })(data.currentTime - currentTime.current);
                //     if (Math.abs(currentTime.current - duration.current) <= 1) {
                //         media.watched = true;
                //     }
                // }
                setProgress(data.currentTime);
                currentTime.current = data.currentTime;
            },

            onEnd() {},

            onError() {},

            onAudioBecomingNoisy() {
                setPause(true);
            },
        };
    }, []);

    useEffect(() => {
        setPause(!viewable);
        const navWillFocusListener = navigation.addListener('focus', () => {
            setPause(!viewable);
        });
        const navWillBlurListener = navigation.addListener('blur', () => {
            setPause(true);
        });
        const videoBlurListener = DeviceEventEmitter.addListener('videoBlur', () => {
            setPause(true);
        });
        const videoFocusListener = DeviceEventEmitter.addListener('videoFocus', () => {
            setPause(!viewable);
        });
        return () => {
            navWillFocusListener();
            navWillBlurListener();
            videoBlurListener.remove();
            videoFocusListener.remove();
        };
    }, [viewable]);

    return (
        <TouchableWithoutFeedback onPress={togglePause}>
            <View style={styles.playerContainer}>
                <Video
                    resizeMode={resizeMode}
                    paused={paused}
                    source={{ uri: source }}
                    style={styles.videoSize}
                    rate={1} // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
                    volume={1} // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
                    muted={false} // true代表静音，默认为false.
                    progressUpdateInterval={150}
                    disableFocus={true}
                    useTextureView={false}
                    repeat={true} // 是否重复播放
                    ignoreSilentSwitch="obey"
                    playWhenInactive={false}
                    playInBackground={false}
                    {...videoEvents}
                />
                {paused && (
                    <View style={styles.pauseStatus}>
                        <Iconfont name="bofang1" size={font(70)} color="rgba(255,255,255,0.5)" />
                    </View>
                )}
                <View style={styles.progressBar}>
                    <BufferingVideo loading={loading} />
                    <View style={[styles.progress, { width: (progress / duration.current) * 100 + '%' }]} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    videoSize: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    pauseStatus: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    progressBar: {
        height: pixel(1),
        backgroundColor: 'rgba(255,255,255,0.4)',
        position: 'absolute',
        bottom: Device.isFullScreenDevice ? StyleSheet.hairlineWidth : Theme.BOTTOM_HEIGHT,
        left: 0,
        right: 0,
    },
    progress: {
        backgroundColor: '#FFF',
        width: 0,
        height: pixel(1),
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});
