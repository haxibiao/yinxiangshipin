import { useCallback, useEffect, useRef, useMemo } from 'react';
import { AppState } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { GQL } from '@src/apollo';
import { exceptionCapture } from '../helper';

interface Props {
    client: any;
    onStart?: (Event?: any) => any;
    onSuccess?: (Event?: any) => any;
    onFailed?: (Event?: any) => any;
}

export const useCaptureVideo = (props: Props) => {
    const { client, onStart, onSuccess, onFailed } = props;
    const clipboardString = useRef('');

    const captureVideo = useCallback(
        path => {
            return client.mutate({
                mutation: GQL.resolveDouyinVideo,
                variables: {
                    share_link: path,
                },
            });
        },
        [client],
    );

    const stateChangeHandle = useCallback(
        async event => {
            if (event === 'active') {
                const path = await Clipboard.getString();
                if (
                    TOKEN &&
                    clipboardString.current !== path &&
                    String(path).indexOf('http') !== -1 &&
                    (String(path).indexOf('douyin') !== -1 || String(path).indexOf('chenzhongtech') !== -1)
                ) {
                    clipboardString.current = path;
                    if (onStart) {
                        onStart();
                    }
                    const [error, result] = await exceptionCapture(() => captureVideo(path));
                    if (error && onFailed) {
                        onFailed(error);
                    } else if (result && onSuccess) {
                        Clipboard.setString('');
                        onSuccess(result);
                    }
                }
            }
        },
        [captureVideo, onFailed, onSuccess],
    );

    useEffect(() => {
        AppState.addEventListener('change', stateChangeHandle);
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
        };
    }, [stateChangeHandle]);
};
