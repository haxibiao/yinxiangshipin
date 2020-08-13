import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { download } from '@src/common';
import { GQL, errorMessage, useReport } from '../../service';
import { percent, pixel, font } from '../../helper';

const VideoOperation = (props) => {
    const { options, type, target, videoUrl, videoTitle, closeOverlay, onRemove, client, navigation } = props;
    const report = useReport({ target, type });
    const [deleteArticleMutation] = useMutation(GQL.deleteArticle, {
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

    const downloadVideo = useCallback(() => {
        closeOverlay();
        download({ url: videoUrl, title: videoTitle });
    }, [videoUrl]);

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
                .then((result) => {
                    if (onRemove instanceof Function) {
                        onRemove();
                    }
                    Toast.show({ content: '操作成功，将减少此类型内容的推荐！' });
                })
                .catch((error) => {
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
                image: require('@app/assets/images/more_video_download.png'),
                callback: downloadVideo,
            },
            举报: {
                image: require('@app/assets/images/more_report.png'),
                callback: reportArticle,
            },
            删除: {
                image: require('@app/assets/images/more_delete.png'),
                callback: deleteArticle,
            },
            不感兴趣: {
                image: require('@app/assets/images/more_dislike.png'),
                callback: dislike,
            },
        }),
        [reportArticle, deleteArticle, dislike],
    );

    const optionsView = useMemo(() => {
        return options.map((option) => {
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
