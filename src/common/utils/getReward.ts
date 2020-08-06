import { Loading, RewardOverlay } from '@src/components';
import { appStore } from '@src/store';
import { GQL } from '@src/apollo';

export enum rewardReason {
    SIGNIN_VIDEO_REWARD = 'SIGNIN_VIDEO_REWARD',
    DOUBLE_SIGNIN_REWARD = 'DOUBLE_SIGNIN_REWARD',
    WATCH_REWARD_VIDEO = 'WATCH_REWARD_VIDEO',
}

//  视频奖励领取
export function getUserReward(reason: rewardReason, callback?: (a?: any) => any) {
    const refetchQueries = [
        {
            query: GQL.MeMetaQuery,
            fetchPolicy: 'network-only',
        },
    ];
    if (reason === 'WATCH_REWARD_VIDEO') {
        refetchQueries.push({
            query: GQL.tasksQuery,
            fetchPolicy: 'network-only',
        });
    }
    if (appStore.client) {
        Loading.show();
        appStore.client
            .mutate({
                mutation: GQL.UserRewardMutation,
                variables: { reason },
                refetchQueries,
            })
            .then((data: any) => {
                Loading.hide();
                if (callback instanceof Function) {
                    callback();
                }
                const reward = Helper.syncGetter('data.reward', data);
                RewardOverlay.show({
                    reward: {
                        gold: reward.gold,
                        contribute: reward.contribute,
                    },
                    title: '观看视频奖励领取成功',
                });
            })
            .catch((err: any) => {
                Loading.hide();
                Toast.show({ content: err.message || '出了点问题，领取失败' });
            });
    }
}

//  任务奖励领取
export function getTaskReward(id) {
    if (appStore.client) {
        Loading.show();
        appStore.client
            .mutate({
                mutation: GQL.rewardTaskMutation,
                variables: {
                    id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.MeMetaQuery,
                        fetchPolicy: 'network-only',
                    },
                    {
                        query: GQL.tasksQuery,
                        fetchPolicy: 'network-only',
                    },
                ],
            })
            .then((data: any) => {
                Loading.hide();
                const rewardTask = Helper.syncGetter('data.rewardTask', data);
                RewardOverlay.show({
                    reward: {
                        gold: rewardTask.reward_info.gold,
                        contribute: rewardTask.reward_info.contribute,
                    },
                    title: '任务奖励领取成功',
                });
            })
            .catch((err: any) => {
                Loading.hide();
                Toast.show({ content: err.message || '出了点问题，领取失败' });
            });
    }
}
