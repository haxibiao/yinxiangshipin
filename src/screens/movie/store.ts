import { observable, action } from 'mobx';

interface MovieData {
    name?: string;
    introduction?: string;
    year: string;
    type: string;
    style: string;
    actors: string;
    country: string;
    count_series: number;
    lang: string;
    producer: string;
    region: string;
    score: string;
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
