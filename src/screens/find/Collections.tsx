import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GQL } from '@src/apollo';
import { observer, userStore } from '@src/store';
import { QueryList } from '@src/content';
import PostWithAD from './components/PostWithAD';

export default observer((props: any) => {
    const isFeedADList = [];

    const adClick = useCallback((index) => {
        if (isFeedADList.indexOf(index) === -1) {
            isFeedADList.push(index);
        }
    }, []);

    const renderItem = useCallback(({ item, index }) => {
        return <PostWithAD item={item} index={index} adClick={adClick} />;
    }, []);

    return (
        <QueryList
            gqlDocument={GQL.followPostsQuery}
            dataOptionChain="followPosts.data"
            paginateOptionChain="followPosts.paginatorInfo"
            options={{
                variables: {
                    user_id: userStore?.me?.id,
                    page: 1,
                    count: 10,
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.container}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.BOTTOM_HEIGHT,
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
