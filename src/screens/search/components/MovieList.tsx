import React, { useCallback, useMemo, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    FlatListProperties,
    ViewStyle,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { QueryHookOptions } from '@apollo/react-hooks';
import { DocumentNode } from 'graphql';
import { GQL, useQuery } from '@src/apollo';
import { syncGetter, mergeProperty } from '@src/common';
import { ContentStatus } from '@src/content';
import { useNavigation } from '@react-navigation/native';
import { userStore } from '@src/store';
interface Props extends FlatListProperties {
    gqlDocument?: DocumentNode;
    dataOptionChain?: string;
    paginateOptionChain?: string;
    style?: ViewStyle;
    options?: QueryHookOptions;
    focusRefresh?: boolean;
    keyword: string;
}

export default React.forwardRef(function ContentList(
    {
        gqlDocument,
        dataOptionChain = 'publicPosts.data',
        paginateOptionChain = 'publicPosts.paginatorInfo',
        options,
        focusRefresh,
        renderItem,
        ListHeaderComponent,
        ListFooterComponent,
        ListEmptyComponent,
        inverted,
        keyword,
        ...contentProps
    }: Props,
    listRef,
): JSX.Element {
    const { loading, error, data, fetchMore, refetch } = useQuery(gqlDocument || GQL.publicPostsQuery, options);
    const listData = useMemo(() => syncGetter(dataOptionChain, data), [data]);
    const nextPage = useMemo(() => syncGetter(paginateOptionChain + '.currentPage', data) + 1 || 2, [data]);
    const hasMore = useMemo(() => syncGetter(paginateOptionChain + '.hasMorePages', data), [data]);
    const isLoading = useRef(false);
    const navigation = useNavigation();
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

    // useFocusEffect(
    //     useCallback(() => {
    //         if (focusRefresh) {
    //             if (refetch instanceof Function) {
    //                 refetch();
    //             }
    //         }
    //     }, [focusRefresh, refetch]),
    // );

    const renderItemComponent = useCallback(
        ({ item, index }) => {
            if (renderItem instanceof Function) {
                return renderItem({ item, index, data: listData, page: nextPage });
            }
            return null;
        },
        [renderItem, listData, nextPage],
    );
    const listHeader = useCallback(() => {
        let header = null;
        if (ListHeaderComponent instanceof Function) {
            header = ListHeaderComponent({ loading, data });
        }
        return header;
    }, [ListHeaderComponent, loading, data]);

    const listFooter = useCallback(() => {
        let footer = null;
        if (ListFooterComponent instanceof Function) {
            footer = ListFooterComponent({ loading, hasMore, data: listData });
        } else {
            if (!loading && hasMore) {
                footer = <ContentStatus status="loadMore" />;
            }
            if (listData?.length > 0 && !hasMore) {
                footer = (
                    <View style={styles.listFooter}>
                        <Text style={styles.listFooterText}>底都被你看光了</Text>
                    </View>
                );
            }
        }
        return footer;
    }, [ListFooterComponent, loading, listData, hasMore]);

    // 求片发布页面路由导航
    const getMovieHandle = useCallback(() => {
        if (!userStore.login) {
            navigation.navigate('Login');
        } else {
            navigation.navigate('getMovie', { keyword });
        }
    }, [keyword, userStore]);

    const listEmpty = useCallback(() => {
        let status = '';
        switch (true) {
            case !!error:
                status = 'error';
                break;
            case loading:
                status = 'loading';
                break;
            case listData?.length === 0:
                status = 'empty';
                break;
            default:
                break;
        }
        if (ListEmptyComponent instanceof Function) {
            return ListEmptyComponent({ status, refetch });
        } else if (status) {
            return dataOptionChain == 'searchMovie.data' ? (
                <View>
                    <ContentStatus status={status} refetch={status === 'error' ? refetch : undefined} />
                    <View style={{ width: Device.width, alignItems: 'center', justifyContent: 'center' }}>
                        {listData?.length === 0 && (
                            <TouchableOpacity onPress={() => getMovieHandle()}>
                                <View style={styles.getMovieBottom}>
                                    <Text style={{ color: '#fff', fontSize: font(15), fontWeight: 'bold' }}>
                                        在线求片
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            ) : (
                <ContentStatus status={status} refetch={status === 'error' ? refetch : undefined} />
            );
        } else {
            return null;
        }
    }, [ListEmptyComponent, loading, listData, error, refetch]);

    return (
        <FlatList
            inverted={listData?.length > 0 ? inverted : false}
            contentContainerStyle={styles.container}
            ref={listRef}
            data={listData}
            keyExtractor={(item, index) => String(item.id || index)}
            refreshControl={
                <RefreshControl onRefresh={refetch} refreshing={!!listData && loading} colors={[Theme.primaryColor]} />
            }
            renderItem={renderItemComponent}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            ListHeaderComponent={listHeader}
            ListFooterComponent={listFooter}
            ListEmptyComponent={listEmpty}
            {...contentProps}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    listFooter: {
        paddingVertical: pixel(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooterText: {
        fontSize: font(13),
        color: '#b4b4b4',
    },
    getMovieBottom: {
        backgroundColor: '#F4606C',
        width: Device.width - pixel(200),
        height: (Device.width - pixel(200)) / 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pixel(25),
    },
});
