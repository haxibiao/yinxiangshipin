import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Iconfont } from '@src/components';
import { getURLsFromString, percent, pixel, font } from '../helper';
import { useResolveContent } from './useResolveContent';

interface Props {
    client: any;
    shareLink: string;
    content: any;
    onClose: (p?: any) => any;
}

export const VideoCaptureData = ({ client, shareLink, content, onClose }: Props) => {
    const shareContent = useResolveContent({ client, shareLink, onSuccess: onClose, onFailed: onClose });
    return (
        <View style={styles.card}>
            <View style={styles.cover}>
                <Image style={styles.coverImage} source={{ uri: content?.cover }} />
                <View style={styles.videoMark}>
                    <Iconfont name="bofang1" size={font(20)} color={'#fff'} style={{ opacity: 0.8 }} />
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Iconfont name="guanbi1" size={font(14)} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>{content?.title}</Text>
            </View>
            <TouchableOpacity style={styles.shareBtn} onPress={shareContent}>
                <Text style={styles.shareBtnText}>采集视频</Text>
            </TouchableOpacity>
            <Text style={styles.tips}>来自您复制的分享链接</Text>
        </View>
    );
};

const CARD_WIDTH = percent(80) > pixel(280) ? pixel(280) : percent(80);

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: pixel(5),
        overflow: 'hidden',
    },
    cover: {
        height: CARD_WIDTH,
        marginBottom: pixel(15),
    },
    coverImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    videoMark: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: pixel(10),
        right: pixel(10),
        width: pixel(30),
        height: pixel(30),
        borderRadius: pixel(15),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    body: {
        paddingHorizontal: pixel(20),
        marginBottom: pixel(15),
    },
    title: {
        fontSize: font(15),
        lineHeight: font(22),
        color: '#2b2b2b',
        textAlign: 'center',
    },
    shareBtn: {
        marginHorizontal: pixel(20),
        marginBottom: pixel(15),
        height: pixel(42),
        borderRadius: pixel(4),
        backgroundColor: '#FE1966',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareBtnText: {
        fontSize: font(16),
        color: '#fff',
    },
    tips: {
        marginBottom: pixel(12),
        fontSize: font(13),
        color: '#b2b2b2',
        textAlign: 'center',
    },
});
