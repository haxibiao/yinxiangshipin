import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { GQL } from './graphql';
import { useBetterMutation, MutationProps } from './useBetterMutation';

interface Props extends MutationProps {
    id: number;
}

export const useDeleteMutation = ({ id, options, successful, failure }: Props) => {
    const [deletePost, result] = useBetterMutation(GQL.deletePost, {
        options: Object.assign({
            variables: {
                id,
            },
            options,
        }),
        successful,
        failure,
    });

    return [deletePost, result];
};
