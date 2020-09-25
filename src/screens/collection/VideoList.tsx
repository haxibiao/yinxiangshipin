import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApolloClient, ApolloProvider } from '@src/apollo';
import { observer } from '@src/store';
import { exceptionCapture } from '@src/common';
import { FocusAwareStatusBar } from '@src/router';
import { NavBarHeader, SafeText, Iconfont } from '@src/components';
import { GQL } from '@src/apollo';
import { DrawVideoList, DrawVideoStore } from '@src/content';
import { Overlay } from 'teaset';
import CollectionEpisodes from './components/CollectionEpisodes';

export default observer(() => {
    const listRef = useRef();
    const route = useRoute();
    const client = useApolloClient();
    const navigation = useNavigation();
    const post = useMemo(() => route?.params?.post, []);
    const collection = useMemo(() => route?.params?.collection, []);
    const nextPage = useRef(Math.ceil(post?.current_episode / 5)); // Math.ceil(post?.current_episode / 5)
    const store = useMemo(() => new DrawVideoStore({ initData: [post] }), []);

    const getVisibleItem = useCallback((index) => {
        if (!store.JumpPlayCollectionVideo) {
            store.viewableItemIndex = index;
        }
    }, []);

    const fetchData = useCallback(async (initFetch) => {
        let prevPage;
        const current_episode = store.data[store.viewableItemIndex]?.current_episode;
        if (!initFetch && store.viewableItemIndex === 0 && current_episode !== 1) {
            prevPage = Math.ceil(current_episode / 5) - 1;
        }

        async function postsQuery() {
            return client.query({
                query: GQL.CollectionQuery,
                variables: {
                    collection_id: collection?.id,
                    page: prevPage || nextPage.current,
                    count: 5,
                },
            });
        }

        const opened = (() => {
            if (store.status == 'loading' || store.status == 'loadAll') {
                return false;
            } else if (prevPage || initFetch) {
                return true;
            } else {
                return store.data.length - store.viewableItemIndex <= 3;
            }
        })();
        if (opened) {
            store.status = 'loading';
            const [error, result] = await exceptionCapture(postsQuery);
            const postsData = result?.data?.collection?.posts?.data;
            const hasMore = result?.data?.collection?.posts?.paginatorInfo?.hasMorePages;
            if (!prevPage) {
                nextPage.current = result?.data?.collection?.posts?.paginatorInfo?.currentPage + 1;
            }
            if (postsData?.length > 0) {
                if (initFetch) {
                    const currentIndex = __.findIndex(postsData, function (item) {
                        return item?.id === post?.id;
                    });
                    store.data = postsData;
                    store.viewableItemIndex = currentIndex > 0 ? currentIndex : 0;
                    store.JumpPlayCollectionVideo = true;
                } else if (prevPage) {
                    store.prependSource(postsData);
                    store.viewableItemIndex = postsData.length;
                    store.JumpPlayCollectionVideo = true;
                } else {
                    store.addSource(postsData);
                }
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
    const showCollection = useMemo(() => {
        let overlayKey;
        let isShown;
        function onClose() {
            isShown = false;
            Overlay.hide(overlayKey);
        }
        const Episodes = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                onDisappearCompleted={() => (isShown = false)}
                animated={true}>
                <ApolloProvider client={client}>
                    <CollectionEpisodes
                        collection={collection}
                        post={store.data[store.viewableItemIndex]}
                        onClose={onClose}
                        navigation={navigation}
                        currentPage={nextPage.current}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        return () => {
            if (!isShown) {
                isShown = true;
                overlayKey = Overlay.show(Episodes);
            }
        };
    }, [collection]);

    const onContentSizeChange = useCallback((contentWidth, contentHeight) => {
        if (store.JumpPlayCollectionVideo) {
            store.JumpPlayCollectionVideo = false;
            listRef.current?.scrollToIndex({
                index: store.viewableItemIndex,
                animated: false,
            });
        }
    }, []);

    // 页面初始化
    useEffect(() => {
        showCollection();
        fetchData(true);
        DeviceEventEmitter.addListener('JumpPlayCollectionVideo', ({ data, index, page }) => {
            store.data = data;
            store.viewableItemIndex = index;
            store.JumpPlayCollectionVideo = true;
            nextPage.current = page;
        });
        return () => {
            DeviceEventEmitter.removeListener('JumpPlayCollectionVideo');
        };
    }, []);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <DrawVideoList
                style={{ paddingBottom: 0 }}
                listRef={listRef}
                store={store}
                initialIndex={0}
                getVisibleItem={getVisibleItem}
                fetchData={fetchData}
                onContentSizeChange={onContentSizeChange}
            />
            <TouchableWithoutFeedback onPress={showCollection}>
                <View style={styles.collectionItem}>
                    <View style={styles.collectionInfo}>
                        <Iconfont name="wenji" color="#fff" size={pixel(15)} />
                        <SafeText
                            style={
                                styles.collectionName
                            }>{`${collection?.name} · 更新至第${collection?.updated_to_episode}集`}</SafeText>
                    </View>
                    <Iconfont name="xiangshang2" color="#b2b2b2" size={pixel(17)} />
                </View>
            </TouchableWithoutFeedback>
            <NavBarHeader navBarStyle={styles.navBarStyle} isTransparent={true} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    collectionItem: {
        margin: pixel(12),
        marginBottom: Theme.HOME_INDICATOR_HEIGHT || pixel(12),
        height: pixel(44),
        borderRadius: pixel(22),
        paddingHorizontal: pixel(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333333',
    },
    collectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    collectionName: {
        marginLeft: pixel(6),
        fontSize: font(14),
        color: '#ffffff',
    },
});
