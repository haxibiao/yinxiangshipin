import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { GQL } from '../gqls';
import { useDebouncedMutation, MutationProps } from './useDebouncedMutation';

interface Props extends MutationProps {
    variables: {
        id: number;
        type: 'VIDEO' | 'ARTICLE' | 'COMMENT' | 'POST';
    };
}

export const useLikeMutation = (props: Props) => {
    const { variables, options, successful, failure } = props;
    const [toggleLike, result] = useDebouncedMutation(GQL.toggleLikeMutation, {
        options: Object.assign({ variables }, options),
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
