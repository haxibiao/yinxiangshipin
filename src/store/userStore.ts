import { observable, action, runInAction } from 'mobx';
import App from '../App';
import { Keys, Storage } from './localStorage';

export interface UserScheme {
    id?: string;
    name?: string;
    avatar?: string;
    token?: string;
    count_articles?: number;
    count_followings?: number;
    count_followers?: number;
    introduction?: string;
    phone?: string;
    wallet?: object;
    [key: string]: any;
}

class UserStore {
    @observable recalledUser: boolean = false; //从Storage获取用户数据完成，避免重复创建client
    @observable me: UserScheme = {};
    @observable login: boolean = false;
    @observable firstInstall: boolean = false;
    @observable bindAccountRemind: boolean = false;
    @observable disabledBindAccountRemind: boolean = false;

    constructor() {
        this.recall();
    }

    @action.bound
    async recall() {
        this.firstInstall = !(await Storage.getItem(Keys.notFirstInstall));
        this.bindAccountRemind = await Storage.getItem(
            (Keys.bindAccountRemind + Config.Version) as 'bindAccountRemind',
        );
        this.disabledBindAccountRemind = await Storage.getItem(Keys.disabledBindAccountRemind);
    }

    @action.bound
    recallUser(me?: UserScheme) {
        if (me?.id) {
            TOKEN = me.token;
            this.me = me;
            this.login = true;
        }
        this.recalledUser = true;
    }

    @action.bound
    signIn(user: UserScheme) {
        TOKEN = user.token;
        this.me = user;
        this.login = true;
        this.firstInstall = false;
        Storage.setItem(Keys.me, user);
        Storage.setItem(Keys.notFirstInstall, true);
    }

    @action.bound
    signOut() {
        TOKEN = null;
        this.me = {};
        this.login = false;
        Storage.removeItem(Keys.me);
        Storage.setItem(Keys.notFirstInstall, true);
    }

    @action.bound
    changeProfile(userMetaData: any) {
        if (userMetaData !== null && typeof userMetaData === 'object') {
            this.me = Object.assign(this.me, userMetaData);
        }
        Storage.setItem(Keys.me, this.me);
    }

    @action.bound
    changeAvatar(avatarUrl: string) {
        this.me.avatar = avatarUrl;
        Storage.setItem(Keys.me, this.me);
    }
}

export default new UserStore();
