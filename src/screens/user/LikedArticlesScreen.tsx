import React, { useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer } from '@src/components';
import { GQL } from '@src/apollo';
import { QueryList, PostItem } from '@src/content';
import { userStore } from '@src/store';

export default (props: any) => {
    const renderItem = useCallback(({ item }) => {
        return <PostItem data={item?.article} />;
    }, []);

    return (
        <PageContainer title="我的喜欢">
            <QueryList
                gqlDocument={GQL.userLikedArticlesQuery}
                dataOptionChain="likes.data"
                paginateOptionChain="likes.paginatorInfo"
                options={{
                    variables: {
                        user_id: userStore.me.id,
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
