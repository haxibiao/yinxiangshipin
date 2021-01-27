import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native';
import { observer, appStore } from '@src/store';
import { NavBarHeader, SafeText } from '@src/components';
import { syncGetter, count, mergeProperty } from '@src/common';
import { GQL, useQuery } from '@src/apollo';
import { QueryList } from '@src/content';
import { observable } from 'mobx';
import { useRoute, useNavigation } from '@react-navigation/native';

const QUERY_COUNT = 12;

export default observer((props: any) => {
    const navigation = useNavigation();
    const route = useRoute();
    const tag = route?.params?.tag;
    const [hot, setHot] = useState(false);

    const scrollAnimateValue = useRef(new Animated.Value(0));
    const onScroll = useMemo(() => {
        return Animated.event([{ nativeEvent: { contentOffset: { y: scrollAnimateValue.current } } }], {
            useNativeDriver: false,
        });
    }, []);
    const titleOpacity = scrollAnimateValue.current.interpolate({
        inputRange: [pixel(50), percent(50)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const goToScreen = useCallback(
        ({ item, tag, initData, itemIndex, page }) => {
            if (item?.video?.id) {
                navigation.push('TagVideoList', {
                    tag,
                    initData,
                    itemIndex,
                    page,
                    count: QUERY_COUNT,
                    order: hot ? 'HOT' : 'LATEST',
                });
            } else {
                navigation.push('PostDetail', { post: item });
            }
        },
        [hot],
    );

    const renderItem = useCallback(
        ({ item, index, data, page }) => {
            let cover;
            if (item?.video?.id) {
                cover = item?.video?.dynamic_cover || item?.video?.cover;
            } else {
                cover = item?.images?.['0']?.url;
            }
            return (
                <TouchableWithoutFeedback
                    onPress={() =>
                        goToScreen({
                            tag,
                            item,
                            itemIndex: index,
                            initData: data,
                            page,
                        })
                    }>
                    <View style={styles.itemWrap}>
                        <Image style={styles.videoCover} source={{ uri: cover }} />
                    </View>
                </TouchableWithoutFeedback>
            );
        },
        [tag],
    );

    const listHeader = useCallback(
        ({ data }) => {
            const tagData = data?.tag;
            return (
                <View style={styles.header}>
                    <View style={styles.tagLogoWrap}>
                        <Image style={styles.tagLogo} source={require('@app/assets/images/icons/ic_tag_red.png')} />
                    </View>
                    <View style={styles.tagInfo}>
                        <View style={styles.tagInfoTop}>
                            <SafeText style={styles.tagName}>#{tagData?.name || '视频合集'}</SafeText>
                            <SafeText style={styles.tagCount}>{`${
                                count(Number(tagData?.count_views) + Number(tagData?.id)) || '0.0'
                            }次播放`}</SafeText>
                        </View>
                        <View style={styles.tagInfoBottom}>
                            <SafeText style={styles.tagCount}>{`${count(
                                tagData?.count_posts > 0 ? tagData?.count_posts : '0.0',
                            )}个视频`}</SafeText>
                            <TouchableOpacity
                                style={styles.filterBtn}
                                onPress={() =>
                                    setHot((h) => {
                                        return !h;
                                    })
                                }
                                activeOpacity={1}>
                                <Image
                                    style={styles.filterIcon}
                                    source={require('@app/assets/images/icons/ic_order_gray.png')}
                                />
                                <SafeText style={styles.filterBtnName}>{hot ? '最多点赞' : '最新发布'}</SafeText>
                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity style={styles.favoriteBtn}>
                        <Iconfont name="favorite" size={font(18)} color={tag?.favorite ? Theme.primaryColor : '#fff'} />
                        <Text style={styles.favoriteBtnName}>{tag?.favorite ? '取消收藏' : '收藏'}</Text>
                    </TouchableOpacity> */}
                    </View>
                </View>
            );
        },
        [hot],
    );

    return (
        <View style={styles.container}>
            <NavBarHeader
                isTransparent
                hasSearchButton={true}
                onPressSearch={() => navigation.push('SearchVideo', { tag_id: tag.id })}
                centerStyle={{ opacity: titleOpacity }}
                title={tag?.name}
            />
            <QueryList
                onScroll={onScroll}
                contentContainerStyle={styles.contentContainer}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapperStyle}
                gqlDocument={GQL.tagPostsQuery}
                dataOptionChain="tag.posts.data"
                paginateOptionChain="tag.posts.paginatorInfo"
                options={{
                    variables: {
                        tag_id: tag?.id,
                        count: QUERY_COUNT,
                        order: hot ? 'HOT' : 'LATEST',
                        visibility: 'all',
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                ListHeaderComponent={listHeader}
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
        paddingBottom: Theme.bottomInset,
    },
    columnWrapperStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#161924',
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
        paddingTop: pixel(5),
        paddingBottom: pixel(20),
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
    tagInfo: {
        flex: 1,
        marginLeft: pixel(15),
        // justifyContent: 'center',
        justifyContent: 'space-between',
    },
    tagInfoTop: {},
    tagInfoBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tagName: {
        marginBottom: pixel(5),
        fontSize: font(20),
        fontWeight: 'bold',
        color: '#fff',
    },
    tagCount: {
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
        marginRight: pixel(2),
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
    videoCover: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
    },
});
