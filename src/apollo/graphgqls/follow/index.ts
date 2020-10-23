//关注模块
import followedCollectionsQuery from './followedCollectionsQuery.graphql';
import followedUsersQuery from './followedUsersQuery.graphql';
import followPostsQuery from './followPostsQuery.graphql';
import toggleMutation from './toggleMutation.graphql';
import userFollowersQuery from './userFollowersQuery.graphql';

export const follow = {
    followedCollectionsQuery,
    followedUsersQuery,
    followPostsQuery,
    toggleMutation,
    userFollowersQuery,
};
