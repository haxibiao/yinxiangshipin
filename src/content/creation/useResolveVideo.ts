import { useCallback, useEffect, useRef, useMemo } from 'react';
import { GQL } from '@src/apollo';
import { exceptionCapture } from '@src/common';
import { notificationStore } from '@src/store';

interface Props {
    shareLink: string;
    content?: string;
    client: any;
    onSuccess?: (Event?: any) => any;
    onFailed?: (Event?: any) => any;
}

export const useResolveVideo = (props: Props): (() => Promise<void>) => {
    const { shareLink, content, client, onSuccess, onFailed } = props;

    const resolveDyVideo = useCallback(async () => {
        notificationStore.toggleLoadingVisible();
        const [error, res] = await exceptionCapture(() =>
            client.mutate({
                mutation: GQL.resolveDouyinVideo,
                variables: {
                    share_link: shareLink,
                    content,
                },
            }),
        );
        notificationStore.toggleLoadingVisible();
        if (error) {
            if (onFailed instanceof Function) {
                onFailed('收藏失败');
            }
        } else if (res) {
            if (onSuccess instanceof Function) {
                onSuccess('收藏成功');
            }
        }
    }, [client, shareLink, content, onSuccess, onFailed]);

    return resolveDyVideo;
};
