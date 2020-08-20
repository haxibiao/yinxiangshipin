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

type Status = 'loading' | 'loadMore' | 'empty' | 'error';

class DrawVideoStore {
    public uniqueIds = {};
    @observable public status: Status = '';
    @observable public fullVideoHeight: number = Device.HEIGHT;
    @observable public data: VideoItem[] = [];
    @observable public viewableItemIndex: number = 0;
    @observable public commentBody = '';

    @computed get currentItem(): VideoItem {
        return this.data[this.viewableItemIndex >= 0 ? this.viewableItemIndex : 0];
    }

    constructor({ initData, itemIndex }) {
        this.fullVideoHeight = Device.isFullScreenDevice
            ? appStore.viewportHeight - Theme.statusBarHeight - Theme.BOTTOM_HEIGHT
            : appStore.viewportHeight;

        if (initData) {
            this.data = initData;
            this.viewableItemIndex = itemIndex;
        }
    }

    @action.bound
    public resetData() {
        this.data = [];
        this.viewableItemIndex = 0;
        this.commentBody = '';
    }

    @action.bound
    public addSource(source: VideoItem[]) {
        const newData = source.filter((item) => {
            this.uniqueIds[item?.id] = this.uniqueIds[item?.id] + 1 || 1;
            return this.uniqueIds[item?.id] <= 1;
        });
        this.data = this.data.concat(newData);
    }

    @action.bound
    public removeItem(source: VideoItem) {
        this.data.splice(this.data.indexOf(source), 1);
    }

    @action.bound
    public changeCommentBody(value: any) {
        this.commentBody = value;
    }
}

export default DrawVideoStore;
