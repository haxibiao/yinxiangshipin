import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer } from '@src/components';
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
                        filter: 'normal',
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
