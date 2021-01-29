import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Row, SafeText, NavBarHeader, StatusView, ListFooter, PageContainer, PullChooser } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GQL, useMutation } from '@src/apollo';
import { useApolloClient } from '@apollo/react-hooks';
import { QueryList } from '@src/content';
import { userStore } from '@app/src/store';
import CollectionItem from '@src/screens/collection/components/CollectionItem';

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
                        query: GQL.collectionsQuery,
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
            title={isSelf ? '我的合集' : 'TA的合集'}
            rightView={
                isSelf && (
                    <TouchableOpacity onPress={() => navigation.navigate('CreateCollection')}>
                        <Text style={{ fontSize: font(15), color: Theme.primaryColor }}>新建</Text>
                    </TouchableOpacity>
                )
            }>
            <QueryList
                contentContainerStyle={styles.container}
                gqlDocument={GQL.collectionsQuery}
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
                        collection={item}
                        navigation={navigation}
                        onLongPress={() => isSelf && onLongPress(item.id)}
                    />
                )}
            />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
});
