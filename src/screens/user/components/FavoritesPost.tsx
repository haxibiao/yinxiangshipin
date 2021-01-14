import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, Image, Pressable, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from '@app/src/components/ScrollHeadTabView';
import { StatusView } from '@src/components';
import { syncGetter, mergeProperty } from '@src/common';
import { ContentStatus } from '@src/content';
import { GQL, useQuery } from '@src/apollo';

const POST_COUNT = 12;

export default function FavoritesPost({ user, ...props }) {
    const navigation = useNavigation();

    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.userPostsQuery, {
        variables: {
            user_id: user.id,
            filter: 'spider',
            count: POST_COUNT,
        },
        fetchPolicy: 'network-only',
    });
    const listData = useMemo(() => data?.userPosts?.data, [data]);
    const nextPage = useMemo(() => data?.userPosts?.paginatorInfo?.currentPage + 1 || 2, [data]);
    const hasMore = useMemo(() => data?.userPosts?.paginatorInfo?.hasMorePages, [data]);
    const isLoading = useRef(false);
    const onEndReached = useCallback(() => {
        if (!isLoading.current && hasMore) {
            isLoading.current = true;
            fetchMore({
                variables: {
                    page: nextPage,
                },
                updateQuery: (prev: any, { fetchMoreResult }) => {
                    isLoading.current = false;
                    if (!fetchMoreResult) return prev;
                    return mergeProperty(prev, fetchMoreResult);
                },
            });
        }
    }, [nextPage, hasMore]);

    const goToScreen = (itemIndex) => {
        navigation.push('FavoritePostList', {
            itemIndex,
            initData: listData,
            page: nextPage,
            variables: {
                user_id: user.id,
                filter: 'spider',
                count: POST_COUNT,
            },
            options: {
                fetchPolicy: 'network-only',
            },
        });
    };

    const renderItem = useCallback(
        ({ item, index }) => {
            let cover;
            if (item?.video?.id) {
                cover = item?.video?.dynamic_cover || item?.video?.cover;
            } else {
                cover = item?.images?.['0']?.url;
            }
            return (
                <Pressable style={styles.itemWrap} onPress={() => goToScreen(index)}>
                    <Image style={styles.videoCover} source={{ uri: cover }} />
                </Pressable>
            );
        },
        [goToScreen],
    );

    return (
        <FlatList
            {...props}
            bounces={false}
            data={listData}
            keyExtractor={(item, index) => String(item.id || index)}
            refreshControl={
                <RefreshControl onRefresh={refetch} refreshing={!!listData && loading} colors={[Theme.primaryColor]} />
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            ListEmptyComponent={
                !loading &&
                listData && (
                    <StatusView.EmptyView
                        title="此处空空如也"
                        imageSource={require('@app/assets/images/default/common_empty_default.png')}
                    />
                )
            }
            numColumns={3}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => (hasMore || loading ? <ContentStatus status="loadMore" /> : null)}
        />
    );
}

const styles = StyleSheet.create({
    itemWrap: {
        width: '33.33%',
        height: percent(33.33) * 1.4,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
        backgroundColor: '#f0f0f0',
    },
    videoCover: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
