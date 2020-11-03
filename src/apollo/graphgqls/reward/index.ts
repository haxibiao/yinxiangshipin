// 奖励模块
import newUserRewordMutation from './newUserRewordMutation.graphql';
import rewardTaskMutation from './rewardTaskMutation.graphql';
import UserRewardMutation from './UserRewardMutation.graphql';
import VideoPlayRewardMutation from './VideoPlayRewardMutation.graphql';
import hasNewUserReward from './hasNewUserReward.graphql';

export const reward = {
    newUserRewordMutation,
    rewardTaskMutation,
    UserRewardMutation,
    VideoPlayRewardMutation,
    hasNewUserReward,
};
