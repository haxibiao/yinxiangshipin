import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Linking, Platform, DeviceEventEmitter } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { userStore, appStore, notificationStore } from '@src/store';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { download } from '@src/common';
import { GQL } from '../graphgqls';
import { exceptionCapture } from './exceptionCapture';
import { errorMessage } from './errorMessage';

export function useOperations(post) {
    const client = useApolloClient();
    const { sharePostData } = useQuery(GQL.sharePostQuery, {
        variables: {
            id: post?.id,
        },
    });
    const copyLink = useCallback(async () => {
        const link =
            sharePostData?.sharePost || Config.ServerRoot + `/share/post/${post?.id}?user_id=${userStore.me.id}`;
        Clipboard.setString(link);
        Toast.show({ content: '复制成功' });
    }, [sharePostData, post]);

    const downloadVideo = useCallback(
        async (target) => {
            notificationStore.toggleLoadingVisible();
            const [err, res] = await exceptionCapture(() =>
                client.mutate({
                    mutation: GQL.downloadVideoMutation,
                    variables: {
                        video_id: target?.video?.id,
                    },
                }),
            );
            const url = res?.data?.downloadVideo;
            notificationStore.toggleLoadingVisible();
            if (url) {
                const title = String(Config.AppID + '' + target?.id + '-' + target?.video?.id).replace(/\s+/g, '');
                download({ url, title });
            } else {
                Toast.show({ content: '下载失败' });
            }
        },
        [client],
    );

    const deleteArticle = useCallback(
        async (target) => {
            const [err, res] = await exceptionCapture(() =>
                client.mutate({
                    mutation: GQL.deleteArticleMutation,
                    variables: {
                        id: target?.id,
                    },
                }),
            );
            if (res) {
                DeviceEventEmitter.emit(`'DeletePost`, target?.id);
                Toast.show({
                    content: '删除成功',
                });
            } else {
                Toast.show({
                    content: errorMessage(error, '删除失败'),
                });
            }
        },
        [client],
    );

    const addArticleBlock = useCallback(
        async (target) => {
            const [err, res] = await exceptionCapture(() =>
                client.mutate({
                    mutation: GQL.addArticleBlockMutation,
                    variables: {
                        id: target?.id,
                    },
                }),
            );
            if (res) {
                DeviceEventEmitter.emit(`'DislikePost`, target?.id);
                Toast.show({ content: '操作成功，将减少此类型内容的推荐！' });
            } else {
                Toast.show({
                    content: errorMessage(error),
                });
            }
        },
        [client],
    );

    const addUserBlock = useCallback(
        async (target) => {
            const [err, res] = await exceptionCapture(() =>
                client.mutate({
                    mutation: GQL.addUserBlockMutation,
                    variables: {
                        id: target?.id,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.publicPostsQuery,
                        },
                        {
                            query: GQL.publicVideosQuery,
                        },
                    ],
                }),
            );
            if (res) {
                Toast.show({ content: '拉黑成功，下拉刷新将减少此用户内容的推荐！' });
            } else {
                Toast.show({
                    content: errorMessage(error),
                });
            }
        },
        [client],
    );

    return { copyLink, downloadVideo, deleteArticle, addArticleBlock, addUserBlock };
}
