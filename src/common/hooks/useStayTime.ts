import { useEffect, useRef } from 'react';

interface Props {
    record: (P?: any) => any;
}

export const useStayTime = (props: Props) => {
    const startTime = useRef(new Date());
    // start
    useEffect(() => {
        return () => {
            const leaveTime = new Date();
            if (props.record) {
                props.record(leaveTime - startTime.current);
            }
        };
    }, [props.record]);
};
