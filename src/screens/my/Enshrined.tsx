import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer, ScrollTabBar } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GQL } from '@src/apollo';
import { QueryList, PostItem, CaptureContent } from '@src/content';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import CollectionItem from '@src/screens/collection/components/CollectionItem';

export default () => {
    const route = useRoute();
    const navigation = useNavigation();
    const user_id = route?.params?.user?.id;
    const renderItem = useCallback(({ item }) => {
        return (
            <PostItem data={item}>
                <CaptureContent />
            </PostItem>
        );
    }, []);
    const UserPostsQuery = ({ user_id }) => {
        return (
            <QueryList
                gqlDocument={GQL.userPostsQuery}
                dataOptionChain="userPosts.data"
                paginateOptionChain="userPosts.paginatorInfo"
                options={{
                    variables: {
                        user_id: user_id,
                        filter: 'spider',
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.container}
            />
        );
    };
    const FollowedCollectionsQuery = ({ user_id }) => {
        return (
            <QueryList
                gqlDocument={GQL.followedCollectionsQuery}
                dataOptionChain="follows.data"
                paginateOptionChain="follows.paginatorInfo"
                options={{
                    variables: {
                        user_id: user_id,
                        followed_type: 'collections',
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={({ item, index }) => (
                    <CollectionItem item={item.collection} index={index} navigation={navigation} />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.container}
            />
        );
    };
    return (
        <PageContainer title="我的收藏">
            <ScrollableTabView
                style={{ flex: 1 }}
                renderTabBar={(props) => (
                    <ScrollTabBar
                        {...props}
                        tabWidth={pixel(70)}
                        style={styles.tabBarStyle}
                        tabStyle={styles.tabStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <UserPostsQuery tabLabel="动态" user_id={user_id} />
                <FollowedCollectionsQuery tabLabel="合集" user_id={user_id} />
            </ScrollableTabView>
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
    tabBarStyle: {
        height: pixel(42),
        paddingHorizontal: pixel(Theme.itemSpace),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
    },
    tabStyle: {
        alignItems: 'flex-start',
    },
    underlineStyle: {
        width: pixel(30),
        left: pixel(Theme.itemSpace),
    },
    activeTextStyle: {
        color: '#212121',
        fontSize: font(16),
    },
    tintTextStyle: {
        color: '#D0D0D0',
        fontSize: font(16),
    },
});
