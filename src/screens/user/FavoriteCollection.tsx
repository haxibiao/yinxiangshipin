import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { PageContainer } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import { userStore } from '@app/src/store';
import CollectionItem from '@src/screens/collection/components/CollectionItem';

export default () => {
    const route = useRoute();
    const navigation = useNavigation();
    const user_id = route?.params?.user?.id;
    const isSelf = user_id === userStore.me.id;

    return (
        <PageContainer title={isSelf ? '我收藏的合集' : 'TA收藏的合集'}>
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
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.bottomInset,
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
    tabBarStyle: {
        height: pixel(42),
        paddingHorizontal: pixel(Theme.edgeDistance),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
    },
    tabStyle: {
        alignItems: 'flex-start',
    },
    underlineStyle: {
        width: pixel(30),
        left: pixel(Theme.edgeDistance),
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
