import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer } from '@src/components';
import { useRoute } from '@react-navigation/native';
import { GQL } from '@src/apollo';
import { QueryList, PostItem, CaptureContent } from '@src/content';

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
                gqlDocument={GQL.userPostsQuery}
                dataOptionChain="userPosts.data"
                paginateOptionChain="userPosts.paginatorInfo"
                options={{
                    variables: {
                        user_id: route?.params?.user?.id,
                        filter: 'spider',
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.container}
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
