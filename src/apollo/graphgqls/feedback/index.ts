// 意见和反馈服务模块
import createFeedbackMutation from './createFeedbackMutation.graphql';
import feedbacksQuery from './feedbacksQuery.graphql';
import myFeedbackQuery from './myFeedbackQuery.graphql';

export const feedback = {
    createFeedbackMutation,
    feedbacksQuery,
    myFeedbackQuery,
};
