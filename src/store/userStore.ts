import { observable, action, runInAction } from 'mobx';
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
    // launched ==> 从Storage获取用户数据完成，避免重复创建client
    @observable launched: boolean = false;
    @observable me: UserScheme = {};
    @observable login: boolean = false;
    @observable firstInstall: boolean = false;

    constructor() {
        this.recall();
    }

    @action.bound
    async recall() {
        const profile = await Storage.getItem(Keys.me);
        const notFirstInstall = await Storage.getItem(Keys.notFirstInstall);
        if (profile && profile.id) {
            this.signIn(profile);
        } else if (!notFirstInstall) {
            this.firstInstall = true;
        }
        this.launched = true;
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
            this.me = { ...this.me, ...userMetaData };
        }
        Storage.setItem(Keys.me, this.me);
    }

    @action.bound
    changeAvatar(avatarUrl: string) {
        this.me.avatar = avatarUrl;
        Storage.setItem(Keys.me, this.me);
    }

    @action.bound
    changeGender(gender: string) {
        this.me.gender = gender;
        Storage.setItem(Keys.me, this.me);
    }

    @action.bound
    changeName(name: string) {
        this.me.name = name;
        Storage.setItem(Keys.me, this.me);
    }

    @action.bound
    changeIntroduction(introduction: any) {
        this.me.introduction = introduction;
        Storage.setItem(Keys.me, this.me);
    }

    @action.bound
    changePhone(phone: string) {
        this.me.phone = phone;
        Storage.setItem(Keys.me, this.me);
    }

    @action.bound
    changeBirthday(birthday_msg: string) {
        this.me.birthday_msg = birthday_msg;
        Storage.setItem(Keys.me, this.me);
    }

    @action.bound
    changeAlipay(real_name: string, pay_account: string) {
        this.me.wallet = {
            ...this.me.wallet,
            real_name,
            pay_account,
        };
        Storage.setItem(Keys.me, this.me);
    }
}

export default new UserStore();
