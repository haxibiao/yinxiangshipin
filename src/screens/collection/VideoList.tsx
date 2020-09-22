import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, DeviceEventEmitter } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApolloClient, ApolloProvider } from '@src/apollo';
import { exceptionCapture } from '@src/common';
import { FocusAwareStatusBar } from '@src/router';
import { NavBarHeader } from '@src/components';
import { GQL } from '@src/apollo';
import { DrawVideoList, DrawVideoStore } from '@src/content';
import { Overlay } from 'teaset';
import CollectionEpisodes from './components/CollectionEpisodes';

export default () => {
    const route = useRoute();
    const client = useApolloClient();
    const navigation = useNavigation();
    const collection = useMemo(() => route?.params?.collection, []);
    const current_episode = useMemo(() => route?.params?.current_episode, []);
    const initData = useMemo(() => route?.params?.initData, []);
    const itemIndex = useMemo(() => route?.params?.itemIndex, []);
    const nextPage = useRef(current_episode / 5 || 1);
    const store = useMemo(() => new DrawVideoStore({ initData }), []);

    const getVisibleItem = useCallback((index) => {
        store.viewableItemIndex = index;
    }, []);

    const fetchData = useCallback(async () => {
        async function postsQuery() {
            return client.query({
                query: GQL.CollectionQuery,
                variables: {
                    collection_id: collection?.id,
                    page: nextPage.current,
                    count: 5,
                },
            });
        }

        if (
            (store.status !== 'loading' || store.status !== 'loadAll') &&
            store.data.length - store.viewableItemIndex <= 3
        ) {
            store.status = 'loading';
            const [error, result] = await exceptionCapture(postsQuery);
            const postsData = result?.data?.collection?.posts?.data;
            const hasMore = result?.data?.collection?.posts?.paginatorInfo?.hasMorePages;
            nextPage.current = result?.data?.collection?.posts?.paginatorInfo?.currentPage + 1;
            if (postsData?.length > 0) {
                store.addSource(postsData);
            }
            if (error) {
                store.status = 'error';
            } else if (!hasMore) {
                store.status = 'loadAll';
            } else {
                store.status = '';
            }
        }
    }, []);

    // 视频播放事件处理
    useEffect(() => {
        const navWillFocusListener = navigation.addListener('focus', () => {
            store.visibility = true;
        });
        const navWillBlurListener = navigation.addListener('blur', () => {
            store.visibility = false;
        });
        return () => {
            navWillFocusListener();
            navWillBlurListener();
        };
    }, []);

    // 显示合集列表
    const showCollection = useCallback(() => {
        let overlayKey;
        function onClose() {
            Overlay.hide(overlayKey);
        }
        const Operation = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}>
                <ApolloProvider client={client}>
                    <CollectionEpisodes
                        collection={collection}
                        post={initData[itemIndex]}
                        onClose={onClose}
                        navigation={navigation}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        overlayKey = Overlay.show(Operation);
    }, []);

    // 模态框事件处理
    useEffect(() => {
        showCollection();
        DeviceEventEmitter.addListener('showCollectionModal', () => {
            showCollection();
        });
        return () => {
            DeviceEventEmitter.removeListener('showCollectionModal');
        };
    }, []);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <DrawVideoList
                store={store}
                initialIndex={itemIndex}
                getVisibleItem={getVisibleItem}
                fetchData={fetchData}
                showBottomInput={true}
            />
            <NavBarHeader navBarStyle={styles.navBarStyle} isTransparent={true} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        width: '100%',
    },
});
