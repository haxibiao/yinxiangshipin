import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import { observer, userStore } from '@src/store';
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

    return (
        <QueryList
            focusRefresh={true}
            contentContainerStyle={styles.container}
            gqlDocument={GQL.publicPostsQuery}
            dataOptionChain="publicPosts.data"
            paginateOptionChain="publicPosts.paginatorInfo"
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
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Device.tabBarHeight,
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
