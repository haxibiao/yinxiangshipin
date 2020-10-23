// 采集功能模块graphql
import collectionFragment from './collectionFragment.graphql';
import collectionPostsQuery from './collectionPostsQuery.graphql';
import collectionsQuery from './collectionsQuery.graphql';
import createCollectionMutation from './createCollectionMutation.graphql';
import deleteCollectionMutation from './deleteCollectionMutation.graphql';
import editCollectionMutation from './editCollectionMutation.graphql';
import moveInCollectionsMutation from './moveInCollectionsMutation.graphql';
import moveOutCollectionsMutation from './moveOutCollectionsMutation.graphql';
import randomCollectionsQuery from './randomCollectionsQuery.graphql';
import recommendCollectionsQuery from './recommendCollectionsQuery.graphql';

export const collection = {
    collectionFragment,
    collectionPostsQuery,
    collectionsQuery,
    createCollectionMutation,
    deleteCollectionMutation,
    editCollectionMutation,
    moveInCollectionsMutation,
    moveOutCollectionsMutation,
    randomCollectionsQuery,
    recommendCollectionsQuery,
};
