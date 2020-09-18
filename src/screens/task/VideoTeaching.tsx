import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Iconfont, Loading } from '@src/components';
import { MediaPlayer } from '@src/content';

interface Props {
    title?: string;
    onClose: () => void;
    onLoad?: ({ duration }) => void;
}

export default function VideoTeaching({ title, onClose, onLoad }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{'视频教学' || title}</Text>
            </View>
            <View style={styles.content}>
                <MediaPlayer
                    onLoad={onLoad}
                    poster={{
                        uri:
                            'http://1254284941.vod2.myqcloud.com/bc7b9472vodtranscq1254284941/97279dfe5285890807758278376/coverBySnapshot_10_0.jpg',
                    }}
                    source={{
                        uri:
                            'http://1254284941.vod2.myqcloud.com/e591a6cavodcq1254284941/97279dfe5285890807758278376/34BIm7m36uYA.mp4',
                    }}
                />
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Iconfont name="guanbi1" size={font(20)} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: percent(100),
        height: percent(100, 'height'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: pixel(20),
    },
    title: {
        fontSize: font(18),
        color: '#fff',
        fontWeight: 'bold',
    },
    closeBtn: {
        marginTop: pixel(15),
        width: pixel(40),
        height: pixel(40),
        borderRadius: pixel(20),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    content: {
        width: percent(80),
        height: percent(120),
    },
});
