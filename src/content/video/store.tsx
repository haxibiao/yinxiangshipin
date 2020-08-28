import { observable, computed, action } from 'mobx';
import { appStore } from '@src/store';
import { GQL } from '../service';
import { exceptionCapture } from '@src/common';

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

const uniqueIds = {};

const calculateHeight = Device.isFullScreenDevice
    ? Device.HEIGHT - Theme.statusBarHeight - Theme.BOTTOM_HEIGHT
    : Device.HEIGHT;

class DrawVideoStore {
    private instance: DrawVideoStore = null;
    public playedVideoIds: number[] = []; // 记录用户浏览的视频
    @observable public fullVideoHeight: number = calculateHeight;
    @observable public data: VideoItem[] = [];
    @observable public loaded: boolean = true;
    @observable public error: boolean = false;
    @observable public loading: boolean = false;
    @observable public hasMore: boolean = true;
    @observable public refreshing: boolean = false;
    @observable public visibility: boolean = true;
    @observable public viewableItemIndex: number = 0;
    @observable public commentBody = '';
    // 激励视频逻辑
    readonly rewardLimit: number = 30; // 奖励频率
    @observable public rewardProgress: number = 0;
    @observable public getReward = [];

    @computed get currentItem(): VideoItem {
        return this.data[this.viewableItemIndex >= 0 ? this.viewableItemIndex : 0];
    }

    constructor(initData: VideoItem) {
        if (!DrawVideoStore.instance) {
            if (initData) {
                this.data = [initData];
                this.currentData = initData;
            }
            DrawVideoStore.instance = this;
        }
        return DrawVideoStore.instance;
    }

    @action.bound
    public resetData() {
        this.data = [];
        this.loaded = true;
        this.error = false;
        this.loading = false;
        this.hasMore = true;
        this.refreshing = false;
        this.viewableItemIndex = 0;
        this.commentBody = '';
        this.rewardProgress = 0;
        this.getReward = [];
    }

    @action.bound
    public videosQuery() {
        return appStore.client.query({
            query: GQL.recommendPostsQuery,
            fetchPolicy: 'network-only',
        });
    }

    @action.bound
    public async fetchData() {
        if (this.loading || !this.hasMore) {
            return;
        }
        this.loading = true;
        const [error, result] = await exceptionCapture(this.videosQuery);
        const source = result?.data?.recommendPosts;
        if (source?.length > 0) {
            this.addSource(source);
        } else {
            this.hasMore = false;
        }
        if (error) {
            this.error = true;
        }
        this.loading = false;
    }

    @action.bound
    public addSource(source: VideoItem[]) {
        const newData = source.filter((item) => {
            uniqueIds[item?.id] = uniqueIds[item?.id] + 1 || 1;
            return uniqueIds[item?.id] <= 1;
        });
        this.data = this.data.concat(newData);
    }

    @action.bound
    public removeItem(source: VideoItem) {
        this.data.splice(this.data.indexOf(source), 1);
    }

    @action.bound
    public inputComment(value: any) {
        this.commentBody = value;
    }

    @action.bound
    public addRewardedVideoId(id: any) {
        this.getReward = this.getReward.concat(id);
    }
}

export default DrawVideoStore;
