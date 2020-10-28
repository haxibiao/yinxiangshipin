// 用户账号
import autoSignInMutation from './autoSignInMutation.graphql';
import destroyUserMutation from './destroyUserMutation.graphql';
import otherSignInMutation from './otherSignInMutation.graphql';
import retrievePasswordMutation from './retrievePasswordMutation.graphql';
import signInMutation from './signInMutation.graphql';
import signUpMutation from './signUpMutation.graphql';
import smsSignInMutation from './smsSignInMutation.graphql';
import updateUserInfoSecurity from './updateUserInfoSecurity.graphql';

export const account = {
    autoSignInMutation,
    destroyUserMutation,
    otherSignInMutation,
    retrievePasswordMutation,
    signInMutation,
    signUpMutation,
    smsSignInMutation,
    updateUserInfoSecurity,
};
