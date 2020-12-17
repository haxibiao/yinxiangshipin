import { observable, action } from 'mobx';

interface MovieData {
    id: number;
    name?: string;
    introduction?: string;
    cover: string;
    year: string;
    type: string;
    style: string;
    region: string;
    score: string;
    country: string;
    count_series: number;
    lang: string;
    producer: string;
    actors: string;
    count_comments: number;
    count_favorites: number;
    favorited: boolean;
    last_watch_series: number;
    last_watch_progress: string;
}

class MovieStore {
    @observable movieData: MovieData[] = [];

    @action.bound
    setMovieData(data: MovieData) {
        this.movieData = [...this.movieData, data];
    }

    @action.bound
    reduceRewardNotice() {
        if (this.movieData.length > 0) {
            this.movieData = [...this.movieData.slice(1)];
        }
    }
}

export default new MovieStore();
