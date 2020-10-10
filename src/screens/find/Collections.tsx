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
                    </TouchableOpacity>
                    <CollectionGroup
                        style={styles.group}
                        groupName="精选大放送"
                        collections={groupA}
                        navigation={navigation}
                    />
                    <CollectionGroup
                        style={styles.group}
                        groupName="大家都在看"
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
    group: {
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
