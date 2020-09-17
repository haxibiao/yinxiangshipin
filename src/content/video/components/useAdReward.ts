import { useEffect, useRef, useMemo, useCallback } from 'react';
import { adStore } from '@src/store';

const AdRewardProgress = (store: any, rewardEnable?: boolean) => {
    const isFocusAdItem = useMemo(() => adStore.enableAd && store.visibility && store.currentItem?.is_ad, [
        adStore.enableAd,
        store.visibility,
        store.currentItem,
    ]);
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const currentTime = useRef(0);

    const setRewardProgress = useCallback((): any => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            if (!store.currentItem?.watched) {
                store.rewardProgress = store.rewardProgress + 0.3;
                currentTime.current = currentTime.current + 0.3;
                if (currentTime.current >= store.rewardInterval) {
                    store.currentItem.watched = true;
                    currentTime.current = 0;
                }
                setRewardProgress();
            }
        }, 100);
    }, []);

    useEffect(() => {
        if (rewardEnable && isFocusAdItem) {
            setRewardProgress();
        } else if (timer.current) {
            clearTimeout(timer.current);
        }
        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [isFocusAdItem, rewardEnable]);
};

export default AdRewardProgress;
