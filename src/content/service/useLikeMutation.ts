import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { GQL } from './graphql';
import { useBetterMutation, MutationProps } from './useBetterMutation';

interface Props extends MutationProps {
    id: number;
    type: 'VIDEO' | 'ARTICLE' | 'COMMENT' | 'POST';
}

export const useLikeMutation = (props: Props) => {
    const { id, type, options, successful, failure } = props;
    const [toggleLike, result] = useBetterMutation(GQL.toggleLike, {
        options: Object.assign({
            variables: {
                id,
                type,
            },
            options,
        }),
        successful,
        failure,
    });

    const animation = useRef(new Animated.Value(1));

    const startAnimation = useCallback(() => {
        animation.current.setValue(1);
        Animated.spring(animation.current, {
            toValue: 2,
            friction: 10,
            tension: 10,
            useNativeDriver: true,
        }).start();
    }, []);

    return [toggleLike, { startAnimation, animateValue: animation.current, result }];
};
