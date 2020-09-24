import { observable, computed, action } from 'mobx';
import { exceptionCapture } from '@src/common';
import { appStore } from '@src/store';

interface User {
    id: number;
    name: string;
    avatar: string;
    followed_user_status: number;
}

interface Video {
    id: number;
    width: number;
    height: number;
    url: string;
    cover?: string;
}

interface VideoItem {
    id: number;
    description: string;
    count_likes: number;
    count_comments: number;
    liked: boolean;
    user: User;
    video: Video;
    is_ad: boolean;
}

type Status = 'loading' | 'loadMore' | 'empty' | 'error';

class DrawVideoStore {
    public uniqueIds = {};
    @observable public status: Status = '';
    @observable public fullVideoHeight: number = appStore.viewportHeight;
    @observable public data = observable.array<VideoItem>([]);
    @observable public visibility: boolean = true;
    @observable public viewableItemIndex: number = 0;
    @observable public commentBody = '';
    // 业务逻辑
    public playedVideos: number[] = []; // 已经浏览过的视频
    public rewardedVideos: number[] = []; // 已经领取过奖励的视频
    readonly rewardInterval: number = 42; // 观看视频奖励间隔
    @observable public rewardProgress: number = 0; // 获得奖励的进度

    @computed get currentItem(): VideoItem {
        return this.data[this.viewableItemIndex >= 0 ? this.viewableItemIndex : 0];
    }

    constructor({ initData, itemIndex } = {}) {
        if (Device.isFullScreenDevice) {
            this.fullVideoHeight = appStore.viewportHeight - Theme.BOTTOM_HEIGHT;
        }
        if (initData) {
            this.data = initData;
        }
        if (itemIndex) {
            this.viewableItemIndex = itemIndex;
        }
    }

    @action.bound
    public resetData() {
        this.data = [];
        this.viewableItemIndex = 0;
        this.commentBody = '';
        this.rewardProgress = 0;
        this.playedVideos = [];
        this.rewardedVideos = [];
    }

    @action.bound
    public addSource(source: VideoItem[]) {
        const newData = source.filter((item) => {
            this.uniqueIds[item?.id] = this.uniqueIds[item?.id] + 1 || 1;
            return this.uniqueIds[item?.id] <= 1;
        });
        this.data = [...this.data, ...newData];
    }

    @action.bound
    public prependSource(source: VideoItem[]) {
        const newData = source.filter((item) => {
            this.uniqueIds[item?.id] = this.uniqueIds[item?.id] + 1 || 1;
            return this.uniqueIds[item?.id] <= 1;
        });
        this.data = [...newData, ...this.data];
    }

    @action.bound
    public removeItem(source: VideoItem) {
        this.data.splice(this.data.indexOf(source), 1);
    }

    @action.bound
    public changeCommentBody(value: any) {
        this.commentBody = value;
    }

    @action.bound
    public addPlayedId(id: any) {
        this.playedVideos = this.playedVideos.concat(id);
    }

    @action.bound
    public addRewardedId(id: any) {
        this.rewardedVideos = this.rewardedVideos.concat(id);
    }
}

export default DrawVideoStore;
