import { useMemo, useCallback } from 'react';
import { GQL } from './gqls';
import { useMutation } from '@apollo/react-hooks';
interface Props {
    variables: any;
}

export const useFollowMutation = ({ variables }: Props) => {
    const [followUser] = useMutation(GQL.followUserMutation, { variables });
    const followHandler = useMemo(() => {
        return __.debounce(async function() {
            const [error, result] = await Helper.exceptionCapture(followUser);
            if (error) {
                Toast.show({ content: '操作失败' });
            }
        }, 500);
    }, [followUser]);

    return followHandler;
};
