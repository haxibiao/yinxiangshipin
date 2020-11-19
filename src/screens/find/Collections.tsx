import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { observer, userStore, adStore } from '@src/store';
import { QueryList } from '@src/content';
import CollectionGroup from './components/CollectionGroup';
import CollectionItem from './components/CollectionItem';
import { ad } from 'react-native-ad';

const PADDING = pixel(15);
const CONTENT_WIDTH = Device.WIDTH - PADDING * 2;
const LOGO_WIDTH = (CONTENT_WIDTH - pixel(60)) / 3;

function TopRecommendCollections({ navigation, data }) {
    const topRecommend = useMemo(() => data?.recommendCollections, [data]);
    const topCover = useMemo(
        () =>
            topRecommend?.topCover
                ? { uri: topRecommend?.topCover }
                : require('@app/assets/images/bg/collection_top_bg.jpg'),
        [topRecommend],
    );
    const topCollection = topRecommend?.topCollection;
    const groupA = topRecommend?.recommendCollectionsA;
    const groupB = topRecommend?.recommendCollectionsB;
    if (topCollection && groupA?.length && groupB?.length) {
        return (
            <>
                <TouchableOpacity
                    style={{ marginVertical: pixel(10) }}
                    onPress={() => navigation.navigate('CollectionDetail', { collection: topCollection })}>
                    <Image style={styles.banner} source={topCover} />
                    <View style={styles.bannerLabel}>
                        <Text style={styles.labelText}>精选合集</Text>
                        <Text
                            style={[styles.labelText, { fontSize: pixel(14), lineHeight: pixel(18) }]}
                            numberOfLines={2}>
                            {topCollection?.description || topCollection?.name}
                        </Text>
                    </View>
                </TouchableOpacity>
                <CollectionGroup
                    groupWidth={CONTENT_WIDTH}
                    style={styles.groupStyle}
                    groupName="热门推荐🔥"
                    collections={groupA}
                    navigation={navigation}
                />
                <CollectionGroup
                    groupWidth={CONTENT_WIDTH}
                    style={styles.groupStyle}
                    groupName="值得看见✨"
                    collections={groupB}
                    navigation={navigation}
                />
            </>
        );
    }
    return null;
}

export default observer((props: any) => {
    const navigation = useNavigation();
    const { data } = useQuery(GQL.recommendCollectionsQuery);

    const renderItem = useCallback(({ item, index }) => {
        if (index !== 0 && index % 10 == 0) {
            return (
                <View>
                    {adStore.enableAd ? (
                        <View>
                            <View
                                style={[
                                    {
                                        width: Device.WIDTH - pixel(30),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        // backgroundColor: 'skyblue',
                                        marginLeft: -pixel(18),
                                    },
                                    Platform.select({
                                        ios: {
                                            maxHeight: LOGO_WIDTH,
                                            marginTop: pixel(70),
                                            marginBottom: pixel(-40),
                                            marginLeft: -pixel(16),
                                        },
                                    }),
                                ]}>
                                <ad.Feed
                                    codeid={adStore.codeid_feed_imgLeft}
                                    adWidth={Device.WIDTH - pixel(30)}
                                    onLoad={(smg) => {
                                        // 广告加载成功回调
                                        console.log('头条 Feed 广告加载成功！', smg);
                                    }}
                                    onError={(err) => {
                                        // 广告加载失败回调
                                        console.log('头条 Feed 广告加载失败！', err);
                                    }}
                                    onClick={(val) => {
                                        // 广告点击回调
                                        console.log('头条 Feed 广告被用户点击！', val);
                                    }}
                                />
                            </View>
                            <View style={[styles.separator, { marginTop: pixel(4) }]} />
                        </View>
                    ) : (
                        <View />
                    )}
                    <CollectionItem
                        collection={item}
                        navigation={navigation}
                        style={styles.collectionWrap}
                        logoWidth={LOGO_WIDTH}
                    />
                </View>
            );
        } else {
            return (
                <CollectionItem
                    collection={item}
                    navigation={navigation}
                    style={styles.collectionWrap}
                    logoWidth={LOGO_WIDTH}
                />
            );
        }
    }, []);

    return (
        <QueryList
            gqlDocument={GQL.randomCollectionsQuery}
            dataOptionChain="randomCollections.data"
            paginateOptionChain="randomCollections.paginatorInfo"
            options={{
                variables: {
                    page: 1,
                    count: 10,
                },
                fetchPolicy: 'network-only',
            }}
            ListHeaderComponent={() => <TopRecommendCollections navigation={navigation} data={data} />}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.container}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: PADDING,
        paddingBottom: Theme.BOTTOM_HEIGHT,
        backgroundColor: '#ffffff',
    },
    banner: {
        width: CONTENT_WIDTH,
        height: Math.floor(CONTENT_WIDTH * 0.5),
        borderRadius: pixel(6),
    },
    bannerLabel: {
        position: 'absolute',
        top: pixel(15),
        left: pixel(15),
        right: CONTENT_WIDTH / 2,
        bottom: pixel(30),
        // height: pixel(20),
        // paddingLeft: pixel(4),
        // paddingRight: pixel(5),
        // borderBottomRightRadius: pixel(6),
        // backgroundColor: 'rgba(255,255,255,0.8)',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    labelText: {
        fontSize: font(19),
        lineHeight: font(25),
        marginBottom: pixel(8),
        color: 'rgba(255,255,255,0.9)',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
    },
    groupStyle: {
        marginVertical: pixel(10),
    },
    collectionWrap: {
        paddingVertical: pixel(18),
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f0f0f0',
    },
});
