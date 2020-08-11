import { useMemo, useCallback } from 'react';
import { GQL } from './gqls';
import { errorMessage } from './errorMessage';
import { useMutation } from '@apollo/react-hooks';
interface Props {
    options: any;
}

export const useFollowMutation = (options: Props) => {
    const [followUser] = useMutation(GQL.followUserMutation, { ...options });
    const followHandler = useMemo(() => {
        return __.debounce(async function () {
            const [error, result] = await Helper.exceptionCapture(followUser);
            if (error) {
                Toast.show({ content: errorMessage(error) || '操作失败' });
            }
        }, 500);
    }, [followUser]);

    return followHandler;
};
