import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { observer } from '@src/store';
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
