import React, { Component, useState, useCallback, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, Keyboard } from 'react-native';
import {
    Player,
    PageContainer,
    Row,
    Avatar,
    TouchFeedback,
    KeyboardSpacer,
    ListFooter,
    StatusView,
} from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { observer, userStore } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';

import CommentItem from '../comment/CommentItem';
import CommentInput from '../comment/CommentInput';
import FeedbackItem from './FeedbackItem';

interface Props {
    navigation: any;
}
const index = (props: Props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const feedback = route.params?.feedback;
    const [replyByComment, setReplyByComment] = useState();
    const flatListRef = useRef();
    const fancyInputRef = useRef();

    const isQuestioner = useMemo(() => feedback.user.id === userStore.me.id, [feedback, userStore.me.id]);

    const increaseCountComments = useCallback(() => {
        feedback.count_comments++;
    }, [feedback]);

    const decreaseCountComments = useCallback(() => {
        feedback.count_comments--;
        refetch();
    }, [feedback]);

    const updateScrollOffset = useCallback(() => {
        flatListRef.current.scrollToOffset({ y: 0 });
    }, [flatListRef]);

    const replyHandler = useCallback(
        (comment) => {
            fancyInputRef.current.focus();
            setReplyByComment(comment);
        },
        [fancyInputRef],
    );

    const { data, refetch, fetchMore } = useQuery(GQL.commentsQuery, {
        variables: { commentable_type: 'feedbacks', commentable_id: feedback.id, replyCount: 3 },
        fetchPolicy: 'network-only',
    });
    const commentsData = useMemo(() => Helper.syncGetter('comments.data', data), [data]);
    let currentPage = useMemo(() => Helper.syncGetter('comments.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('comments.paginatorInfo.hasMorePages', data), [data]);
    const hiddenListFooter = commentsData && commentsData.length === 0;

    const fetchMoreComments = useCallback(() => {
        if (hasMorePages) {
            fetchMore({
                variables: {
                    page: ++currentPage,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (fetchMoreResult && fetchMoreResult.comments) {
                        return Object.assign({}, prev, {
                            comments: Object.assign({}, prev.comments, {
                                paginatorInfo: fetchMoreResult.comments.paginatorInfo,
                                data: [...prev.comments.data, ...fetchMoreResult.comments.data],
                            }),
                        });
                    }
                },
            });
        }
    }, [hasMorePages, currentPage]);

    const onScroll = useCallback(
        (e) => {
            const { contentOffset, contentSize } = e.nativeEvent;
            // fetchMore触发条件
            if (contentSize.height - contentOffset.y < Device.HEIGHT - pixel(50)) {
                __.throttle(fetchMoreComments, 500);
            }
        },
        [fetchMoreComments],
    );

    return (
        <PageContainer title="详情" safeView>
            <ScrollView
                onScroll={onScroll}
                style={styles.container}
                contentContainerStyle={styles.contentContainerStyle}
                keyboardShouldPersistTaps={'handled'}>
                <FeedbackItem feedback={feedback} />
                <View>
                    <View style={styles.commentsHeader}>
                        <Text style={{ color: '#CBD8E1' }}>{`所有评论(${feedback.count_comment || 0})`}</Text>
                    </View>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    ref={flatListRef}
                    data={commentsData}
                    renderItem={({ item }) => {
                        return (
                            <CommentItem
                                isQuestioner={isQuestioner}
                                comment={item}
                                replyHandler={replyHandler}
                                decreaseCountComments={decreaseCountComments}
                            />
                        );
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={() => (
                        <StatusView.EmptyView imageSource={require('@app/assets/images/default_comment.png')} />
                    )}
                    ListFooterComponent={() => <ListFooter hidden={hiddenListFooter} finished={!hasMorePages} />}
                    keyboardShouldPersistTaps="always"
                    onEndReachedThreshold={0.3}
                    onScrollBeginDrag={() => {
                        Keyboard.dismiss();
                    }}
                />
            </ScrollView>
            <CommentInput
                commentAbleType={'feedbacks'}
                updateScrollOffset={updateScrollOffset}
                increaseCountComments={increaseCountComments}
                commentAbleId={feedback.id}
                replyByComment={replyByComment}
                setReplyByComment={setReplyByComment}
                ref={fancyInputRef}
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    contentWrap: {
        margin: pixel(Theme.itemSpace),
    },
    commentsHeader: {
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(0.5),
        paddingVertical: pixel(15),
        paddingLeft: pixel(15),
    },
});

export default index;
