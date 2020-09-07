import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { exceptionCapture } from '@src/common';
import { NavBarHeader } from '@src/components';
import { observer, appStore, userStore } from '@src/store';
import { GQL } from '@src/apollo';
import { DrawVideoList, DrawVideoStore } from '@src/content';

export default observer((props) => {
    const videoStore = useMemo(() => new DrawVideoStore(), []);

    const getVisibleItem = useCallback((index) => {
        videoStore.viewableItemIndex = index;
    }, []);

    const fetchData = useCallback(async () => {
        async function postsQuery() {
            return appStore.client.query({
                query: GQL.recommendPostsQuery,
                fetchPolicy: 'network-only',
            });
        }
        if (videoStore.status !== 'loading' && videoStore.data.length - videoStore.viewableItemIndex <= 3) {
            videoStore.status = 'loading';
            const [error, result] = await exceptionCapture(postsQuery);
            const postsData = result?.data?.recommendPosts;
            if (postsData?.length > 0) {
                videoStore.addSource(postsData);
            }
            if (postsData?.length === 0) {
                videoStore.status = 'loadAll';
            } else if (error) {
                videoStore.status = 'error';
            } else {
                videoStore.status = '';
            }
        }
    }, []);

    // 首次加载视频数据
    useEffect(() => {
        if (userStore.launched) {
            fetchData();
        }
    }, [userStore.launched]);

    return <DrawVideoList store={videoStore} getVisibleItem={getVisibleItem} fetchData={fetchData} />;
});
