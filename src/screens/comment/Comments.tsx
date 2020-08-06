import React, { useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, FlatList, Keyboard } from 'react-native';
import { ItemSeparator, KeyboardSpacer, ListFooter, StatusView } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { observer, userStore } from '@src/store';

import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

interface Props {
    commentAbleId: Int; // 评论所属content的id
}

const Comments = observer((props: Props) => {
    const { commentAbleType, commentAbleId, media } = props;
    const [replyByComment, setReplyByComment] = useState();
    const flatListRef = useRef();
    const fancyInputRef = useRef();
    // 是不是提问者：是不是问题类型，作者是不是我

    const increaseCountComments = useCallback(() => {
        media.count_comments++;
    }, [media]);

    const decreaseCountComments = useCallback(() => {
        media.count_comments--;
        refetch();
    }, [media]);

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
        variables: { commentable_type: commentAbleType, commentable_id: commentAbleId, replyCount: 3 },
        fetchPolicy: 'network-only',
    });
    const commentsData = useMemo(() => Helper.syncGetter('comments.data', data), [data]);
    let currentPage = useMemo(() => Helper.syncGetter('comments.paginatorInfo.currentPage', data), [data]);
    const hasMorePages = useMemo(() => Helper.syncGetter('comments.paginatorInfo.hasMorePages', data), [data]);
    const hiddenListFooter = commentsData && commentsData.length === 0;
    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={styles.contentContainerStyle}
                showsVerticalScrollIndicator={false}
                ref={flatListRef}
                data={commentsData}
                renderItem={({ item }) => {
                    return (
                        <CommentItem
                            separator={true}
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
                onEndReached={() => {
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
                }}
            />
            <CommentInput
                commentAbleType={commentAbleType}
                updateScrollOffset={updateScrollOffset}
                increaseCountComments={increaseCountComments}
                commentAbleId={commentAbleId}
                replyByComment={replyByComment}
                setReplyByComment={setReplyByComment}
                ref={fancyInputRef}
            />
            <KeyboardSpacer topInsets={-Theme.HOME_INDICATOR_HEIGHT} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    contentContainerStyle: {
        flexGrow: 1,
    },
});

export default Comments;
