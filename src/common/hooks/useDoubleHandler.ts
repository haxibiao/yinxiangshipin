import { useCallback, useRef } from 'react';

interface Props {
    doubleClick: (e?: any) => any;
    singleClick: (e?: any) => any;
    interval?: number;
}

export const useDoubleHandler = (props: Props) => {
    const { doubleClick, singleClick, interval = 200 } = props;
    const now = useRef<number>(new Date().getTime());
    const lastExec = useRef<number>(new Date().getTime());
    const timer = useRef<ReturnType<typeof setTimeout>>();

    const enhanceFunction = useCallback(() => {
        if (timer.current) {
            clearInterval(timer.current);
        }
        now.current = new Date().getTime();
        const diff = interval - (now.current - lastExec.current);
        lastExec.current = now.current;
        if (diff > 0) {
            doubleClick();
        } else {
            if (singleClick) {
                timer.current = setTimeout(() => {
                    singleClick();
                }, interval * 2);
            }
        }
    }, [doubleClick, singleClick]);

    return enhanceFunction;
};
