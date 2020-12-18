import { observable, action, runInAction } from 'mobx';

export interface EpisodeData {
    name: string;
    url: string;
}

export interface NotificationData {
    content: string;
    orientation?: 'top' | 'left';
}

class PlayerStore {
    @observable currentEpisode: EpisodeData = {};
    @observable series: EpisodeData[] = [];
    @observable seriesChooserVisible: boolean = false;
    @observable error: boolean = false;
    @observable locked: boolean = false;
    @observable fullscreen: boolean = false;
    @observable resizeMode: 'contain' | 'cover' = 'contain';
    @observable loaded: boolean = false;
    @observable buffering: boolean = true;
    @observable seeking: boolean = false;
    @observable paused: boolean = false;
    @observable rate: number = 1.0;
    @observable rateChooserVisible: boolean = false;
    @observable progress: number | string = 0;
    @observable seekProgress: number | string = 0;
    @observable duration: number | string = 0;
    @observable notice: NotificationData[] = [];

    constructor() {}

    @action.bound
    resetVideoState() {
        this.error = false;
        this.loaded = false;
        this.buffering = true;
        this.seeking = false;
        this.paused = false;
        this.progress = 0;
        this.seekProgress = 0;
        this.duration = 0;
    }

    @action.bound
    setCurrentEpisode(episode: EpisodeData) {
        this.currentEpisode = episode;
        this.resetVideoState();
    }

    @action.bound
    setSeries(seriesData: EpisodeData[]) {
        this.series = seriesData;
    }

    @action.bound
    toggleSeriesChooserVisible(visible: boolean) {
        this.seriesChooserVisible = visible;
    }

    @action.bound
    toggleError(isError: boolean) {
        this.error = isError;
    }

    @action.bound
    toggleLocked(isLocked: boolean) {
        this.locked = isLocked;
    }

    @action.bound
    toggleResizeMode(mode: 'contain' | 'cover') {
        this.resizeMode = mode;
    }

    @action.bound
    toggleFullscreen(isFullscreen: boolean) {
        this.fullscreen = isFullscreen;
    }

    @action.bound
    toggleBuffering(isBuffering: boolean) {
        this.buffering = isBuffering;
    }

    @action.bound
    toggleLoaded(isLoaded: boolean) {
        this.loaded = isLoaded;
    }

    @action.bound
    toggleSeeking(isSeeking: boolean) {
        this.seeking = isSeeking;
    }

    @action.bound
    togglePaused(isPaused: boolean) {
        this.paused = isPaused;
    }

    @action.bound
    setRateValue(value: number) {
        this.rate = value;
    }

    @action.bound
    toggleRateChooserVisible(visible: boolean) {
        this.rateChooserVisible = visible;
    }

    @action.bound
    setProgress(currentProgress: number) {
        this.progress = currentProgress;
    }

    @action.bound
    setSeekProgress(seekingProgress: number) {
        this.seekProgress = seekingProgress;
    }

    @action.bound
    setDuration(videoDuration: number) {
        this.duration = videoDuration;
    }

    @action.bound
    sendNotice(notification: NotificationData) {
        this.notice = [...this.notice, notification];
    }

    @action.bound
    reduceNotice() {
        if (this.notice.length > 0) {
            this.notice = [...this.notice.slice(1)];
        }
    }
}

export default new PlayerStore();
