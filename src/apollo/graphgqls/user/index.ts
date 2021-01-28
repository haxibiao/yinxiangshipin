// 用户信息模块
import userQuery from './userQuery.graphql';
import meMetaQuery from './meMetaQuery.graphql';
import showUserBlockQuery from './showUserBlockQuery.graphql';
import addUserBlockMutation from './addUserBlockMutation.graphql';
import removeUserBlockMutation from './removeUserBlockMutation.graphql';
import updateUserProfileMutation from './updateUserProfileMutation.graphql';
import updateUserBirthday from './updateUserBirthday.graphql';
import updateUserGender from './updateUserGender.graphql';
import updateUserIntroduction from './updateUserIntroduction.graphql';
import updateUserName from './updateUserName.graphql';
import mySeekMoviesQuery from './mySeekMoviesQuery.graphql';

export const user = {
    meMetaQuery,
    showUserBlockQuery,
    userQuery,
    addUserBlockMutation,
    removeUserBlockMutation,
    updateUserProfileMutation,
    updateUserBirthday,
    updateUserGender,
    updateUserIntroduction,
    updateUserName,
    mySeekMoviesQuery,
};
