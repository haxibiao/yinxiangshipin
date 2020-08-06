import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer, ItemSeparator } from '@src/components';
import { useRoute } from '@react-navigation/native';
import { QueryList, PostItem, GQL } from '@src/content';

export default () => {
    const route = useRoute();

    const renderItem = useCallback(({ item }) => {
        return <PostItem data={item} />;
    }, []);

    return (
        <PageContainer title="个人动态">
            <QueryList
                gqlDocument={GQL.postsQuery}
                dataOptionChain="posts.data"
                paginateOptionChain="posts.paginatorInfo"
                options={{
                    variables: {
                        user_id: route?.params?.user?.id,
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <ItemSeparator />}
                contentContainerStyle={styles.container}
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.BOTTOM_HEIGHT,
    },
});
