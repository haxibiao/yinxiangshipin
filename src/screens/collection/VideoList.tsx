import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { exceptionCapture } from '@src/common';
import { NavBarHeader, FocusAwareStatusBar } from '@src/components';
import { GQL, useApolloClient } from '@src/apollo';
import { DrawVideoList, DrawVideoStore } from '@src/content';

export default () => {
    const route = useRoute();
    const navigation = useNavigation();
    const collection = useMemo(() => route?.params?.collection, []);
    const initData = useMemo(() => route?.params?.initData, []);
    const itemIndex = useMemo(() => route?.params?.itemIndex, []);
    const count = useMemo(() => route?.params?.count, []);
    const nextPage = useRef(route?.params?.page);
    const store = useMemo(() => new DrawVideoStore({ initData, itemIndex }), []);

    const getVisibleItem = useCallback((index) => {
        store.viewableItemIndex = index;
    }, []);

    const client = useApolloClient();

    const fetchData = useCallback(async () => {
        async function postsQuery() {
            return client.query({
                query: GQL.collectionPostsQuery,
                variables: {
                    collection_id: collection?.id,
                    page: nextPage.current,
                    count,
                    visibility: 'all',
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
        fetchData();
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
