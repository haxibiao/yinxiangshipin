import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { GQL } from '@src/apollo';
import { exceptionCapture, getURLsFromString } from '@src/common';
import { Iconfont, Loading, KeyboardSpacer } from '@src/components';
import { useResolveVideo } from './useResolveVideo';
import { useResolveContent } from './useResolveContent';
import { observer, appStore } from '@src/store';

interface Props {
    client: any;
    shareLink: string;
    shareBody: {
        title: string;
        cover: string;
    };
    onClose: (p?: any) => any;
}

export const VideoCaptureData = observer(({ client, shareLink, shareBody, onSuccess, onFailed, onClose }: Props) => {
    const [body, setBody] = useState(shareBody?.title);

    const resolveContentSuccess = useCallback(
        async (video) => {
            Loading.show('视频收藏中');
            // console.log('====================================');
            // console.log('createPostContent', 'body：', body, 'qcvod_fileid：', video?.id, 'share_link：', shareLink);
            // console.log('====================================');
            const [error, res] = await exceptionCapture(() =>
                client.mutate({
                    mutation: GQL.createPostContent,
                    variables: {
                        body,
                        qcvod_fileid: video?.id,
                        share_link: shareLink,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.tasksQuery,
                            fetchPolicy: 'network-only',
                        },
                        {
                            query: GQL.meMetaQuery,
                            fetchPolicy: 'network-only',
                        },
                    ],
                }),
            );
            Loading.hide();
            if (error) {
                Toast.show({ content: error?.message || '收藏失败' });
                if (onFailed instanceof Function) {
                    onFailed();
                }
            } else if (res) {
                Toast.show({ content: '收藏成功' });
                if (onSuccess instanceof Function) {
                    onSuccess();
                }
            }
        },
        [body, shareLink, onSuccess, onFailed],
    );

    const resolveVideo = useResolveVideo({ client, shareLink, content: body, onSuccess, onFailed });

    const resolveContent = useResolveContent({
        shareBody,
        onSuccess: resolveContentSuccess,
        onFailed: resolveVideo,
    });

    const collectVideo = useCallback(() => {
        if (appStore.isLocalSpiderVideo) {
            resolveContent();
        } else {
            resolveVideo();
        }
    }, [resolveVideo, resolveContent]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.cover}>
                    <Image
                        style={styles.coverImage}
                        source={{ uri: shareBody?.cover || 'http://cos.haxibiao.com/images/5f83d367ae609.jpeg' }}
                    />
                    <View style={styles.videoMark}>
                        <Iconfont name="bofang1" size={font(20)} color={'#fff'} style={{ opacity: 0.8 }} />
                    </View>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Iconfont name="guanbi1" size={font(14)} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    {/* <Text style={styles.title}>{shareBody?.title}</Text> */}
                    <TextInput
                        style={styles.inputContent}
                        onChangeText={(val) => setBody(val)}
                        value={body}
                        multiline={true}
                        maxLength={100}
                        textAlignVertical="center"
                        placeholder="把你想说的娓娓道来，分享给有趣的人"
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#b2b2b2"
                    />
                </View>
                <TouchableOpacity style={styles.shareBtn} onPress={collectVideo}>
                    <Text style={styles.shareBtnText}>收藏视频</Text>
                </TouchableOpacity>
                <Text style={styles.tips}>来自您复制的分享链接</Text>
            </View>
            <KeyboardSpacer />
        </ScrollView>
    );
});

const CARD_WIDTH = percent(80) > pixel(290) ? pixel(290) : percent(80);

const styles = StyleSheet.create({
    container: {
        width: Device.width,
        height: Device.height,
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
        resizeMode: 'cover',
        backgroundColor: '#f0f0f0',
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
