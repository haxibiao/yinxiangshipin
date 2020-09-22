import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { exceptionCapture } from '@src/common';
import { FocusAwareStatusBar } from '@src/router';
import { NavBarHeader } from '@src/components';
import { GQL, useApolloClient } from '@src/apollo';
import { DrawVideoList, DrawVideoStore } from '@src/content';

export default () => {
    const route = useRoute();
    const navigation = useNavigation();
    const keyword = useMemo(() => route?.params?.keyword, []);
    const tag_id = useMemo(() => route?.params?.tag_id, []);
    const user_id = useMemo(() => route?.params?.user_id, []);
    const initData = useMemo(() => route?.params?.initData, []);
    const itemIndex = useMemo(() => route?.params?.itemIndex, []);
    const nextPage = useRef(route?.params?.page);
    const store = useMemo(() => new DrawVideoStore({ initData, itemIndex }), []);

    const getVisibleItem = useCallback((index) => {
        store.viewableItemIndex = index;
    }, []);

    const client = useApolloClient();

    const fetchData = useCallback(async () => {
        async function postsQuery() {
            return client.query({
                query: GQL.searchPostQuery,
                variables: {
                    query: keyword,
                    tag_id: tag_id,
                    user_id: user_id,
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
            const postsData = result?.data?.searchPosts?.data;
            const hasMore = result?.data?.searchPosts?.paginatorInfo?.hasMorePages;
            nextPage.current = result?.data?.searchPosts?.paginatorInfo?.currentPage + 1;
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
