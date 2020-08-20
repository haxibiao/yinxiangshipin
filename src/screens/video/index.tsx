import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useApolloClient } from '@apollo/react-hooks';
import { exceptionCapture } from '@src/common';
import { NavBarHeader } from '@src/components';
import { DrawVideoList, DrawVideoStore, GQL } from '@src/content';

export default () => {
    const route = useRoute();
    const tag = useMemo(() => route?.params?.tag, []);
    const hasGoBack = useMemo(() => route?.params?.hasGoBack, []);
    const initData = useMemo(() => route?.params?.initData, []);
    const itemIndex = useMemo(() => route?.params?.itemIndex, []);
    const store = useMemo(() => new DrawVideoStore({ initData, itemIndex }), []);

    const getVisibleItem = useCallback((index) => {
        store.viewableItemIndex = index;
    }, []);

    const client = useApolloClient();
    const nextPage = useRef(route?.params?.page + 1);

    const fetchData = useCallback(async () => {
        async function postsQuery() {
            return client.query({
                query: GQL.tagPostsQuery,
                variables: {
                    tag_id: tag?.id,
                    page: nextPage.current,
                    visibility: 'all',
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
            const postsData = result?.data?.tag?.posts?.data;
            const hasMore = result?.data?.tag?.posts?.paginatorInfo?.hasMorePages;
            nextPage.current = result?.data?.tag?.posts?.paginatorInfo?.currentPage + 1;
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

    return (
        <View style={styles.container}>
            <DrawVideoList
                store={store}
                initialIndex={itemIndex}
                getVisibleItem={getVisibleItem}
                fetchData={fetchData}
            />
            <NavBarHeader navBarStyle={styles.navBarStyle} hasSearchButton={true} isTransparent={true} />
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
