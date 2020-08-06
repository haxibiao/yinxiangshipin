import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer, ItemSeparator } from '@src/components';
import { useRoute } from '@react-navigation/native';
import { QueryList, PostItem, GQL, CaptureContent } from '@src/content';

export default () => {
    const route = useRoute();

    const renderItem = useCallback(({ item }) => {
        return (
            <PostItem data={item}>
                <CaptureContent />
            </PostItem>
        );
    }, []);

    return (
        <PageContainer title="我的收藏">
            <QueryList
                gqlDocument={GQL.colllectionPosts}
                dataOptionChain="colllectionPosts.data"
                paginateOptionChain="colllectionPosts.paginatorInfo"
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
