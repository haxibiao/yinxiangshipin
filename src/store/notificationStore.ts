import { Platform } from 'react-native';
import { observable, action, computed } from 'mobx';
import { RecordKeys, GuideKeys, Storage } from './storage';

interface WithdrawNotification {
    title: string;
    content: string;
    gold: string | number;
    balance: string | number;
    buttonName?: string;
    buttonHandler?: () => void;
}

interface RewardNotification {
    title: string;
    content: string;
    gold: string | number;
    balance: string | number;
    ticket: string | number;
    buttonName?: string;
    buttonHandler?: () => void;
}

class NotificationStore {
    // notice
    @observable withdrawalNotice: WithdrawNotification[] = [];
    @observable rewardNotice: RewardNotification[] = [];
    @observable loadingVisible: boolean = false;
    @observable loadingTips: string = '';
    @observable hasModalShown: boolean = false;
    // guides
    inGuidance: boolean = false; // 是否正在显示用户引导
    @observable bindAccountRemind: boolean = false; // 提醒绑定账号
    @observable disabledBindAccountRemind: boolean = false; // 不再提醒绑定账号
    @observable guides = {} as { -readonly [k in keyof typeof GuideKeys]: any }; // 用户引导（弹窗）

    constructor() {
        this.recall();
    }

    @action.bound
    async recall() {
        this.bindAccountRemind = !!(await Storage.getItem(GuideKeys.bindAccountRemind));
        this.disabledBindAccountRemind = !!(await Storage.getItem(GuideKeys.disabledBindAccountRemind));
        this.guides[GuideKeys.UserAgreementGuide] = !!(await Storage.getItem(GuideKeys.UserAgreementGuide));
    }

    @action.bound
    toggleLoadingVisible(tips?: string) {
        if (typeof tips === 'string') {
            this.loadingTips = tips;
        }
        this.loadingVisible = !this.loadingVisible;
    }

    @action.bound
    sendWithdrawalNotice(Notice: WithdrawNotification) {
        this.withdrawalNotice = [...this.withdrawalNotice, Notice];
    }

    @action.bound
    reduceWithdrawalNotice() {
        if (this.withdrawalNotice.length > 0) {
            this.withdrawalNotice = [...this.withdrawalNotice.slice(1)];
        }
    }

    @action.bound
    sendRewardNotice(Notice: RewardNotification) {
        this.rewardNotice = [...this.rewardNotice, Notice];
    }

    @action.bound
    reduceRewardNotice() {
        if (this.rewardNotice.length > 0) {
            this.rewardNotice = [...this.rewardNotice.slice(1)];
        }
    }
}

export default new NotificationStore();
