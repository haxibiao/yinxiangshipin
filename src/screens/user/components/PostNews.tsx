import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Animated } from 'react-native';
import {
    PageContainer,
    StatusView,
    SpinnerLoading,
    Footer,
    Placeholder,
    CustomRefreshControl,
    ItemSeparator,
    HxfButton,
} from '@src/components';
import { PostItem } from '@src/content';
import { observer, userStore } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';
import { observable } from 'mobx';

const animatedReferenceValue = Device.WIDTH * 0.75 - pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight);

const PostNews = observer((props: any) => {
    const user = props.route.params?.user || {};

    const { data: userQueryResult } = useQuery(GQL.userQuery, {
        variables: { id: user.id },
    });
    const userData = useMemo(() => Helper.syncGetter('user', userQueryResult), [userQueryResult]);
    const isSelf = useMemo(() => userStore.me.id === user.id, [userStore]);

    const { loading, error, data: postsQueryResult, refetch, fetchMore } = useQuery(GQL.postsQuery, {
        variables: { user_id: user.id },
    });
    const posts = useMemo(() => Helper.syncGetter('posts.data', postsQueryResult), [postsQueryResult]);

    const hasMorePages = useMemo(() => Helper.syncGetter('posts.paginatorInfo.hasMorePages', postsQueryResult), [
        postsQueryResult,
    ]);
    const currentPage = useMemo(() => Helper.syncGetter('posts.paginatorInfo.currentPage', postsQueryResult), [
        postsQueryResult,
    ]);

    const scrollAnimateValue = useRef(new Animated.Value(0));

    const scrollListener = useCallback((e) => {
        const { contentOffset, contentSize } = e.nativeEvent;
        const { y } = contentOffset;
    }, []);

    const onScroll = useMemo(() => {
        return Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollAnimateValue.current } } }],
            {
                listener: scrollListener,
            },
            { useNativeDriver: false },
        );
    }, [scrollListener]);

    const height = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [Device.WIDTH * 0.75, pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight)],
        extrapolate: 'clamp',
    });

    const opacity = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const titleOpacity = scrollAnimateValue.current.interpolate({
        inputRange: [0, animatedReferenceValue],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    if (loading || !userData || !posts) return <SpinnerLoading />;

    return (
        <FlatList
            contentContainerStyle={styles.contentContainer}
            bounces={false}
            data={posts}
            refreshing={loading}
            refreshControl={<CustomRefreshControl onRefresh={refetch} />}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
            renderItem={(item: any) => <PostItem data={item} />}
            ListEmptyComponent={
                <StatusView.EmptyView
                    title="TA还没有作品"
                    imageSource={require('@app/assets/images/default_empty.png')}
                />
            }
            onEndReached={() => {
                if (hasMorePages) {
                    fetchMore({
                        variables: {
                            page: currentPage + 1,
                        },
                        updateQuery: (prev: any, { fetchMoreResult: more }) => {
                            if (more && more.posts) {
                                return {
                                    posts: {
                                        ...more.posts,
                                        data: [...prev.posts.data, ...more.posts.data],
                                    },
                                };
                            }
                        },
                    });
                }
            }}
            ListFooterComponent={() => (hasMorePages ? <Placeholder quantity={1} /> : null)}
        />
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingTop: Device.WIDTH * 0.75,
    },
    // profileView: {
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     width: Device.WIDTH,
    //     height: Device.WIDTH * 0.75,
    //     overflow: 'hidden',
    // },
});

export default PostNews;
