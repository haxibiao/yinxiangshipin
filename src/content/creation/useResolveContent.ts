import { useCallback, useEffect, useRef, useMemo } from 'react';
import { Loading } from '@src/components';
import { exceptionCapture, GQL } from '../service';

interface Props {
    shareLink: string;
    client: any;
    onSuccess?: (Event?: any) => any;
    onFailed?: (Event?: any) => any;
}

export const useResolveContent = (props: Props): (() => Promise<void>) => {
    const { shareLink, client, onSuccess, onFailed } = props;

    const resolveDyVideo = useCallback(async () => {
        Loading.show();
        const [error, res] = await exceptionCapture(() =>
            client.mutate({
                mutation: GQL.resolveDouyinVideo,
                variables: {
                    share_link: shareLink,
                },
            }),
        );
        console.log('error', client, shareLink, error, res);

        Loading.hide();
        if (error) {
            Toast.show({ content: '收藏失败' });
            if (onFailed instanceof Function) {
                onFailed();
            }
        } else if (res) {
            Toast.show({ content: '收藏成功' });
            if (onSuccess instanceof Function) {
                onSuccess();
            }
        }
    }, [client, shareLink, onSuccess, onFailed]);

    return resolveDyVideo;
};
