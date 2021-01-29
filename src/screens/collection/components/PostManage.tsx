import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QueryList } from '@src/content';
import { userStore, appStore, notificationStore } from '@src/store';
import { Iconfont } from '@src/components';
import { GQL, exceptionCapture } from '@src/apollo';

type operation = 'delete' | 'add';

export default ({ collection, operation, onClose }) => {
    const [posts, setPosts] = useState([]);

    // 合集中批量添加/删除动态操作
    const confirmBtn = async () => {
        function mutation() {
            return appStore.client.mutate({
                mutation: operation === 'delete' ? GQL.moveOutCollectionsMutation : GQL.moveInCollectionsMutation,
                variables: {
                    collection_id: collection?.id,
                    collectable_ids: posts.map((item) => {
                        return item.id;
                    }),
                },
                refetchQueries: () => [
                    {
                        query: GQL.collectionPostsQuery,
                        variables: { collection_id: collection?.id, count: 10 },
                        fetchPolicy: 'network-only',
                    },
                ],
            });
        }
        if (appStore.client) {
            notificationStore.toggleLoadingVisible();
            const [err, res] = await exceptionCapture(mutation);
            notificationStore.toggleLoadingVisible();
            const result = operation === 'delete' ? res?.data?.moveOutCollections : res?.data?.moveInCollections;
            if (result) {
                onClose();
                Toast.show({ content: '更新章节成功', layout: 'top' });
            } else {
                Toast.show({ content: '更新章节失败', layout: 'top' });
            }
        } else {
            Toast.show({ content: '更新章节失败', layout: 'top' });
        }
    };

    const renderItem = useCallback(
        ({ item }) => {
            return <PostItem post={item} collection={collection} setPosts={setPosts} operation={operation} />;
        },
        [operation, collection],
    );

    const PostList = useMemo(() => {
        if (operation === 'delete') {
            return (
                <QueryList
                    gqlDocument={GQL.collectionPostsQuery}
                    dataOptionChain="collection.posts.data"
                    paginateOptionChain="collection.posts.paginatorInfo"
                    options={{
                        variables: {
                            collection_id: collection.id,
                        },
                        fetchPolicy: 'network-only',
                    }}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.contentContainer}
                />
            );
        } else {
            return (
                <QueryList
                    gqlDocument={GQL.postsQuery}
                    dataOptionChain="posts.data"
                    paginateOptionChain="posts.paginatorInfo"
                    options={{
                        variables: {
                            user_id: userStore.me.id,
                        },
                        fetchPolicy: 'network-only',
                    }}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.contentContainer}
                />
            );
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{operation === 'delete' ? '删除章节' : '添加章节'}</Text>
                <Pressable style={styles.headerButton} disabled={posts.length < 1} onPress={confirmBtn}>
                    <Text style={[styles.buttonText, posts.length > 0 && { color: Theme.primaryColor }]}>
                        {operation === 'delete' ? '删除' : '添加'}
                    </Text>
                </Pressable>
            </View>
            {PostList}
        </View>
    );
};

export function PostItem({ post, collection, setPosts, operation }) {
    const [selected, setSelected] = useState(false);

    const notSelected = useMemo(() => {
        if (operation !== 'delete' && post?.collections?.length > 0) {
            return post?.collections?.every((item) => {
                return item?.id == collection?.id;
            });
        } else {
            return false;
        }
    }, []);

    const toggle = useCallback(() => {
        if (notSelected) {
            Toast.show({ content: '该作品已添加', layout: 'top' });
            return;
        }
        setPosts((data) => {
            const index = data?.indexOf(post);
            if (index >= 0) {
                data.splice(index, 1);
                setSelected(false);
            } else {
                data.push(post);
                setSelected(true);
            }
            return [...data];
        });
    }, [notSelected, setPosts]);

    let cover;
    if (post?.video?.id) {
        cover = post?.video?.cover;
    } else {
        cover = post?.images?.['0']?.url;
    }

    return (
        <Pressable style={[styles.postItem, { opacity: notSelected ? 0.5 : 1 }]} onPress={toggle}>
            <Image style={styles.postCover} source={{ uri: cover }} />
            <View style={styles.postContent}>
                <View style={styles.description}>
                    <Text style={styles.postBody} numberOfLines={2}>
                        {String(post?.content || post?.description).trim()}
                    </Text>
                </View>
                <Text style={styles.metaInfo} numberOfLines={1}>
                    {post?.created_at && <Text>{post.created_at}</Text>}
                    {post?.count_comments > 0 && <Text> · {post.count_comments}评论</Text>}
                    {post?.count_likes > 0 && <Text> · {post.count_likes}点赞 </Text>}
                </Text>
            </View>
            <Image
                source={
                    selected
                        ? require('@app/assets/images/icons/ic_radio_check.png')
                        : require('@app/assets/images/icons/ic_radio_uncheck.png')
                }
                style={styles.itemRadio}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        height: (Device.height * 2) / 3,
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: pixel(Device.bottomInset),
    },
    separator: {
        height: pixel(1),
        marginHorizontal: pixel(Theme.edgeDistance),
        backgroundColor: '#f4f4f4',
    },
    header: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    headerText: {
        color: Theme.defaultTextColor,
        fontSize: pixel(16),
        fontWeight: 'bold',
    },
    headerButton: {
        alignItems: 'center',
        bottom: 0,
        height: pixel(44),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        width: pixel(44),
    },
    buttonText: {
        color: '#b2b2b2',
        fontSize: pixel(15),
    },
    postItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: pixel(Theme.edgeDistance),
    },
    postCover: {
        width: pixel(70),
        height: pixel(70),
        borderRadius: pixel(2),
        backgroundColor: '#f0f0f0',
    },
    postContent: {
        flex: 1,
        marginLeft: pixel(12),
        justifyContent: 'space-between',
    },
    description: {
        marginBottom: pixel(10),
    },
    postBody: {
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
    },
    metaInfo: {
        fontSize: font(12),
        lineHeight: font(16),
        color: '#b2b2b2',
    },
    itemRadio: {
        marginLeft: pixel(15),
        width: pixel(20),
        height: pixel(20),
    },
});
