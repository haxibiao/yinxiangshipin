import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { getURLsFromString } from '../helper';

const shareLinkCache: { [key: string]: any } = {};

export function shareClipboardLink(clipboardString: string): Promise<any> {
    if (validateLink(clipboardString)) {
        const urls = getURLsFromString(clipboardString);
        if (urls[0]) {
            return getLinkContent(urls[0]);
        } else {
            return Promise.reject('分享失败，请检查分享链接是否正确');
        }
    } else {
        return Promise.reject('分享失败，请复制正确的分享链接');
    }

    function validateLink(linkString: string): boolean {
        if (
            linkString.indexOf('http') !== -1 &&
            (linkString.indexOf('douyin') !== -1 || linkString.indexOf('chenzhongtech') !== -1)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getLinkContent(link: string): Promise<any> {
        return fetch(`http://media.haxibiao.com/api/v1/spider/parse?share_link=${link}`)
            .then((response) => response.json())
            .then((content: any) => {
                shareLinkCache[clipboardString] = content;
                const item = content?.raw?.raw?.item_list[0];
                const title = item?.share_info?.share_title;
                const cover = item?.video?.dynamic_cover?.url_list[0];
                const url = content?.raw?.video?.play_url;
                return {
                    shareLink: clipboardString,
                    shareBody: {
                        link,
                        url,
                        title,
                        cover,
                    },
                };
            });
    }
}

export const useClipboardLink = (): [{ link: string; content: any }, (p: any) => void] => {
    const [shareContent, setShareContent] = useState<any>();

    const validateLink = useCallback((linkString) => {
        // console.log('====================================');
        // console.log('shareLinkCache', shareLinkCache);
        // console.log('linkString', linkString);
        // console.log('====================================');
        if (
            !shareLinkCache[linkString] &&
            linkString.indexOf('http') !== -1 &&
            (linkString.indexOf('douyin') !== -1 || linkString.indexOf('chenzhongtech') !== -1)
        ) {
            return true;
        } else {
            return false;
        }
    }, []);

    const getLinkContent = useCallback((link, clipboardString) => {
        fetch(`http://media.haxibiao.com/api/v1/spider/parse?share_link=${link}`)
            .then((response) => response.json())
            .then((content: any) => {
                shareLinkCache[clipboardString] = content;
                const item = content?.raw?.raw?.item_list[0];
                const play_url = content?.raw?.video?.play_url;
                setShareContent({
                    shareLink: clipboardString,
                    shareBody: {
                        link,
                        url: play_url,
                        title: item?.share_info?.share_title,
                        cover: item?.video?.dynamic_cover?.url_list[0],
                    },
                });
            })
            .catch((err) => {});
    }, []);

    const getClipboardString = useCallback(async () => {
        const clipboardString = await Clipboard.getString();

        if (validateLink(clipboardString)) {
            const urls = getURLsFromString(clipboardString);
            if (urls[0]) {
                getLinkContent(urls[0], clipboardString);
            }
        }
    }, []);

    const stateChangeHandle = useCallback(
        async (event) => {
            if (event === 'active') {
                getClipboardString();
            }
        },
        [getLinkContent],
    );

    useEffect(() => {
        getClipboardString();
    }, []);

    useEffect(() => {
        AppState.addEventListener('change', stateChangeHandle);
        return () => {
            AppState.removeEventListener('change', stateChangeHandle);
        };
    }, [stateChangeHandle]);

    return [shareContent, setShareContent];
};
