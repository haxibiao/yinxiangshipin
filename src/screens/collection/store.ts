import { observable, action } from 'mobx';

class Store {
    @observable uploadVideo: any = [];
    @observable stashVideo: any = [];
    @observable stashAddVideo: any = [];
    @observable stashDeleteVideo: any = [];

    @action.bound
    setUploadVideo(data: any) {
        this.uploadVideo = data;
    }

    @action.bound
    setStashVideo(data: any) {
        this.stashVideo = data;
    }

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
