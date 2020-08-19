import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { observer, appStore } from '@src/store';
import { Header } from '@src/components';
import { GQL, QueryList, MediaItem } from '@src/content';
import { observable } from 'mobx';
import { useRoute } from '@react-navigation/native';

export default observer((props: any) => {
    const route = useRoute();
    const tag = route?.params?.tag;
    const [hot, setHot] = useState(false);

    const header = useMemo(() => {
        return (
            <View style={styles.header}>
                <View style={styles.tagLogoWrap}>
                    <Image style={styles.tagLogo} source={require('@app/assets/images/icons/ic_tag_red.png')} />
                </View>
                <View style={styles.tagData}>
                    <View style={styles.tagInfo}>
                        <Text style={styles.tagName}>#{tag?.name}</Text>
                        <Text style={styles.tagCountHits}>{`${tag?.count_hits || Math.random() * 10}w播放`}</Text>
                    </View>
                    {/* <TouchableOpacity style={styles.filterBtn} onPress={() => setHot((h) => !h)} activeOpacity={1}>
                        <Image
                            style={styles.filterIcon}
                            source={require('@app/assets/images/icons/ic_order_gray.png')}
                        />
                        <Text style={styles.filterBtnName}>{hot ? '最多点赞' : '最新发布'}</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity style={styles.favoriteBtn}>
                        <Iconfont name="favorite" size={font(18)} color={tag?.favorite ? '#FE1966' : '#fff'} />
                        <Text style={styles.favoriteBtnName}>{tag?.favorite ? '取消收藏' : '收藏'}</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }, [hot, tag]);

    const renderItem = useCallback(({ item, index }) => {
        return (
            <View style={styles.itemWrap}>
                <MediaItem media={item} />
            </View>
        );
    }, []);

    const scrollAnimateValue = useRef(new Animated.Value(0));

    const onScroll = useMemo(() => {
        return Animated.event([{ nativeEvent: { contentOffset: { y: scrollAnimateValue.current } } }]);
    }, []);

    const titleOpacity = scrollAnimateValue.current.interpolate({
        inputRange: [pixel(50), percent(50)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <Header
                lightBar
                centerComponent={
                    <Animated.View style={[styles.navTitle, { opacity: titleOpacity }]}>
                        <Text style={styles.title}>{tag?.name}</Text>
                    </Animated.View>
                }
            />
            <QueryList
                gqlDocument={GQL.tagPostsQuery}
                dataOptionChain="tag.posts.data"
                paginateOptionChain="tag.posts.paginatorInfo"
                options={{
                    variables: {
                        tag_id: 24 || tag?.id,
                        count: 10,
                        visibility: 'all',
                    },
                }}
                onScroll={onScroll}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapperStyle}
                ListHeaderComponent={header}
                renderItem={renderItem}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161924',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    navTitle: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: pixel(40),
    },
    title: {
        fontSize: font(18),
        color: '#fff',
    },
    header: {
        flexDirection: 'row',
        padding: pixel(15),
        paddingBottom: pixel(30),
    },
    tagLogoWrap: {
        width: percent(25),
        height: percent(25),
        borderRadius: pixel(2),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    tagLogo: {
        width: '50%',
        height: '50%',
    },
    tagData: {
        flex: 1,
        marginLeft: pixel(15),
        // justifyContent: 'center',
        justifyContent: 'space-between',
    },
    tagInfo: {},
    tagName: {
        fontSize: font(20),
        fontWeight: 'bold',
        color: '#fff',
    },
    tagCountHits: {
        marginTop: pixel(5),
        fontSize: font(14),
        color: '#b2b2b2',
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterIcon: {
        width: pixel(15),
        height: pixel(15),
        marginRight: pixel(4),
    },
    filterBtnName: {
        fontSize: font(14),
        color: '#b2b2b2',
    },
    itemWrap: {
        width: '33.33%',
        height: percent(33.33) * 1.4,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: '#2b2b2b',
        backgroundColor: '#2b2b2b',
    },
    columnWrapperStyle: {
        borderWidth: StyleSheet.hairlineWidth,
    },
});
