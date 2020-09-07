import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    DeviceEventEmitter,
    BackHandler,
} from 'react-native';
import { ad } from 'react-native-ad';
import LottieView from 'lottie-react-native';
import { Iconfont } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FocusAwareStatusBar } from '@src/router';
import { observer, userStore, appStore, adStore } from '@src/store';
import { GQL, useApolloClient } from '@src/apollo';
import CommentOverlay from '@src/screens/comment/CommentOverlay';
import DrawVideoStore from './VideoStore';
import VideoItem from './components/VideoItem';
import RewardProgress from './components/RewardProgress';
import useAdReward from './components/useAdReward';
import { debounce } from '../helper';

export default observer(() => {
    const commentRef = useRef();
    const navigation = useNavigation();
    const videoStore = useMemo(() => new DrawVideoStore(initVideo), []);
    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        videoStore.fullVideoHeight = height;
    }, []);

    const onMomentumScrollEnd = useCallback(
        debounce(() => {
            if (videoStore.data.length - videoStore.viewableItemIndex <= 3) {
                videoStore.fetchData();
            }
        }),
        [],
    );

    const getVisibleRows = useCallback((info) => {
        if (info.viewableItems[0]) {
            videoStore.viewableItemIndex = info.viewableItems[0].index;
        }
    }, []);

    // const [onClickReward] = useMutation(GQL.RewardMutation, {
    //     variables: {
    //         reason: 'DRAW_FEED_ADVIDEO_REWARD',
    //     },
    //     refetchQueries: () => [
    //         {
    //             query: GQL.MeMetaQuery,
    //         },
    //     ],
    // });

    // const getReward = useCallback(async (media: any) => {
    //     const drawFeedAdId = media.id.toString();
    //     console.log('media :', media);
    //     if (videoStore.getReward.indexOf(drawFeedAdId) === -1) {
    //         videoStore.addGetRewardId(drawFeedAdId);
    //         // 发放给精力奖励
    //         const [error, res] = await Helper.exceptionCapture(onClickReward);
    //         if (error) {
    //             Toast.show({
    //                 content: '遇到未知错误，领取失败',
    //             });
    //         } else {
    //             const gold = Helper.syncGetter('data.reward.gold', res);

    //             RewardOverlay.show({
    //                 reward: {
    //                     gold: gold,
    //                 },
    //                 title: '领取点击详情奖励成功',
    //             });
    //             rewardTrack({
    //                 name: `点击drawFeed广告奖励`,
    //             });
    //         }
    //     } else {
    //         Toast.show({
    //             content: `该视频已获取过点击奖励`,
    //             duration: 2000,
    //         });
    //     }
    // }, []);

    const renderVideoItem = useCallback(
        ({ item, index }) => {
            // index > 0 && index % 5 === 0
            // item?.is_ad && adStore.enableAd
            if (item?.is_ad && adStore.enableAd) {
                if (Math.abs(index - videoStore.viewableItemIndex) === 1) {
                    return (
                        <View style={{ height: videoStore.fullVideoHeight }}>
                            <View style={styles.contentCover}>
                                <Image
                                    style={styles.curtain}
                                    source={require('@app/assets/images/curtain.png')}
                                    resizeMode="cover"
                                    blurRadius={2}
                                />
                                <View style={styles.blackMask} />
                            </View>
                        </View>
                    );
                }
                return (
                    <View style={{ height: videoStore.fullVideoHeight }}>
                        <ad.DrawFeed codeid={adStore.codeid_draw_video} onAdClick={() => {}} />
                        {/* <View style={styles.adClickTip}>
                            <Image
                                source={require('@app/assets/images/click_tips.png')}
                                style={styles.adClickTipImage}
                            />
                            <Text style={styles.adClickTipText}>戳一戳，领取奖励</Text>
                        </View> */}
                    </View>
                );
            }
            return <VideoItem store={videoStore} media={item} index={index} />;
        },
        [videoStore.viewableItemIndex],
    );

    useEffect(() => {
        if (userStore.launched) {
            videoStore.fetchData();
        }
    }, [userStore.launched]);

    useEffect(() => {
        const hardwareBackPress = BackHandler.addEventListener('hardwareBackPress', () => {
            if (commentRef.current?.state?.visible) {
                commentRef.current?.slideDown();
                return true;
            }
            return false;
        });
        DeviceEventEmitter.addListener('showCommentModal', () => {
            commentRef.current?.slideUp();
        });
        DeviceEventEmitter.addListener('hideCommentModal', () => {
            commentRef.current?.slideDown();
        });
        return () => {
            hardwareBackPress.remove();
            DeviceEventEmitter.removeListener('showCommentModal');
            DeviceEventEmitter.removeListener('hideCommentModal');
        };
    }, []);

    useEffect(() => {
        const navWillFocusListener = navigation.addListener('focus', () => {
            videoStore.visibility = true;
        });
        const navWillBlurListener = navigation.addListener('blur', () => {
            videoStore.visibility = false;
        });
        const videoBlurListener = DeviceEventEmitter.addListener('videoFocus', () => {
            videoStore.visibility = true;
        });
        const videoFocusListener = DeviceEventEmitter.addListener('videoBlur', () => {
            videoStore.visibility = false;
        });
        return () => {
            navWillFocusListener();
            navWillBlurListener();
            videoBlurListener.remove();
            videoFocusListener.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <View style={styles.listContainer}>
                <FlatList
                    contentContainerStyle={styles.contentContainerStyle}
                    onLayout={onLayout}
                    data={videoStore.data}
                    bounces={false}
                    scrollsToTop={false}
                    pagingEnabled={true}
                    removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    keyExtractor={(item, index) => String(item.id || index)}
                    renderItem={renderVideoItem}
                    getItemLayout={(data, index) => ({
                        length: videoStore.fullVideoHeight,
                        offset: videoStore.fullVideoHeight * index,
                        index,
                    })}
                    ListEmptyComponent={
                        <ImageBackground
                            style={styles.emptyContainer}
                            source={require('@app/assets/images/curtain.png')}>
                            <LottieView
                                source={require('../assets/loading.json')}
                                style={{ width: '50%' }}
                                loop
                                autoPlay
                            />
                        </ImageBackground>
                    }
                    ListFooterComponent={
                        videoStore.data.length > 0 && (
                            <View style={styles.listFooter}>
                                <LottieView
                                    source={require('../assets/loading.json')}
                                    style={{ width: '30%' }}
                                    loop
                                    autoPlay
                                />
                            </View>
                        )
                    }
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onViewableItemsChanged={getVisibleRows}
                    viewabilityConfig={{
                        waitForInteraction: true,
                        viewAreaCoveragePercentThreshold: 95,
                    }}
                />
            </View>

            {/* {RewardProgress} */}
            <CommentOverlay ref={commentRef} media={videoStore.currentItem} navigation={navigation} />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Device.isFullScreenDevice ? Theme.statusBarHeight : 0,
        paddingBottom: Device.isFullScreenDevice ? Theme.BOTTOM_HEIGHT : 0,
        backgroundColor: '#000',
    },
    listContainer: {
        flex: 1,
        overflow: 'hidden',
        borderRadius: Device.isFullScreenDevice ? pixel(8) : 0,
    },
    contentContainerStyle: {
        flexGrow: 1,
        // overflow: 'hidden',
        // borderRadius: Device.isFullScreenDevice ? pixel(8) : 0,
    },
    emptyContainer: {
        flex: 1,
        width: undefined,
        height: undefined,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooter: {
        alignItems: 'center',
    },
    rewardProgress: {
        bottom: pixel(380 + Theme.HOME_INDICATOR_HEIGHT),
        position: 'absolute',
        right: pixel(Theme.itemSpace),
    },
    contentCover: {
        ...StyleSheet.absoluteFillObject,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: undefined,
        height: undefined,
    },
    blackMask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    adClickTip: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: pixel(15),
        bottom: pixel(25),
    },
    adClickTipImage: {
        width: pixel((20 * 208) / 118),
        height: pixel(20),
    },
    adClickTipText: {
        color: '#C0CBD4',
        fontSize: font(12),
        marginHorizontal: pixel(10),
    },
});
