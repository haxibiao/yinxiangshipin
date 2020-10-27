import { appStore } from '@src/store';
import { GQL } from '../gqls';
import { errorMessage } from './errorMessage';

//  视频奖励领取
type RewardReason = 'SIGNIN_VIDEO_REWARD' | 'DOUBLE_SIGNIN_REWARD' | 'WATCH_REWARD_VIDEO';

export function getUserReward(reason: RewardReason) {
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
type RewardType = 'VIDEO';

export function getNewUserReward(rewardType: RewardType) {
    const refetchQueries = [
        {
            query: GQL.tasksQuery,
            fetchPolicy: 'network-only',
        },
    ];

    return new Promise((resolve, reject) => {
        if (appStore.client) {
            appStore.client
                .mutate({
                    mutation: GQL.newUserRewordMutation,
                    variables: { rewardType },
                    refetchQueries,
                })
                .then((data: any) => {
                    resolve(data?.data?.reward);
                })
                .catch((err: any) => {
                    reject(errorMessage(err, '奖励领取失败'));
                });
        } else {
            reject('Cannot read property client');
        }
    });
}
