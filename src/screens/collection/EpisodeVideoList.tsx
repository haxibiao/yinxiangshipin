import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, DeviceEventEmitter } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApolloClient, ApolloProvider } from '@src/apollo';
import { observer } from '@src/store';
import { exceptionCapture } from '@src/common';
import { NavBarHeader, SafeText, Iconfont, FocusAwareStatusBar } from '@src/components';
import { GQL } from '@src/apollo';
import { DrawVideoList, DrawVideoStore } from '@src/content';
import { Overlay } from 'teaset';
import LottieView from 'lottie-react-native';
import CollectionEpisodes from './components/CollectionEpisodes';

const VIDEO_QUERY_COUNT = 5;
const paddingBottom = Device.isFullScreenDevice
    ? pixel(44) + pixel(12) + (Theme.HOME_INDICATOR_HEIGHT || pixel(12))
    : pixel(12);

export default observer(() => {
    const listRef = useRef();
    const route = useRoute();
    const client = useApolloClient();
    const navigation = useNavigation();
    const post = useMemo(() => route?.params?.post, []);
    const collection = useMemo(() => route?.params?.collection, []);
    const nextPage = useRef(Math.ceil(post?.current_episode / VIDEO_QUERY_COUNT));
    const store = useMemo(() => new DrawVideoStore({ initData: [post] }), []);

    const getVisibleItem = useCallback((index) => {
        // console.log('getVisibleItem', index);
        // 因为onContentSizeChange在getVisibleItem前面调用，如果是跳转播放就不需要getVisibleItem更新viewableItemIndex了
        if (!store.JumpPlayCollectionVideo) {
            store.viewableItemIndex = index;
        }
    }, []);

    // const lisHeader = useCallback(() => {
    //     if (store.data[store.viewableItemIndex]?.current_episode !== 1) {
    //         return (
    //             <View style={{ alignItems: 'center' }}>
    //                 <LottieView
    //                     source={require('@app/assets/json/loading.json')}
    //                     style={{ width: '30%' }}
    //                     loop
    //                     autoPlay
    //                 />
    //             </View>
    //         );
    //     }
    //     return null;
    // }, [store.data, store.viewableItemIndex]);

    const fetchData = useCallback(async (initFetch) => {
        let isTopReached = false;
        let prevPage = 0;
        const current_episode = store.data[store.viewableItemIndex]?.current_episode;
        // 到达首页item,并且还有上一集，才计算上一页的页码
        if (!initFetch && store.viewableItemIndex === 0 && current_episode !== 1) {
            isTopReached = true;
            prevPage = Math.ceil(current_episode / VIDEO_QUERY_COUNT) - 1;
        }
        // console.log('isTopReached', isTopReached, prevPage);
        async function postsQuery() {
            return client.query({
                query: GQL.CollectionQuery,
                variables: {
                    collection_id: collection?.id,
                    page: isTopReached ? prevPage : nextPage.current,
                    count: VIDEO_QUERY_COUNT,
                },
            });
        }
        // 是否fetch data
        const opened = (() => {
            if (store.status == 'loading') {
                return false;
            } else if (initFetch) {
                return true;
            } else if (isTopReached && prevPage >= 1) {
                return true;
            } else if (store.status !== 'loadAll') {
                return store.data.length - store.viewableItemIndex <= 3;
            }
        })();
        // console.log('opened', opened);
        if (opened) {
            store.status = 'loading';
            const [error, result] = await exceptionCapture(postsQuery);
            const postsData = result?.data?.collection?.posts?.data;
            const hasMore = result?.data?.collection?.posts?.paginatorInfo?.hasMorePages;
            if (!isTopReached) {
                // 不是上一页才更新nextPage
                nextPage.current = result?.data?.collection?.posts?.paginatorInfo?.currentPage + 1;
            }
            // console.log('postsData', postsData?.length);
            if (postsData?.length > 0) {
                if (initFetch) {
                    // 初始化，播放当前集数
                    const currentIndex = __.findIndex(postsData, function (item) {
                        return item?.id === post?.id;
                    });
                    store.data = postsData;
                    store.viewableItemIndex = currentIndex > 0 ? currentIndex : 0;
                    store.JumpPlayCollectionVideo = true;
                } else if (isTopReached) {
                    // 填充上一页数据，更新viewableItemIndex
                    store.prependSource(postsData);
                    store.viewableItemIndex = postsData.length;
                    store.JumpPlayCollectionVideo = true;
                } else {
                    // 加载下一页
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
    const showCollection = useCallback(() => {
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
                        key={store.viewableItemIndex}
                        collection={collection}
                        post={store.data[store.viewableItemIndex]}
                        onClose={onClose}
                        navigation={navigation}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        if (!isShown) {
            isShown = true;
            overlayKey = Overlay.show(Episodes);
        }
    });

    const scrollToIndex = useCallback(() => {
        if (store.JumpPlayCollectionVideo) {
            store.JumpPlayCollectionVideo = false;
            listRef.current?.scrollToIndex({
                index: store.viewableItemIndex,
                animated: false,
            });
        }
    }, []);

    const onContentSizeChange = useCallback((contentWidth, contentHeight) => {
        // 跳转播放
        // console.log('onContentSizeChange', store.viewableItemIndex);
        scrollToIndex();
    }, []);

    // 页面初始化
    useEffect(() => {
        showCollection();
        fetchData(true);
        DeviceEventEmitter.addListener('JumpPlayCollectionVideo', ({ data, index, page }) => {
            // console.log('JumpPlayCollectionVideo', index);
            store.JumpPlayCollectionVideo = true;
            store.viewableItemIndex = index;
            nextPage.current = page;
            // data相同的情况下，直接scrollToIndex即可
            if (store.data.length === data?.length && store.data[0]?.id === data[0]?.id) {
                scrollToIndex();
            } else if (Array.isArray(data)) {
                store.data = data;
            }
        });
        return () => {
            DeviceEventEmitter.removeListener('JumpPlayCollectionVideo');
        };
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

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <DrawVideoList
                style={{ paddingBottom }}
                listRef={listRef}
                store={store}
                initialIndex={0}
                getVisibleItem={getVisibleItem}
                fetchData={fetchData}
                onContentSizeChange={onContentSizeChange}
                // ListHeaderComponent={lisHeader}
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
        position: 'absolute',
        left: pixel(12),
        right: pixel(12),
        bottom: Theme.HOME_INDICATOR_HEIGHT || pixel(12),
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
