import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import { observer, userStore } from '@src/store';
import { QueryList } from '@src/content';
import CollectionGroup from './components/CollectionGroup';
import CollectionItem from './components/CollectionItem';

export default observer((props: any) => {
    const navigation = useNavigation();
    const { loading, data } = useQuery(GQL.recommendCollectionsQuery);
    const topRecommend = useMemo(() => data?.recommendCollections, [data]);

    const Header = useMemo(() => {
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
                        style={styles.groupStyle}
                        groupName="合集精选站🔥"
                        collections={groupA}
                        navigation={navigation}
                    />
                    <CollectionGroup
                        style={styles.groupStyle}
                        groupName="大家都在看🔥"
                        collections={groupB}
                        navigation={navigation}
                    />
                </>
            );
        }
        return null;
    }, [topRecommend]);

    const listHeader = useCallback(() => {
        return Header;
    }, [Header]);

    const renderItem = useCallback(({ item, index }) => {
        return <CollectionItem collection={item} navigation={navigation} style={styles.collectionWrap} />;
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
            ListHeaderComponent={listHeader}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.container}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: pixel(20),
        paddingBottom: Theme.BOTTOM_HEIGHT,
        backgroundColor: '#fbfbfb',
    },
    banner: {
        width: Device.WIDTH - pixel(40),
        height: Math.floor((Device.WIDTH - pixel(40)) * 0.5),
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
