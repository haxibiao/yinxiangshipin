// 动态,用户互动模块
import createPostContent from './createPostContent.graphql';
import deleteArticleMutation from './deleteArticleMutation.graphql';
import deletePostMutation from './deletePostMutation.graphql';
import postByVid from './postByVid.graphql';
import postQuery from './postQuery.graphql';
import postsQuery from './postsQuery.graphql';
import publicPostsQuery from './publicPostsQuery.graphql';
import publicVideosQuery from './publicVideosQuery.graphql';
import resolveDouyinVideo from './resolveDouyinVideo.graphql';
import updatePostMutation from './updatePostMutation.graphql';
import userPostsQuery from './userPostsQuery.graphql';
import userVisitsQuery from './userVisitsQuery.graphql';
import visitShareablebyUuid from './visitShareablebyUuid.graphql';
import postWithMoviesQuery from './postWithMoviesQuery.graphql';

export const post = {
    createPostContent,
    deleteArticleMutation,
    deletePostMutation,
    postByVid,
    postQuery,
    postsQuery,
    publicPostsQuery,
    publicVideosQuery,
    resolveDouyinVideo,
    updatePostMutation,
    userPostsQuery,
    userVisitsQuery,
    visitShareablebyUuid,
    postWithMoviesQuery,
};
