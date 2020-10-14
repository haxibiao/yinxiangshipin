import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { observer, userStore } from '@src/store';
import { QueryList } from '@src/content';
import CollectionGroup from './components/CollectionGroup';
import CollectionItem from './components/CollectionItem';

const PADDING = pixel(15);
const CONTENT_WIDTH = Device.WIDTH - PADDING * 2;
const LOGO_WIDTH = (CONTENT_WIDTH - pixel(40)) / 3;

function TopRecommendCollections({ navigation, data }) {
    const topRecommend = useMemo(() => data?.recommendCollections, [data]);
    const topCollection = topRecommend?.topCollection;
    const groupA = topRecommend?.recommendCollectionsA;
    const groupB = topRecommend?.recommendCollectionsB;
    if (topCollection && groupA?.length && groupB?.length) {
        return (
            <>
                <TouchableOpacity
                    style={{ marginVertical: pixel(10) }}
                    onPress={() => navigation.navigate('CollectionDetail', { collection: topCollection })}>
                    <Image style={styles.banner} source={require('@app/assets/images/bg/collection_top_bg.jpg')} />
                    <View style={styles.bannerLabel}>
                        <Text style={styles.labelText}> 编辑甄选</Text>
                    </View>
                </TouchableOpacity>
                <CollectionGroup
                    groupWidth={CONTENT_WIDTH}
                    style={styles.groupStyle}
                    groupName="合集精选站🔥"
                    collections={groupA}
                    navigation={navigation}
                />
                <CollectionGroup
                    groupWidth={CONTENT_WIDTH}
                    style={styles.groupStyle}
                    groupName="大家都在看🔥"
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
        return (
            <CollectionItem
                collection={item}
                navigation={navigation}
                style={styles.collectionWrap}
                logoWidth={LOGO_WIDTH}
            />
        );
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
        top: 0,
        left: 0,
        height: pixel(20),
        paddingLeft: pixel(4),
        paddingRight: pixel(5),
        borderBottomRightRadius: pixel(6),
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        fontSize: font(10),
        color: '#333',
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
