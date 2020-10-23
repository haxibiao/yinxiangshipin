// 评论功能模块graphql
import addCommentMutation from './addCommentMutation.graphql';
import commentRepliesQuery from './commentRepliesQuery.graphql';
import commentsQuery from './commentsQuery.graphql';
import deleteCommentMutation from './deleteCommentMutation.graphql';

export const comment = {
    addCommentMutation,
    commentRepliesQuery,
    commentsQuery,
    deleteCommentMutation,
};
