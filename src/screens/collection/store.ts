import { observable, action } from 'mobx';

class Store {
    @observable stashAddVideo: any = [];
    @observable stashDeleteVideo: any = [];

    @action.bound
    setStashAddVideo(data: any) {
        this.stashAddVideo = data;
    }

    @action.bound
    setStashDeleteVideo(data: any) {
        this.stashDeleteVideo = data;
    }
}

export default new Store();
