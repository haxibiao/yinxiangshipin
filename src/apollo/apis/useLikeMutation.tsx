import { useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { GQL } from '../gqls';

interface Props {
    variables: any;
}

export const useLikeMutation = ({ variables }: Props) => {
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, { variables });

    const likeHandler = useMemo(() => {
        return __.debounce(async function () {
            const [error, result] = await Helper.exceptionCapture(likeArticle);
            if (error) {
                Toast.show({ content: '操作失败' });
            }
        }, 500);
    }, [likeArticle]);

    return likeHandler;
};
