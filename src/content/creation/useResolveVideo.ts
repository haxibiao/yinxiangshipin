import { useCallback, useEffect, useRef, useMemo } from 'react';
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

    const resolveDyVideo = useCallback(() => {
        return new Promise(async (resolve, reject) => {
            const [err, res] = await exceptionCapture(() =>
                client.mutate({
                    mutation: GQL.resolveDouyinVideo,
                    variables: {
                        share_link: shareLink,
                        content,
                    },
                }),
            );
            if (err) {
                reject();
                if (onFailed instanceof Function) {
                    onFailed('收藏失败');
                }
            } else if (res) {
                resolve();
                if (onSuccess instanceof Function) {
                    onSuccess('收藏成功');
                }
            }
        });
    }, [client, shareLink, content, onSuccess, onFailed]);

    return resolveDyVideo;
};
