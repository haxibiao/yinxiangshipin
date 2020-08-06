import { useMemo, useCallback } from 'react';
import { GQL } from './gqls';
import { useMutation } from '@apollo/react-hooks';

interface Props {
    variables: any;
}

export const useLikeMutation = ({ variables }: Props) => {
    const [likeArticle] = useMutation(GQL.toggleLikeMutation, { variables });

    const likeHandler = useMemo(() => {
        return __.debounce(async function() {
            const [error, result] = await Helper.exceptionCapture(likeArticle);
            console.log('====================================');
            console.log(error, result);
            console.log('====================================');
            if (error) {
                Toast.show({ content: '操作失败' });
            }
        }, 500);
    }, [likeArticle]);

    return likeHandler;
};
