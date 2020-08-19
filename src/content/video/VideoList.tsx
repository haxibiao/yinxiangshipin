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
import { Iconfont } from '@src/components';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FocusAwareStatusBar } from '@src/router';
import { observer, userStore, appStore } from '@src/store';
import { GQL, useApolloClient } from '@src/apollo';
import CommentOverlay from '@src/screens/comment/CommentOverlay';
import DrawVideoStore from './store';
import VideoItem from './components/VideoItem';
import RewardProgress from './components/RewardProgress';
import useAdReward from './components/useAdReward';
import { debounce, font, pixel } from '../helper';

const config = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 95,
};

export default observer(() => {
    const route = useRoute();
    const initVideo = useMemo(() => route?.params?.Video, []);
    const hasGoBack = useMemo(() => route?.params?.hasGoBack, []);
    const videoStore = useMemo(() => new DrawVideoStore(initVideo), []);
    const navigation = useNavigation();
    const client = useApolloClient();
    const commentRef = useRef();
    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        videoStore.fullVideoHeight = height;
    }, []);

    const onMomentumScrollEnd = useCallback(
        debounce(() => {
            if (videoStore.data.length - videoStore.viewableItemIndex <= 2) {
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

    // useAdReward({ focus: videoStore.currentItem.isAdPosition, store: videoStore });

    // const WatchReward = useMemo(() => {
    //     if (!appStore.enableWallet) {
    //         return (
    //             <View style={styles.rewardProgress}>
    //                 {!userStore.login && (
    //                     <ImageBackground
    //                         source={require('@app/assets/images/chat_left.png')}
    //                         style={styles.overlayTip}
    //                         resizeMode={'stretch'}>
    //                         <Text style={styles.overlayTipText}>登录后看视频赚钱、边看边赚</Text>
    //                     </ImageBackground>
    //                 )}
    //                 <RewardProgress store={videoStore} />
    //             </View>
    //         );
    //     }
    // }, [appStore.enableWallet, userStore.login]);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="light-content" />
            <View style={styles.navBar}>
                {hasGoBack && (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Iconfont name="fanhui" size={font(22)} color={'#fff'} />
                    </TouchableOpacity>
                )}
            </View>
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
                    renderItem={({ item, index }) => <VideoItem store={videoStore} media={item} index={index} />}
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
                    viewabilityConfig={config}
                />
            </View>

            {/* {WatchReward} */}
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
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Theme.NAVBAR_HEIGHT,
        paddingHorizontal: pixel(12),
        position: 'absolute',
        left: 0,
        right: 0,
        top: Theme.statusBarHeight,
        zIndex: 1,
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
});
