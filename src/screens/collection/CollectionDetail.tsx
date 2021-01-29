import React, { useRef, useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import { observer, userStore, notificationStore } from '@src/store';
import { FocusAwareStatusBar, Iconfont, DebouncedPressable } from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import CollectionInfo from './components/CollectionInfo';
import EpisodeItem from './components/EpisodeItem';

const QUERY_COUNT = 10;
const NAV_BAR_HEIGHT = pixel(Device.navBarHeight + Device.statusBarHeight);

export default observer(() => {
    const navigation = useNavigation();
    const route = useRoute();
    const collection = useMemo(() => route?.params?.collection, [route?.params]);

    const onShare = useCallback(() => {
        const description = `${collection.name}：${collection.description}`;
        notificationStore.sendShareNotice({ target: { ...collection, description }, type: 'collection' });
    }, [collection]);

    const contentOffset = useRef(new Animated.Value(0)).current;
    const onScroll = useMemo(() => {
        return Animated.event([{ nativeEvent: { contentOffset: { y: contentOffset } } }], {
            useNativeDriver: false,
        });
    }, []);
    const navBarOpacity1 = contentOffset.interpolate({
        inputRange: [0, NAV_BAR_HEIGHT, NAV_BAR_HEIGHT * 2],
        outputRange: [1, 1, 0],
    });
    const navBarOpacity2 = contentOffset.interpolate({
        inputRange: [0, NAV_BAR_HEIGHT, NAV_BAR_HEIGHT * 2],
        outputRange: [0, 0, 1],
    });
    const _renderNavBar = useCallback((): React.ReactElement => {
        return (
            <Animated.View style={styles.navBarWrap}>
                <Animated.View
                    style={[
                        styles.navBarContainer,
                        { backgroundColor: 'transparent', borderBottomColor: 'transparent', opacity: navBarOpacity1 },
                    ]}>
                    <DebouncedPressable style={styles.navBarButton} onPress={() => navigation.goBack()}>
                        <Iconfont name="fanhui" size={font(22)} color={'#fff'} />
                    </DebouncedPressable>
                    <View style={styles.navBarCenter}>
                        <Text style={[styles.navBarTitle, { color: '#ffffff88' }]} numberOfLines={1}>
                            合集
                        </Text>
                    </View>
                    <View style={styles.navBarRight}>
                        <DebouncedPressable style={styles.navBarButton} onPress={onShare}>
                            <Iconfont name="qita1" size={font(22)} color={'#fff'} />
                        </DebouncedPressable>
                    </View>
                </Animated.View>
                <Animated.View style={[styles.navBarContainer, { opacity: navBarOpacity2 }]}>
                    <DebouncedPressable style={styles.navBarButton} onPress={() => navigation.goBack()}>
                        <Iconfont name="fanhui" size={font(22)} color={'#2b2b2b'} />
                    </DebouncedPressable>
                    <View style={styles.navBarCenter}>
                        <Text style={styles.navBarTitle} numberOfLines={1}>
                            合集
                        </Text>
                    </View>
                    <View style={styles.navBarRight}>
                        <DebouncedPressable style={styles.navBarButton} onPress={onShare}>
                            <Iconfont name="qita1" size={font(22)} color={'#2b2b2b'} />
                        </DebouncedPressable>
                    </View>
                </Animated.View>
            </Animated.View>
        );
    }, []);

    const _renderHeader = useCallback(({ data }) => {
        return (
            <CollectionInfo style={styles.header} collection={data?.collection || collection} navigation={navigation} />
        );
    }, []);

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" />
            <QueryList
                onScroll={onScroll}
                gqlDocument={GQL.collectionPostsQuery}
                dataOptionChain="collection.posts.data"
                paginateOptionChain="collection.posts.paginatorInfo"
                options={{
                    variables: {
                        collection_id: collection.id,
                        count: QUERY_COUNT,
                    },
                    fetchPolicy: 'network-only',
                }}
                contentContainerStyle={styles.contentContainer}
                ListHeaderComponent={_renderHeader}
                renderItem={({ item, index, data, page }) => (
                    <EpisodeItem
                        item={item}
                        index={index}
                        collection={collection}
                        listData={data}
                        nextPage={page}
                        count={QUERY_COUNT}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
            {_renderNavBar()}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navBarWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    navBarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: NAV_BAR_HEIGHT,
        paddingTop: pixel(Device.statusBarHeight),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f0f0f0',
    },
    navBarCenter: {
        position: 'absolute',
        top: pixel(Device.statusBarHeight),
        bottom: 0,
        left: pixel(100),
        right: pixel(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    navBarTitle: {
        color: '#2b2b2b',
        fontSize: font(17),
    },
    navBarRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navBarButton: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: pixel(Theme.edgeDistance),
    },
    header: {
        paddingTop: NAV_BAR_HEIGHT,
        marginBottom: pixel(Theme.edgeDistance),
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Device.bottomInset,
    },
    itemSeparator: {
        marginVertical: pixel(Theme.edgeDistance),
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f0f0f0',
    },
});
