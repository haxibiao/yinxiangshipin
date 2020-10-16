import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Iconfont } from '@src/components';
import Video from 'react-native-video';
import { Overlay } from 'teaset';

interface Props {
    url: string;
    type: string;
    onPress: (p?: any) => any;
    onClose: (p?: any) => any;
}

const SharedPost = ({ url, type, onPress, onClose }: Props) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.cover}>
                    {type === 'image' ? (
                        <Image style={styles.coverImage} source={{ uri: url }} resizeMode="cover" />
                    ) : (
                        <Video
                            source={{
                                uri: url,
                            }}
                            style={styles.coverImage}
                            muted={true}
                            paused={false}
                            resizeMode="cover"
                        />
                    )}
                    <View style={styles.videoMark}>
                        <Iconfont name="bofang1" size={font(20)} color={'#fff'} style={{ opacity: 0.8 }} />
                    </View>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Iconfont name="guanbi1" size={font(14)} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <Text style={styles.title}>检测到有被分享的内容，是否打开</Text>
                </View>
                <TouchableOpacity style={styles.shareBtn} onPress={onPress}>
                    <Text style={styles.shareBtnText}>打开看看</Text>
                </TouchableOpacity>
                <Text style={styles.tips}>来自印象视频好友分享</Text>
            </View>
        </ScrollView>
    );
};

let isShow = false;
let overlayKey;

function hide() {
    Overlay.hide(overlayKey);
    isShow = false;
}

function show({ url, type, onPress, onClose }: Props) {
    if (isShow) {
        return;
    }
    isShow = true;
    const content = (
        <Overlay.PopView
            style={{ alignItems: 'center', justifyContent: 'center' }}
            modal={true}
            animated={true}
            onDisappearCompleted={() => (isShow = false)}>
            <SharedPost
                url={url}
                type={type}
                onPress={() => {
                    hide();
                    onPress();
                }}
                onClose={() => {
                    hide();
                    onClose();
                }}
            />
        </Overlay.PopView>
    );
    overlayKey = Overlay.show(content);
}

export default {
    show,
};

const CARD_WIDTH = percent(80) > pixel(290) ? pixel(290) : percent(80);

const styles = StyleSheet.create({
    container: {
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    inputContent: {
        height: pixel(60),
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
        paddingTop: 0,
        padding: pixel(5),
        margin: 0,
        borderWidth: pixel(1),
        borderColor: '#f0f0f0',
        borderRadius: pixel(5),
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
        height: pixel(40),
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
