import { observable, action, runInAction } from 'mobx';
import { RecordKeys, Storage } from './storage';

export interface UserScheme {
    id: number;
    name: string;
    avatar: string;
    token: string;
    count_articles: number;
    count_followings: number;
    count_followers: number;
    introduction?: string;
    phone?: string;
    wallet: {
        id: number;
        total_withdraw_amount: number;
    };
    [key: string]: any;
}

class UserStore {
    @observable me = {} as UserScheme;
    @observable login: boolean = false;
    @observable recalledUser: boolean = false;
    @observable firstInstall: boolean = false;
    @observable isNewUser?: boolean;
    @observable isCheckIn?: boolean; // 是否签到
    @observable startParseSharedLink: boolean = false; // 是否开始解析分享链接

    constructor() {
        (async () => {
            this.firstInstall = !(await Storage.getItem(RecordKeys.notFirstInstall));
        })();
    }

    @action.bound
    recallUser(me?: UserScheme) {
        if (me?.id) {
            TOKEN = me.token;
            this.me = me;
            this.login = true;
        }
        //从Storage获取用户数据完成，避免重复创建client
        this.recalledUser = true;
    }

    @action.bound
    signIn(user: UserScheme) {
        TOKEN = user.token;
        this.me = user;
        this.login = true;
        this.recalledUser = true;
        this.firstInstall = false;
        this.isNewUser = undefined;
        this.isCheckIn = undefined;
        Storage.setItem(RecordKeys.me, user);
        Storage.setItem(RecordKeys.notFirstInstall, true);
    }

    @action.bound
    signOut() {
        TOKEN = null;
        this.me = {} as UserScheme;
        this.login = false;
        this.isNewUser = undefined;
        this.isCheckIn = undefined;
        this.startParseSharedLink = false;
        Storage.removeItem(RecordKeys.me);
    }

    @action.bound
    changeProfile(userMetaData: any) {
        if (userMetaData !== null && typeof userMetaData === 'object') {
            this.me = Object.assign(this.me, userMetaData);
        }
        Storage.setItem(RecordKeys.me, this.me);
    }

    @action.bound
    changeAvatar(avatarUrl: string) {
        this.me.avatar = avatarUrl;
        Storage.setItem(RecordKeys.me, this.me);
    }
}

export default new UserStore();
