// 电影模块
import categoryMovieQuery from './categoryMovieQuery.graphql';
import getFiltersQuery from './getFiltersQuery.graphql';
import moviePosters from './moviePosters.graphql';
import recommendMovieQuery from './recommendMovieQuery.graphql';
import movieQuery from './movieQuery.graphql';
import showMovieHistoryQuery from './showMovieHistoryQuery.graphql';
import saveWatchProgressMutation from './saveWatchProgressMutation.graphql';
export const movie = {
    categoryMovieQuery,
    getFiltersQuery,
    moviePosters,
    recommendMovieQuery,
    movieQuery,
    showMovieHistoryQuery,
    saveWatchProgressMutation,
};
