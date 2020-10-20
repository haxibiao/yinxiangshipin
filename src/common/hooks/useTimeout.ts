import { useCallback, useEffect } from 'react';

interface Props {
    delay: number;
    callback: (P?: any) => any;
}

export const useTimeout = (props: Props) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (props.callback instanceof Function) {
                props.callback();
            }
        }, props.delay);
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [props.delay]);
};
