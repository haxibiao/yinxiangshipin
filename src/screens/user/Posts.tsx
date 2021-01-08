import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavBarHeader } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GQL } from '@src/apollo';
import { QueryList, PostItem } from '@src/content';

export default () => {
    const navigation = useNavigation();
    const route = useRoute();
    const user_id = useMemo(() => route?.params?.user?.id, [route]);

    const renderItem = useCallback(({ item }) => {
        return <PostItem data={item} />;
    }, []);

    return (
        <View style={styles.container}>
            <NavBarHeader
                StatusBarProps={{ barStyle: 'dark-content' }}
                title="个人动态"
                hasSearchButton={true}
                onPressSearch={() => navigation.push('SearchVideo', { user_id })}
            />
            <QueryList
                gqlDocument={GQL.userPostsQuery}
                dataOptionChain="userPosts.data"
                paginateOptionChain="userPosts.paginatorInfo"
                options={{
                    variables: {
                        user_id,
                        filter: 'normal',
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.contentContainer}
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
