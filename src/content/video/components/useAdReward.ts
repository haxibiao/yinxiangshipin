import { useEffect, useRef, useCallback } from 'react';

const useAdReward = ({ focus, store }) => {
    const currentTime = useRef(0);
    const flag = useRef(focus);
    const timer = useRef(0);

    const setRewardProgress = useCallback((): any => {
        return setTimeout(() => {
            if (flag.current && currentTime.current < store.rewardLimit) {
                store.rewardProgress += 0.2;
                currentTime.current += 0.2;
                setRewardProgress();
            }
        }, 200);
    }, []);

    useEffect(() => {
        if (focus) {
            flag.current = true;
            timer.current = setRewardProgress();
        } else {
            flag.current = false;
        }
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [focus]);
};

export default useAdReward;
