import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { exceptionCapture } from '@src/common';
import { observer, appStore, userStore } from '@src/store';
import { GQL } from '@src/apollo';
import { DrawVideoList, DrawVideoStore, Placeholder } from '@src/content';
import { useNavigation } from '@react-navigation/native';

export default observer((props: any) => {
    const navigation = useNavigation();
    const videoStore = useMemo(() => new DrawVideoStore(), []);

    const getVisibleItem = useCallback((index) => {
        videoStore.viewableItemIndex = index;
    }, []);

    const page = useRef(1);

    const fetchData = useCallback(async () => {
        async function postsQuery() {
            return appStore.client.query({
                query: GQL.followPostsQuery,
                variables: {
                    user_id: userStore?.me?.id,
                    page: page.current,
                    count: 5,
                    filter: 'spider',
                },
                fetchPolicy: 'network-only',
            });
        }
        if (
            videoStore.status !== 'loading' &&
            videoStore.status !== 'loadAll' &&
            videoStore.data.length - videoStore.viewableItemIndex <= 3
        ) {
            videoStore.status = 'loading';
            const [error, result] = await exceptionCapture(postsQuery);
            const postsData = result?.data?.followPosts?.data;
            page.current = result?.data?.followPosts?.paginatorInfo?.currentPage + 1;
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

    useEffect(() => {
        const onChangeVideoTab = DeviceEventEmitter.addListener('onChangeVideoTab', (activePage) => {
            videoStore.visibility = props.page === activePage;
        });
        return () => {
            onChangeVideoTab.remove();
        };
    }, [props.visibility]);

    if (!userStore.login) {
        return (
            <Placeholder.NotLogged
                style={{ flex: 1, backgroundColor: '#111722' }}
                onPress={() => navigation.navigate('Login')}
            />
        );
    }

    return (
        <DrawVideoList
            store={videoStore}
            getVisibleItem={getVisibleItem}
            fetchData={fetchData}
            EmptyComponent={<Placeholder.NoContent />}
        />
    );
});
