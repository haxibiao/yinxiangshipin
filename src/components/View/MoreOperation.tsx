import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Linking, Platform, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import * as WeChat from 'react-native-wechat-lib';
import ShareIOS from 'react-native-share';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import * as QQAPI from 'react-native-qq';
import { userStore, appStore } from '@src/store';
import { download, syncGetter, exceptionCapture, useReport } from '@src/common';
import { Share } from '@src/native';
import { GQL, useMutation, errorMessage } from '@src/apollo';
import ContentShareCardOverlay from '../share/ContentShareCardOverlay';
import CollectionShareOverlay from '../share/CollectionShareOverlay';
import Loading from '../Popup/Loading';

const MoreOperation = (props: any) => {
    const { shares, options, type, target, closeOverlay, onRemove, client, navigation } = props;
    const collection = target?.collections?.[0];
    const shareLink = useRef();
    const report = useReport({ target, type });

    const [deleteArticleMutation] = useMutation(GQL.deleteArticleMutation, {
        variables: {
            id: target.id,
        },
        onCompleted: (data: any) => {
            if (onRemove instanceof Function) {
                onRemove();
            }
            Toast.show({
                content: '删除成功',
            });
        },
        onError: (error: any) => {
            Toast.show({
                content: errorMessage(error) || '删除失败',
            });
        },
    });

    const deleteArticle = useCallback(() => {
        closeOverlay();
        deleteArticleMutation();
    }, [deleteArticleMutation]);

    const fetchShareLink = useCallback(async () => {
        if (shareLink.current) {
            return shareLink.current;
        }
        const [error, result] = await exceptionCapture(() =>
            client.query({
                query: GQL.sharePostQuery,
                variables: {
                    id: target.id,
                },
            }),
        );
        if (error) {
            Toast.show({ content: error?.message });
            return null;
        } else if (syncGetter('data.sharePost', result)) {
            shareLink.current = syncGetter('data.sharePost', result);
            return shareLink.current;
        }
    }, []);

    const copyLink = useCallback(async () => {
        closeOverlay();
        const link = await fetchShareLink();
        Clipboard.setString(link);
        Toast.show({ content: '复制成功，快去分享给好友吧！' });
    }, []);

    const reportArticle = useCallback(() => {
        closeOverlay();
        report();
    }, [report]);

    const downloadVideo = useCallback(async () => {
        closeOverlay();
        Loading.show();
        const [err, res] = await exceptionCapture(() =>
            client.mutate({
                mutation: GQL.downloadVideoMutation,
                variables: {
                    video_id: target?.video?.id,
                },
            }),
        );
        const url = res?.data?.downloadVideo;
        Loading.hide();
        if (url) {
            const title = String(Config.AppID + '' + target?.id + '-' + target?.video?.id).replace(/\s+/g, '');
            download({ url, title });
        } else {
            Toast.show({ content: '下载失败' });
        }
    }, [target]);

    const dislike = useCallback(() => {
        closeOverlay();
        if (TOKEN) {
            client
                .mutate({
                    mutation: GQL.addArticleBlockMutation,
                    variables: {
                        id: target.id,
                    },
                })
                .then((result: any) => {
                    if (onRemove instanceof Function) {
                        onRemove();
                    }
                    Toast.show({ content: '操作成功，将减少此类型内容的推荐！' });
                })
                .catch((error: any) => {
                    // 查询接口，服务器返回错误后
                    Toast.show({ content: errorMessage(error) });
                });
        } else {
            navigation.navigate('Login');
        }
    }, [target]);

    const shield = useCallback(() => {
        closeOverlay();
        if (TOKEN) {
            client
                .mutate({
                    mutation: GQL.addUserBlockMutation,
                    variables: {
                        id: target.id,
                    },
                    refetchQueries: () => [
                        {
                            query: GQL.publicPostsQuery,
                        },
                        {
                            query: GQL.publicVideosQuery,
                        },
                    ],
                })
                .then((result: any) => {
                    navigation.goBack();
                    Toast.show({ content: '拉黑成功，下拉刷新将减少此用户内容的推荐！' });
                })
                .catch((error: any) => {
                    // 查询接口，服务器返回错误后
                    Toast.show({ content: error.message });
                });
        } else {
            navigation.navigate('Login');
        }
    }, []);

    const shareCard = useCallback(async () => {
        closeOverlay();
        ContentShareCardOverlay.show(target);
    }, []);

    const fetchShareCollection = useCallback(async () => {
        const [error, result] = await exceptionCapture(() =>
            client.query({
                query: GQL.shareCollectionMutation,
                variables: {
                    collection_id: collection?.id,
                },
            }),
        );
        const collectionUrl = syncGetter('data.shareCollection', result);
        if (collectionUrl) {
            return collectionUrl;
        }
        if (error) {
            return null;
        }
    }, []);

    const shareCollection = useCallback(async () => {
        closeOverlay();
        const collectionUrl = await fetchShareCollection();
        if (collectionUrl) {
            // 解析合集网址
            const image = [...collectionUrl.match(/#http.*?#/g)][0].replace(/#/g, '');
            CollectionShareOverlay.show(collectionUrl, image, collection);
        } else {
            Toast.show({ content: '分享出错' });
        }
    }, []);

    const operation = useMemo(
        () => ({
            下载: {
                image: require('@app/assets/images/operation/more_video_download.png'),
                callback: downloadVideo,
            },
            复制链接: {
                image: require('@app/assets/images/operation/more_links.png'),
                callback: copyLink,
            },
            分享长图: {
                image: require('@app/assets/images/operation/more_large_img.png'),
                callback: shareCard,
            },
            举报: {
                image: require('@app/assets/images/operation/more_report.png'),
                callback: reportArticle,
            },
            删除: {
                image: require('@app/assets/images/operation/more_delete.png'),
                callback: deleteArticle,
            },
            不感兴趣: {
                image: require('@app/assets/images/operation/more_dislike.png'),
                callback: dislike,
            },
            拉黑: {
                image: require('@app/assets/images/operation/more_shield.png'),
                callback: shield,
            },
            分享合集: {
                image: require('@app/assets/images/operation/more_content.png'),
                callback: shareCollection,
            },
        }),
        [reportArticle, deleteArticle, dislike, downloadVideo, copyLink, shield, shareCollection],
    );

    const optionsView = useMemo(() => {
        return options.map((option: any, index: number) => {
            if ((option === '下载' || option === '复制链接') && !target?.video?.url) {
                return;
            } else if (option === '分享合集' && !collection) {
                return;
            }

            return (
                <TouchableOpacity
                    style={[styles.optionItem, options.length < 5 && { width: Device.WIDTH / 4 }]}
                    key={index}
                    onPress={operation[option].callback}>
                    <Image style={styles.optionIcon} source={operation[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchableOpacity>
            );
        });
    }, [options]);

    const shareToWechat = useCallback(async () => {
        closeOverlay();
        const link = await fetchShareLink();

        if (Device.IOS) {
            ShareIOS.open({
                title: '分享给朋友',
                url: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
            });
            return;
        }

        try {
            await WeChat.shareWebpage({
                title: target.description,
                description:
                    (Config.AppName ? '我在' + Config.AppName + '发现' : '') + '一个很有意思的内容，分享给你看看',
                webpageUrl: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
                thumbImageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
                scene: 0,
            });
        } catch (e) {
            Toast.show({ content: '未安装微信或当前微信版本较低' });
        }
    }, []);

    const shareToTimeline = useCallback(async () => {
        closeOverlay();
        const link = await fetchShareLink();

        if (Device.IOS) {
            ShareIOS.open({
                title: '分享给朋友',
                url: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
            });
            return;
        }

        try {
            await WeChat.shareWebpage({
                title: target.description,
                description:
                    (Config.AppName ? '我在' + Config.AppName + '发现' : '') + '一个很有意思的内容，分享给你看看',
                webpageUrl: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
                thumbImageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
                scene: 1,
            });
        } catch (e) {
            Toast.show({ content: '未安装微信或当前微信版本较低' });
        }
    }, []);

    const shareToQQ = useCallback(async () => {
        closeOverlay();
        // const baseurl = new Buffer(Config.ServerRoot + "/share/post/"+ target.id).toString('base64');
        // const baseimage = new Buffer(Config.ServerRoot + "/logo/ " + Config.PackageName + " .com.small.png").toString('base64');
        // const basetitle = new Buffer("这个视频好好看分享给你").toString('base64');
        // const basedesc = new Buffer(target.body).toString('base64');
        // const openUrl = "mqqapi://share/to_fri?file_type=news&src_type=web&version=1&generalpastboard=1&share_id=1107845270&url="+ baseurl +"&previewimageUrl=" + baseimage + "&image_url=" + baseimage + "&title=" + basetitle + "&description=" + basedesc + "&callback_type=scheme&thirdAppDisplayName=UVE=&app_name=UVE=&cflag=0&shareType=0";
        // Linking.openURL(openUrl);
        const link = await fetchShareLink();

        // if (Device.IOS) {
        ShareIOS.open({
            title: '分享给朋友',
            url: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
        });
        return;
        // }

        // QQAPI.shareToQQ({
        //     type: 'news',
        //     title: (Config.AppName ? '我在' + Config.AppName : '') + '发现一个很有意思的内容，分享给你看看',
        //     description: target.description,
        //     webpageUrl: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
        //     imageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
        // }).then((data: any) => {
        // });

        // const callback = await QQAPI.shareToQQ({
        //     type: 'news',
        //     title: '',
        //     description: target.body,
        //     webpageUrl: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
        //     imageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
        // });

        // if (!callback) {
        //     Toast.show({
        //         content: '请先安装QQ客户端',
        //     });
        // }
    }, []);

    const shareToWeiBo = useCallback(async () => {
        closeOverlay();
        const link = await fetchShareLink();
        // Clipboard.setString(link);

        // 微博分享先用系统分享方案代替
        ShareIOS.open({
            title: '分享给朋友',
            url: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
        });

        // const callback = await Share.shareToSinaFriends(link);

        // if (!callback) {
        //     Toast.show({
        //         content: '请先安装微博客户端',
        //     });
        // }
    }, []);

    const shareToQQZone = useCallback(async () => {
        closeOverlay();
        const link = await fetchShareLink();
        // Clipboard.setString(link);

        // 先简单拦截一下 IOS 的分享操作
        // if (Device.IOS) {
        ShareIOS.open({
            title: '分享给朋友',
            url: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
        });
        return;
        // }

        // QQAPI.shareToQzone({
        //     type: 'news',
        //     title: target.description,
        //     description: (Config.AppName ? '我在' + Config.AppName : '') + '发现一个很有意思的内容，分享给你看看',
        //     webpageUrl: Config.ServerRoot + `/share/post/${target.id}?user_id=${userStore.me.id}`,
        //     imageUrl: Config.ServerRoot + `/logo/${Config.PackageName}.com.png`,
        // }).then((data: any) => {
        // });

        // const callback = await Share.shareImageToQQZone(link);

        // if (!callback) {
        //     Toast.show({
        //         content: '请先安装QQ空间客户端',
        //     });
        // }
    }, []);

    const share = useMemo(
        () => ({
            微信: {
                image: require('@app/assets/images/share/share_wx.png'),
                callback: shareToWechat,
            },
            QQ好友: {
                image: require('@app/assets/images/share/share_qq.png'),
                callback: shareToQQ,
            },
            微博: {
                image: require('@app/assets/images/share/share_wb.png'),
                callback: shareToWeiBo,
            },
            朋友圈: {
                image: require('@app/assets/images/share/share_pyq.png'),
                callback: shareToTimeline,
            },
            QQ空间: {
                image: require('@app/assets/images/share/share_qqz.png'),
                callback: shareToQQZone,
            },
        }),
        [],
    );

    const shareView = useMemo(() => {
        return shares.map((option: any, index: any) => {
            return (
                <TouchableOpacity
                    style={[styles.optionItem, shares.length < 5 && { width: Device.WIDTH / 4 }]}
                    key={index}
                    onPress={share[option].callback}>
                    <Image style={styles.optionIcon} source={share[option].image} />
                    <Text style={styles.optionName}>{option}</Text>
                </TouchableOpacity>
            );
        });
    }, [shares]);

    return (
        <View style={styles.optionsContainer}>
            {type === 'articles' && (
                <View style={[styles.body, { marginTop: pixel(10) }]}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {shareView}
                    </ScrollView>
                </View>
            )}
            <View style={styles.dividingLine} />
            <View style={styles.body}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {optionsView}
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.footer} onPress={closeOverlay}>
                <Text style={styles.footerText}>取消</Text>
            </TouchableOpacity>
        </View>
    );
};

MoreOperation.defaultProps = {
    type: 'articles',
    options: ['不感兴趣', '举报'],
    shares: ['微信', 'QQ好友', '微博', '朋友圈', 'QQ空间'],
};

const styles = StyleSheet.create({
    body: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: pixel(5),
    },
    dividingLine: {
        borderBottomWidth: pixel(0.2),
        borderColor: Theme.borderColor,
        marginHorizontal: pixel(25),
    },
    footer: {
        alignItems: 'center',
        borderColor: Theme.borderColor,
        borderTopWidth: pixel(1),
        justifyContent: 'center',
        paddingVertical: pixel(Theme.edgeDistance),
    },
    footerText: {
        color: Theme.defaultTextColor,
        fontSize: font(15),
    },
    optionIcon: {
        height: pixel(50),
        width: pixel(50),
    },
    optionItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: Device.WIDTH * 0.22,
        padding: pixel(12),
    },
    optionName: {
        color: Theme.subTextColor,
        fontSize: font(13),
        marginTop: pixel(10),
    },
    optionsContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        overflow: 'hidden',
        paddingBottom: pixel(Theme.bottomInset),
    },
});

export default MoreOperation;
