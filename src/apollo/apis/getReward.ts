import { appStore } from '@src/store';
import { GQL } from '../gqls';
import { errorMessage } from './errorMessage';

export enum rewardReason {
    SIGNIN_VIDEO_REWARD = 'SIGNIN_VIDEO_REWARD',
    DOUBLE_SIGNIN_REWARD = 'DOUBLE_SIGNIN_REWARD',
    WATCH_REWARD_VIDEO = 'WATCH_REWARD_VIDEO',
}

//  视频奖励领取
export function getUserReward(reason: rewardReason) {
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
    if (reason === 'DOUBLE_SIGNIN_REWARD') {
        refetchQueries.push({
            query: GQL.CheckInsQuery,
            fetchPolicy: 'network-only',
        });
    }

    return new Promise((resolve, reject) => {
        if (appStore.client) {
            appStore.client
                .mutate({
                    mutation: GQL.UserRewardMutation,
                    variables: { reason },
                    refetchQueries,
                })
                .then((data: any) => {
                    resolve(data?.data?.reward);
                    // const reward = Helper.syncGetter('data.reward', data);
                    // RewardOverlay.show({
                    //     reward: {
                    //         gold: reward.gold,
                    //         ticket: reward.ticket,
                    //     },
                    //     title: '奖励领取成功',
                    // });
                })
                .catch((err: any) => {
                    reject(errorMessage(err, '奖励领取失败'));
                });
        } else {
            reject('Cannot read property client');
        }
    });
}

//  任务奖励领取
export function getTaskReward(id: number) {
    return new Promise((resolve, reject) => {
        if (appStore.client) {
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
                    resolve(data?.data?.rewardTask?.reward_info);
                    // const rewardTask = Helper.syncGetter('data.rewardTask', data);
                    // RewardOverlay.show({
                    //     reward: {
                    //         gold: rewardTask.reward_info.gold,
                    //         ticket: rewardTask.reward_info.ticket,
                    //     },
                    //     title: '任务奖励领取成功',
                    // });
                })
                .catch((err: any) => {
                    reject(errorMessage(err, '奖励领取失败'));
                });
        } else {
            reject('Cannot read property client');
        }
    });
}
