import { useEffect } from 'react';
import { AppState } from 'react-native';

type EventType = 'change';

interface Props {
    event: EventType;
    handle: (Event: any) => any;
}

export const useAppStateListener = (props: Props) => {
    const { event, handle } = props;
    useEffect(() => {
        AppState.addEventListener(event, handle);
        return () => {
            AppState.removeEventListener(event, handle);
        };
    }, []);
};
