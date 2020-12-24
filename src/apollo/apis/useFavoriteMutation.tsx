import { useMemo, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { GQL } from '../graphgqls';
import { errorMessage } from './errorMessage';

interface Props {
    options: any;
}

export const useFavoriteMutation = (options: Props) => {
    const [toggleFavoriteMutation] = useMutation(GQL.toggleFavoriteMutation, { ...options });
    const favoriteHandler = useMemo(() => {
        return __.debounce(async function () {
            const [error, result] = await Helper.exceptionCapture(toggleFavoriteMutation);
            if (error) {
                Toast.show({ content: errorMessage(error) || '操作失败' });
            } else if (result) {
                Toast.show({ content: result?.data?.toggleFavorite?.favorited ? '已收藏' : '已取消收藏' });
            }
        }, 200);
    }, [toggleFavoriteMutation]);

    return favoriteHandler;
};
