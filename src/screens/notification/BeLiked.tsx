import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GQL } from '@src/apollo';
import { NavBarHeader } from '@src/components';
import { QueryList } from '@src/content';
import NotificationItem from './components/NotificationItem';

export default (props: any) => {
    const renderItem = useCallback(({ item, index }) => {
        return <NotificationItem data={item} />;
    }, []);
    return (
        <View style={styles.container}>
            <NavBarHeader title="喜欢和赞" StatusBarProps={{ barStyle: 'dark-content' }} />
            <QueryList
                contentContainerStyle={styles.contentContainer}
                gqlDocument={GQL.likeNotificationsQuery}
                dataOptionChain="notifications.data"
                paginateOptionChain="notifications.paginatorInfo"
                options={{
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
