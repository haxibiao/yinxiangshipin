import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GQL } from '@src/apollo';
import { observer, userStore } from '@src/store';
import { QueryList, ContentStatus, Placeholder } from '@src/content';
import { useNavigation } from '@react-navigation/native';
import PostWithAD from './components/PostWithAD';

export default observer((props: any) => {
    const navigation = useNavigation();

    const isFeedADList = [];
    const adClick = useCallback((index) => {
        if (isFeedADList.indexOf(index) === -1) {
            isFeedADList.push(index);
        }
    }, []);
    const renderItem = useCallback(({ item, index }) => {
        return <PostWithAD item={item} index={index} adClick={adClick} />;
    }, []);

    // const emptyView = useCallback(({ status, refetch }) => {
    //     if (status) {
    //         if (status === 'empty') {
    //             return <Placeholder.NoContent style={{ flex: 1 }} onPress={() => navigation.navigate('Login')} />;
    //         }
    //         return <ContentStatus status={status} refetch={status === 'error' ? refetch : undefined} />;
    //     } else {
    //         return null;
    //     }
    // }, []);

    if (!userStore.login) {
        return <Placeholder.NotLogged style={{ flex: 1 }} onPress={() => navigation.navigate('Login')} />;
    }

    return (
        <QueryList
            focusRefresh={true}
            contentContainerStyle={styles.container}
            gqlDocument={GQL.followPostsQuery}
            dataOptionChain="followPosts.data"
            paginateOptionChain="followPosts.paginatorInfo"
            options={{
                variables: {
                    user_id: userStore?.me?.id,
                    page: 1,
                    count: 10,
                    filter: 'all',
                },
                fetchPolicy: 'network-only',
            }}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            // ListEmptyComponent={emptyView}
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
