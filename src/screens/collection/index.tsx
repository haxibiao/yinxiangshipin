import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import {
    TouchFeedback,
    Row,
    SafeText,
    NavBarHeader,
    StatusView,
    ListFooter,
    PageContainer,
    PullChooser,
} from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GQL, useMutation } from '@src/apollo';
import { useApolloClient } from '@apollo/react-hooks';
import { QueryList } from '@src/content';
import { userStore } from '@app/src/store';
import CollectionItem from './components/CollectionItem';

export default function CollectionScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const client = useApolloClient();
    const user_id = route?.params?.user?.id || userStore.me.id;
    const isSelf = user_id === userStore.me.id;
    const deleteCollectionMutation = useCallback(({ collection_id }) => {
        client
            .mutate({
                mutation: GQL.deleteCollectionMutation,
                variables: {
                    id: collection_id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.CollectionsQuery,
                        variables: {
                            user_id: user_id,
                        },
                    },
                    {
                        query: GQL.followedCollectionsQuery,
                        variables: {
                            user_id: user_id,
                            followed_type: 'collections',
                        },
                    },
                ],
            })
            .then((result) => {
                Toast.show({
                    content: '删除成功',
                });
            })
            .catch((error) => {
                Toast.show({
                    content: errorMessage(error) || '删除失败',
                });
            });
    }, []);

    const onLongPress = useCallback(
        (id) => {
            const operations = [];
            if (isSelf) {
                operations.push({
                    title: '删除合集',
                    onPress: () => deleteCollectionMutation({ collection_id: id }),
                });
            }
            PullChooser.show(operations);
        },
        [isSelf],
    );

    return (
        <PageContainer
            title="我的合集"
            titleStyle={{ fontSize: font(16) }}
            rightView={
                isSelf && (
                    <TouchFeedback onPress={() => navigation.navigate('创建合集')}>
                        <Text style={{ fontSize: font(14), color: Theme.navBarTitleColor || '#666' }}>创建</Text>
                    </TouchFeedback>
                )
            }>
            <QueryList
                gqlDocument={GQL.CollectionsQuery}
                dataOptionChain="collections.data"
                paginateOptionChain="collections.paginatorInfo"
                options={{
                    variables: {
                        user_id: user_id,
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={({ item, index }) => (
                    <CollectionItem
                        item={item}
                        index={index}
                        navigation={navigation}
                        onLongPress={() => isSelf && onLongPress(item.id)}
                    />
                )}
                contentContainerStyle={styles.container}
            />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    rowBoxItem: {
        flexDirection: 'row',
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingVertical: pixel(Theme.itemSpace),
        borderBottomWidth: pixel(0.5),
        borderColor: '#666',
        alignItems: 'center',
    },
    logoImg: {
        width: pixel(60),
        height: pixel(60),
        marginRight: pixel(Theme.itemSpace),
        resizeMode: 'cover',
        borderRadius: pixel(3),
    },
    collectionIcon: {
        width: pixel(12),
        height: pixel(12),
        resizeMode: 'cover',
        marginRight: pixel(3),
    },
    collectionInfo: {
        fontSize: font(11),
        marginTop: pixel(10),
        color: '#666',
    },
});
