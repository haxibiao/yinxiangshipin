import React, { useCallback } from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';
import __ from 'lodash';

interface Props extends PressableProps {
    delay?: number;
}

export function DebouncedPressable({ delay = 100, onPress, children, ...OtherPressableProps }: Props) {
    const debouncedPress = useCallback(__.debounce(onPress, delay), []);

    return (
        <Pressable onPress={debouncedPress} {...OtherPressableProps}>
            {children}
        </Pressable>
    );
}
