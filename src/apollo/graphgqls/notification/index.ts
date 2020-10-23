// 通知模块
import commentNotificationQuery from './commentNotificationQuery.graphql';
import followersNotificationsQuery from './followersNotificationsQuery.graphql';
import likeNotificationsQuery from './likeNotificationsQuery.graphql';
import otherNotificationsQuery from './otherNotificationsQuery.graphql';
import unreadsQuery from './unreadsQuery.graphql';

export const notification = {
    commentNotificationQuery,
    followersNotificationsQuery,
    likeNotificationsQuery,
    otherNotificationsQuery,
    unreadsQuery,
};
