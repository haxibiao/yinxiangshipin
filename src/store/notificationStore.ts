import { Platform } from 'react-native';
import { observable, action, computed } from 'mobx';

interface TaskNotification {
    title: string;
    content: string;
    guideHandler?: () => void;
}

interface WalletNotification {
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
    @observable taskNotice: TaskNotification[] = [];
    @observable walletNotice: WalletNotification[] = [];
    @observable rewardNotice: RewardNotification[] = [];

    @action.bound
    sendTaskNotice(Notice: TaskNotification) {
        this.taskNotice = [...this.taskNotice, Notice];
    }

    @action.bound
    reduceTaskNotice() {
        if (this.taskNotice.length > 0) {
            this.taskNotice = [...this.taskNotice.slice(1)];
        }
    }

    @action.bound
    sendWalletNotice(Notice: WalletNotification) {
        this.walletNotice = [...this.walletNotice, Notice];
    }

    @action.bound
    reduceWalletNotice() {
        if (this.walletNotice.length > 0) {
            this.walletNotice = [...this.walletNotice.slice(1)];
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
