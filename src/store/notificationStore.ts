import { Platform } from 'react-native';
import { observable, action, computed } from 'mobx';

interface WithdrawNotification {
    title: string;
    content: string;
    gold: string | number;
    balance: string | number;
    guideHandler?: () => void;
}

interface RewardNotification {
    title: string;
    content: string;
    gold: string | number;
    balance: string | number;
    ticket: string | number;
    guideHandler?: () => void;
}

class NotificationStore {
    @observable loadingVisible = false;
    @observable withdrawalNotice: WithdrawNotification[] = [];
    @observable rewardNotice: RewardNotification[] = [];

    @action.bound
    toggleLoadingVisible() {
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
