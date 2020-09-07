import { useCallback, useEffect, useRef, useMemo } from 'react';
import { Loading } from '@src/components';
import { GQL } from '@src/apollo';
import { exceptionCapture } from '@src/common';

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
        Loading.show();
        const [error, res] = await exceptionCapture(() =>
            client.mutate({
                mutation: GQL.resolveDouyinVideo,
                variables: {
                    share_link: shareLink,
                    content,
                },
            }),
        );
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
    }, [client, shareLink, content, onSuccess, onFailed]);

    return resolveDyVideo;
};
