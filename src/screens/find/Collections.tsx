import React, { useCallback, useMemo } from 'react';
import { StyleSheet, ScrollView, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { observer, adStore } from '@src/store';
import CollectionBanner, { PADDING } from './parts/CollectionBanner';
import CollectionList from './parts/CollectionList';
import RecommendCollections from './parts/RecommendCollections';
import { ad } from 'react-native-ad';

const fakeData = new Array(3).fill({});

export default function Collections() {
    const navigation = useNavigation();
    const { data } = useQuery(GQL.recommendCollectionsQuery);
    const topRecommend = useMemo(() => data?.recommendCollections, [data]);
    const topCover = useMemo(
        () =>
            topRecommend?.topCover
                ? { uri: topRecommend?.topCover }
                : require('@app/assets/images/bg/collection_top_bg.jpg'),
        [topRecommend],
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <CollectionBanner collection={topRecommend?.topCollection} banner={topCover} />
            <CollectionList />
            <RecommendCollections
                style={styles.secWrap}
                sectionName="专属剧场"
                collections={topRecommend?.recommendCollectionsA || fakeData}
            />
            <RecommendCollections
                style={styles.secWrap}
                sectionName="精选好片"
                collections={topRecommend?.recommendCollectionsB || fakeData}
            />
            <View>
                <ad.Feed visible={adStore.enableAd} codeid={adStore.codeid_feed_video} adWidth={Device.WIDTH} />
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerContent}>╰(๑•́₃ •̀๑)╯再往下就没有啦</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: PADDING,
        paddingBottom: Theme.tabBarHeight + PADDING,
        backgroundColor: '#ffffff',
    },
    secWrap: {
        marginTop: PADDING,
    },
    footer: {
        marginTop: pixel(-2),
        paddingVertical: pixel(14),
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    footerContent: {
        fontSize: font(12),
        color: '#909090',
    },
});
