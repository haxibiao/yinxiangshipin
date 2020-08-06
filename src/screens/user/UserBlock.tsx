import React, { useState, useMemo } from 'react';
import { Text, FlatList } from 'react-native';
import {
    PageContainer,
    UserItem,
    Placeholder,
    ListFooter,
    CustomRefreshControl,
    StatusView,
    SpinnerLoading,
} from '@src/components';
import { GQL, useQuery } from '@src/apollo';

import { userStore } from '@src/store';
import UserBlockItem from './components/UserBlockItem';

const UserBlock = () => {
    const { me } = userStore;
    const [finished, setFinished] = useState(false);

    const { loading, data: userBlockQuery, refetch, fetchMore } = useQuery(GQL.showUserBlockQuery, {
        variables: { user_id: me.id },
        fetchPolicy: 'network-only',
    });
    const listData = useMemo(() => Helper.syncGetter('showUserBlock.data', userBlockQuery), [userBlockQuery]);
    const hasMorePages = useMemo(() => Helper.syncGetter('showUserBlock.paginatorInfo.hasMorePages', userBlockQuery), [
        userBlockQuery,
    ]);
    const currentPage = useMemo(() => Helper.syncGetter('showUserBlock.paginatorInfo.currentPage', userBlockQuery), [
        userBlockQuery,
    ]);

    if (!finished && listData) {
        // console.log('拉黑的', listData);
        setFinished(true);
    }

    if (loading || !listData) return <SpinnerLoading />;

    return (
        <PageContainer title="小黑屋" while loadingSpinner={<Placeholder quantity={10} type="list" />}>
            <FlatList
                style={{ flex: 1 }}
                data={listData}
                refreshing={loading}
                keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                renderItem={({ item, index }) => <UserBlockItem user={item} />}
                onEndReachedThreshold={0.3}
                ListEmptyComponent={
                    <StatusView.EmptyView imageSource={require('@app/assets/images/default_empty.png')} />
                }
                onEndReached={() => {
                    if (hasMorePages) {
                        fetchMore({
                            variables: {
                                page: currentPage + 1,
                            },
                            updateQuery: (prev: any, { fetchMoreResult: more }) => {
                                if (more && more.likes) {
                                    return {
                                        likes: {
                                            ...more.likes,
                                            data: [...prev.likes.data, ...more.likes.data],
                                        },
                                    };
                                }
                            },
                        });
                    }
                }}
                ListFooterComponent={() => (hasMorePages ? <Placeholder quantity={1} /> : null)}
            />
        </PageContainer>
    );
};

export default UserBlock;
