import { observable, action, runInAction } from 'mobx';
import validateSource from './helper/validateSource';

export interface EpisodeScheme {
    name: string;
    url: string;
    progress?: string;
}

export interface MovieScheme {
    id: string;
    name: string;
    data: EpisodeScheme[];
    series_index?: number; //播放集数
    progress?: number; //播放进度
}

export interface NotificationData {
    content: string;
    duration?: Number;
    orientation?: 'top' | 'left';
}

class PlayerStore {
    @observable currentEpisodeIndex: number = 0;
    @observable currentEpisode: EpisodeScheme = {};
    @observable series: EpisodeScheme[] = [];
    @observable seriesChooserVisible: boolean = false; //选择集数
    @observable controllerBarVisible: boolean = false; //控制条
    @observable sourceException: boolean = false; //视频源异常
    @observable error: boolean = false; //播放出错
    @observable locked: boolean = false;
    @observable fullscreen: boolean = false;
    @observable resizeMode: 'contain' | 'cover' = 'contain';
    @observable loaded: boolean = false;
    @observable buffering: boolean = true;
    @observable seeking: boolean = false; //更改视频进度seeking=true，播放器onSeek事件seeking=false
    @observable sliding: boolean = false; //拖动视频进度sliding=true，手指松开sliding=false
    @observable paused: boolean = false;
    @observable rate: number = 1.0;
    @observable rateChooserVisible: boolean = false; //设置音量
    @observable progress: number | string = 0; //视频播放进度
    @observable seekProgress: number | string = 0; //视频拖拽进度
    @observable duration: number | string = 0;
    @observable notice: NotificationData[] = []; //播放通知

    constructor() {}

    @action.bound
    resetMovieData() {
        this.rate = 1.0;
        this.currentEpisode = {};
        this.series = [];
    }

    @action.bound
    resetVideoState() {
        this.sourceException = false;
        this.error = false;
        this.loaded = false;
        this.buffering = true;
        this.seeking = false;
        this.sliding = false;
        this.paused = false;
        this.progress = 0;
        this.seekProgress = 0;
        this.duration = 0;
    }

    @action.bound
    setCurrentEpisode(episode: EpisodeScheme, index: number) {
        if (index >= 0) {
            this.currentEpisodeIndex = index;
        } else {
            this.currentEpisodeIndex = this.series.findIndex((e) => e?.url === episode?.url) || 0;
        }
        this.resetVideoState();
        if (!validateSource(episode?.url)) {
            this.toggleSourceException(true);
            this.currentEpisode = {};
        } else {
            this.currentEpisode = episode;
        }
    }

    @action.bound
    nextEpisode() {
        this.currentEpisodeIndex++;
        const episode = this.series[this.currentEpisodeIndex];
        this.resetVideoState();
        if (!validateSource(episode?.url)) {
            this.toggleSourceException(true);
            this.currentEpisode = {};
        } else {
            this.currentEpisode = episode;
        }
    }

    @action.bound
    setSeries(seriesData: EpisodeScheme[]) {
        this.series = seriesData;
    }

    @action.bound
    toggleSeriesChooserVisible(visible: boolean) {
        this.seriesChooserVisible = visible;
    }

    @action.bound
    toggleControllerBarVisible(visible: boolean) {
        this.controllerBarVisible = visible;
    }

    @action.bound
    toggleSourceException(isException: boolean) {
        this.sourceException = isException;
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
    toggleResizeMode(mode?: 'contain' | 'cover') {
        if (mode) {
            this.resizeMode = mode;
        } else {
            if (this.resizeMode === 'contain') {
                this.resizeMode = 'cover';
            } else {
                this.resizeMode = 'contain';
            }
        }
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
    toggleSliding(isSliding: boolean) {
        this.sliding = isSliding;
    }

    @action.bound
    togglePaused(isPaused: boolean) {
        this.paused = isPaused;
        if (isPaused) {
            this.sendNotice({ content: '视频已暂停' });
        }
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
        this.currentEpisode.progress = currentProgress;
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
        this.notice = [notification];
    }

    @action.bound
    reduceNotice() {
        if (this.notice.length > 0) {
            this.notice = [...this.notice.slice(1)];
        }
    }
}

export default new PlayerStore();
