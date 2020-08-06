import React, { useState, useRef, useCallback, useImperativeHandle } from 'react';
import { GQL } from './gqls';
import { useApolloClient } from '@apollo/react-hooks';
import { userStore } from '@src/store';

export const useCommentMutation = props => {
    const { commentAbleType, commentAbleId, replyComment, onCompleted, onError } = props;
    const client = useApolloClient();

    const updateCommentsQuery = useCallback(
        (cache, { data: { addComment } }) => {
            const prev = cache.readQuery({
                query: GQL.commentsQuery,
                variables: {
                    commentable_type: commentAbleType,
                    commentable_id: commentAbleId,
                    replyCount: 3,
                },
            });
            if (replyComment) {
                let findIndex;
                const commentItem = __.find(prev.comments.data, function(comment, index) {
                    findIndex = index;
                    return comment.id === replyComment.id;
                });
                const commentsData = Array.isArray(commentItem.comments.data) ? commentItem.comments.data : [];
                commentItem.comments = Object.assign({}, commentItem.comments, {
                    data: [addComment, ...commentsData],
                });
                prev.comments.data[findIndex] = commentItem;
                cache.writeQuery({
                    query: GQL.commentsQuery,
                    variables: {
                        commentable_type: commentAbleType,
                        commentable_id: commentAbleId,
                        replyCount: 3,
                    },
                    data: {
                        comments: Object.assign({}, prev.comments, {
                            data: [...prev.comments.data],
                        }),
                    },
                });
            } else {
                cache.writeQuery({
                    query: GQL.commentsQuery,
                    variables: {
                        commentable_type: commentAbleType,
                        commentable_id: commentAbleId,
                        replyCount: 3,
                    },
                    data: {
                        comments: Object.assign({}, prev.comments, {
                            data: [addComment, ...prev.comments.data],
                        }),
                    },
                });
            }
        },
        [replyComment, commentAbleId],
    );
    const updateRepliesQuery = useCallback(
        (cache, { data: { addComment } }) => {
            const prev = cache.readQuery({
                query: GQL.commentRepliesQuery,
                variables: {
                    id: replyComment.id,
                },
            });

            cache.writeQuery({
                query: GQL.commentRepliesQuery,
                variables: {
                    id: replyComment.id,
                },
                data: {
                    comment: Object.assign({}, prev.comment, {
                        comments: Object.assign({}, prev.comment.comments, {
                            data: [addComment, ...prev.comment.comments.data],
                        }),
                    }),
                },
            });
        },
        [replyComment],
    );

    const addCommentMutation = useCallback(({ body }) => {
        client
            .mutate({
                mutation: GQL.addCommentMutation,
                variables: {
                    commentable_id: replyComment ? replyComment.id : commentAbleId,
                    commentable_type: replyComment ? 'comments' : commentAbleType,
                    body: body && body.trim(),
                },
                update: commentAbleType === 'comments' ? updateRepliesQuery : updateCommentsQuery,
                optimisticResponse: {
                    __typename: 'Mutation',
                    addComment: {
                        __typename: 'Comment',
                        id: -1,
                        is_accept: false,
                        commentable_id: commentAbleId,
                        body,
                        liked: null,
                        likes: 0,
                        count_replies: 0,
                        time_ago: '1秒前',
                        user: userStore.me,
                        comments: [],
                    },
                },
            })
            .then(result => {
                if (onCompleted instanceof Function) {
                    onCompleted(replyComment);
                }
            })
            .catch(error => {
                const content = error.message.replace('GraphQL error: ', '') || '评论失败';
                if (onError instanceof Function) {
                    onError(content);
                }
            });
    });

    return addCommentMutation;
};
