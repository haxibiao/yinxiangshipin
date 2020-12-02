import { useEffect, useCallback } from 'react';
import { GQL } from '@src/apollo';
import { appStore } from '@src/store';

interface Props {
    interval?: number;
    visited_id: number;
}

export const useVisitDurationReport = ({ interval = 10000, visited_id }: Props) => {
    const addVisitWithDuration = useCallback(
        (duration) => {
            appStore.client.mutate({
                mutation: GQL.addVisitWithDurationMutation,
                variables: {
                    duration,
                    visited_id,
                },
                refetchQueries: () => [
                    {
                        query: GQL.tasksQuery,
                        variables: {
                            fetchPolicy: 'network-only',
                        },
                    },
                ],
            });
        },
        [visited_id],
    );

    useEffect(() => {
        const timer = setInterval(() => {
            addVisitWithDuration(Math.round(interval / 1000));
        }, interval);
        return () => {
            clearInterval(timer);
        };
    }, [interval, addVisitWithDuration]);
};
