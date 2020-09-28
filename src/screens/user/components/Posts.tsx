import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { HPageViewHoc } from 'components/ScrollHeaderTabView';
import { StatusView, Placeholder, CustomRefreshControl, SpinnerLoading } from '@src/components';
import { PostItem, QueryList } from '@src/content';
import { observer, userStore } from '@src/store';
import { Query, useQuery, GQL } from '@src/apollo';
import { observable } from 'mobx';
import { useNavigation } from '@react-navigation/native';

const HFlatList = HPageViewHoc(FlatList);

export default (props: any) => {
    const navigation = useNavigation();
    const { loading, error, data, refetch, fetchMore } = useQuery(GQL.postsQuery, {
        variables: { user_id: props.user.id },
        fetchPolicy: 'network-only',
    });
    const posts = useMemo(() => Helper.syncGetter('posts.data', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('posts.paginatorInfo.hasMorePages', data), [data]);
    const currentPage = useMemo(() => Helper.syncGetter('posts.paginatorInfo.currentPage', data), [data]);

    const renderItem = useCallback(({ item }) => {
        return <PostItem data={item} />;
    }, []);

    const headerComponent = useCallback(() => {
        return (
            <QueryList
                gqlDocument={GQL.CollectionsQuery}
                dataOptionChain="collections.data"
                paginateOptionChain="collections.paginatorInfo"
                options={{
                    variables: {
                        user_id: props.user.id,
                    },
                    fetchPolicy: 'network-only',
                }}
                contentContainerStyle={styles.container}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index, data }) => (
                    <TouchableOpacity
                        style={[styles.collectionItem, index === data.length - 1 && { marginRight: 0 }]}
                        onPress={() => navigation.navigate('CollectionDetail', { collection: item })}>
                        <Image
                            source={require('@app/assets/images/icons/ic_collection_gray.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.collectionText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={() => {
                    return null;
                }}
            />
        );
    }, []);
    return (
        <HFlatList
            {...props}
            bounces={false}
            data={posts}
            refreshing={loading}
            refreshControl={<CustomRefreshControl onRefresh={refetch} />}
            keyExtractor={(item: any, index: number) => String(index || item.id)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
                !loading &&
                posts && (
                    <StatusView.EmptyView
                        title="TA还没有作品"
                        imageSource={require('@app/assets/images/default_empty.png')}
                    />
                )
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
            ListHeaderComponent={headerComponent}
            ListFooterComponent={() => (hasMorePages || loading ? <Placeholder quantity={1} /> : null)}
        />
    );
};

const styles = StyleSheet.create({
    collectionItem: {
        flexDirection: 'row',
        backgroundColor: '#f4f4f4',
        borderRadius: pixel(3),
        marginRight: pixel(5),
        alignItems: 'center',
        marginTop: pixel(10),
        paddingHorizontal: pixel(Theme.itemSpace) / 2,
    },
    icon: {
        width: pixel(12),
        height: pixel(12),
        resizeMode: 'cover',
        marginRight: pixel(2),
    },
    collectionText: {
        fontSize: font(10),
        color: '#666',
    },
    container: {
        paddingHorizontal: pixel(Theme.itemSpace),
        height: pixel(40),
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
