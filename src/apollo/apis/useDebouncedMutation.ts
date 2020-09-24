import { useCallback } from 'react';
import { DocumentNode } from 'graphql';
import { useMutation, MutationTuple, MutationHookOptions } from '@apollo/react-hooks';
import { exceptionCapture } from '@src/common';
import __ from 'lodash';

export interface MutationProps {
    options?: MutationHookOptions;
    successful?: (p?: any) => any;
    failure?: (p?: any) => any;
}
// 对 useMutation 做了简单的防抖处理和操作成功/失败的回调
// useDebouncedMutation(gql,{options, successful, failure}) options就是useMutation的第二个参数 {variables:{},...}
export const useDebouncedMutation = (gqlNode: DocumentNode, { options, successful, failure }: MutationProps) => {
    const [mutate, result] = useMutation(gqlNode, options);
    const mutation = useCallback(
        __.debounce(async function (params?: MutationHookOptions) {
            const [err, res] = await exceptionCapture(() => mutate(params));
            if (res) {
                if (successful instanceof Function) {
                    successful(res);
                }
            } else if (err) {
                if (failure instanceof Function) {
                    failure(err?.message);
                }
            }
        }, 100),
        [mutate],
    );

    return [mutation, result] as MutationTuple<any, any>;
};
