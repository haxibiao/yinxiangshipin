import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native';
import { download, exceptionCapture } from '@src/common';
import { GQL, useMutation, errorMessage, useReport } from '@src/apollo';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Loading } from '@src/components';

const VideoOperation = (props: any) => {
    const { options, type, target, closeOverlay, onRemove, client, navigation } = props;
    const report = useReport({ target, type });

    const [deleteArticleMutation] = useMutation(GQL.deleteArticleMutation, {
        variables: {
            id: target.id,
        },
        onCompleted: (data) => {
            if (onRemove instanceof Function) {
                onRemove();
            }
            Toast.show({
                content: '删除成功',
            });
        },
        onError: (error) => {
            Toast.show({
                content: errorMessage(error) || '删除失败',
            });
        },
    });

    const deleteArticle = useCallback(() => {
        closeOverlay();
        deleteArticleMutation();
    }, [deleteArticleMutation]);

    const reportArticle = useCallback(() => {
        closeOverlay();
        report();
    }, [report]);

    const downloadVideo = useCallback(async () => {
        closeOverlay();
        Loading.show();
        const [err, res] = await exceptionCapture(() =>
            client.mutate({
                mutation: GQL.downloadVideoMutation,
                variables: {
                    video_id: target?.video?.id,
                },
            }),
        );
        const url = res?.data?.downloadVideo;
        Loading.hide();
        if (url) {
            const title = String(Config.AppID + '' + target?.id + '-' + target?.video?.id).replace(/\s+/g, '');
            download({ url, title });
        } else {
            Toast.show({ content: '下载失败' });
        }
    }, [target]);

    const dislike = useCallback(() => {
        closeOverlay();
        if (TOKEN) {
            client
                .mutate({
                    mutation: GQL.addArticleBlockMutation,
                    variables: {
                        id: target.id,
                    },
                })
                .then((result: any) => {
                    if (onRemove instanceof Function) {
                        onRemove();
                    }
                    Toast.show({ content: '操作成功，将减少此类型内容的推荐！' });
                })
                .catch((error: any) => {
                    //查询接口，服务器返回错误后
                    Toast.show({ content: errorMessage(error) || '操作失败' });
                });
        } else {
            navigation.navigate('Login');
        }
    }, [target]);

    const operation = useMemo(
        () => ({
            下载: {
                image: require('@app/assets/images/operation/more_video_download.png'),
                callback: downloadVideo,
            },
            举报: {
                image: require('@app/assets/images/operation/more_report.png'),
                callback: reportArticle,
            },
            删除: {
                image: require('@app/assets/images/operation/more_delete.png'),
                callback: deleteArticle,
            },
            不感兴趣: {
                image: require('@app/assets/images/operation/more_dislike.png'),
                callback: dislike,
            },
        }),
        [reportArticle, deleteArticle, dislike],
    );

    const optionsView = useMemo(() => {
        return options.map((option: any) => {
            return (
                <TouchableOpacity style={styles.optionItem} key={option} onPress={operation[option].callback}>
                    <Image style={styles.optionIcon} source={operation[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchableOpacity>
            );
        });
    }, [options]);

    return (
        <TouchableWithoutFeedback onPress={closeOverlay}>
            <View style={styles.optionsContainer}>
                <Text style={styles.title}>请选择你要进行的操作</Text>
                <View style={styles.body}>{optionsView}</View>
            </View>
        </TouchableWithoutFeedback>
    );
};

VideoOperation.defaultProps = {
    options: ['不感兴趣', '举报'],
    type: 'articles',
};

const styles = StyleSheet.create({
    body: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    optionIcon: {
        height: pixel(50),
        width: pixel(50),
    },
    optionItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: pixel(25),
    },
    optionName: {
        color: '#fff',
        fontSize: font(13),
        marginTop: pixel(10),
    },
    optionsContainer: {
        width: percent(100),
        height: percent(100, 'height'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginBottom: font(20),
        fontSize: font(20),
        textAlign: 'center',
        color: '#fff',
    },
});

export default VideoOperation;
