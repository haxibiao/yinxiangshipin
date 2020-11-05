// 用户钱包信息模块
import bindOAuth from './bindOAuth.graphql';
import createWithdrawMutation from './createWithdrawMutation.graphql';
import getWithdrawAmountList from './getWithdrawAmountList.graphql';
import goldsHistoryQuery from './goldsHistoryQuery.graphql';
import sendVerifyCodeMutation from './sendVerifyCodeMutation.graphql';
import setWalletPaymentInfoMutation from './setWalletPaymentInfoMutation.graphql';
import userWithdraws from './userWithdraws.graphql';
import withdrawDetailQuery from './withdrawDetailQuery.graphql';

export const wallet = {
    bindOAuth,
    createWithdrawMutation,
    getWithdrawAmountList,
    goldsHistoryQuery,
    sendVerifyCodeMutation,
    setWalletPaymentInfoMutation,
    userWithdraws,
    withdrawDetailQuery,
};
