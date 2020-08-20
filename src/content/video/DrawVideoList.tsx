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
import { useNavigation } from '@react-navigation/native';
import { observer, userStore, appStore } from '@src/store';
import { GQL, useApolloClient } from '@src/apollo';
import CommentOverlay from '@src/screens/comment/CommentOverlay';
import VideoItem from './components/VideoItem';
import RewardProgress from './components/RewardProgress';
import useAdReward from './components/useAdReward';
import CommentInput from './components/CommentInput';
import { debounce, font, pixel } from '../helper';

const config = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 95,
};

export default observer(({ store, initialIndex, getVisibleItem, fetchData }) => {
    const navigation = useNavigation();
    const commentRef = useRef();

    const onLayout = useCallback((event) => {
        const { height } = event.nativeEvent.layout;
        store.fullVideoHeight = height;
    }, []);

    const onMomentumScrollEnd = useCallback(
        debounce(() => {
            if (fetchData instanceof Function) {
                fetchData();
            }
        }),
        [fetchData],
    );

    const getVisibleRows = useCallback(
        (info) => {
            if (info.viewableItems[0]) {
                getVisibleItem(info.viewableItems[0].index);
            }
        },
        [getVisibleItem],
    );

    const listFooter = useCallback(() => {
        if (store.data.length > 0 && store.status !== 'loadAll') {
            return (
                <View style={styles.listFooter}>
                    <LottieView source={require('../assets/loading.json')} style={{ width: '30%' }} loop autoPlay />
                </View>
            );
        }
        return null;
    }, []);

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

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <FlatList
                    onLayout={onLayout}
                    contentContainerStyle={styles.contentContainerStyle}
                    data={store.data}
                    initialScrollIndex={initialIndex}
                    bounces={false}
                    scrollsToTop={false}
                    pagingEnabled={true}
                    removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    keyExtractor={(item, index) => String(item.id || index)}
                    renderItem={({ item, index }) => (
                        <VideoItem
                            // VideoItem
                            // store.fullVideoHeight
                            // appStore.viewportHeight
                            // style={{
                            //     height: store.fullVideoHeight,
                            //     backgroundColor: index % 2 === 0 ? 'red' : 'yellow',
                            // }}
                            store={store}
                            media={item}
                            index={index}
                        />
                    )}
                    getItemLayout={(data, index) => ({
                        length: store.fullVideoHeight,
                        offset: store.fullVideoHeight * index,
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
                    ListFooterComponent={listFooter}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    onViewableItemsChanged={getVisibleRows}
                    viewabilityConfig={config}
                />
            </View>
            {/* {WatchReward} */}
            <TouchableOpacity
                activeOpacity={1}
                style={styles.commentInput}
                onPress={() => commentRef.current?.slideUp({ autoFocus: true })}>
                <CommentInput color="#fff" placeholderColor="#fff" editable={false} />
            </TouchableOpacity>
            <CommentOverlay ref={commentRef} media={store.currentItem} navigation={navigation} />
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
    commentInput: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    inputStyle: {
        color: '#fff',
    },
    rewardProgress: {
        bottom: pixel(380 + Theme.HOME_INDICATOR_HEIGHT),
        position: 'absolute',
        right: pixel(Theme.itemSpace),
    },
});
