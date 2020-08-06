import { useCallback } from 'react';
import { DocumentNode } from 'graphql';
import { useMutation, MutationTuple, MutationHookOptions } from '@apollo/react-hooks';
import { exceptionCapture } from './exceptionCapture';
import { debounce } from '../helper';

export interface MutationProps {
    options?: MutationHookOptions;
    successful?: (p?: any) => any;
    failure?: (p?: any) => any;
}
// useMutation的加强版，用法差不多，主要是做了防抖处理和操作成功/失败的回调
// useBetterMutation(gql,{options, successful, failure}) options就是useMutation的第二个参数 {variables:{},...}
export const useBetterMutation = (gqlNode: DocumentNode, { options, successful, failure }: MutationProps) => {
    const [mutate, result] = useMutation(gqlNode, options);
    const mutation = useCallback(
        debounce(async function(params?: MutationHookOptions) {
            const [err, res] = await exceptionCapture(() => mutate(params));
            if (res) {
                if (successful instanceof Function) {
                    successful(res);
                }
            } else if (err) {
                if (failure instanceof Function) {
                    failure(err);
                }
            }
        }, 250),
        [mutate],
    );

    return [mutation, result] as MutationTuple<any, any>;
};
