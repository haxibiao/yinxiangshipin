import { useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { GQL } from '../gqls';
import { errorMessage } from './errorMessage';

interface Props {
    options: any;
}

export const useFollowMutation = (options: Props) => {
    const [toggleMutation] = useMutation(GQL.toggleMutation, { ...options });
    const followHandler = useMemo(() => {
        return __.debounce(async function () {
            const [error, result] = await Helper.exceptionCapture(toggleMutation);
            if (error) {
                Toast.show({ content: errorMessage(error) || '操作失败' });
            }
        }, 500);
    }, [toggleMutation]);

    return followHandler;
};
