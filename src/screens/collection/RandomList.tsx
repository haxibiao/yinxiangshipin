import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavBarHeader } from '@src/components';
import { QueryList } from '@src/content';
import { GQL, useQuery } from '@src/apollo';
import { observer, adStore } from '@src/store';
import { ad } from 'react-native-ad';
import CollectionItem from './components/CollectionItem';

const PADDING = pixel(14);
const CONTENT_WIDTH = Device.width - PADDING * 2;
const LOGO_WIDTH = (CONTENT_WIDTH - pixel(60)) / 3;

// 随机合集
export default observer(() => {
    const navigation = useNavigation();

    const renderItem = useCallback(({ item, index }) => {
        if (adStore.enableAd && index > 0 && index % 10 === 0) {
            return (
                <>
                    <View style={{ minHeight: LOGO_WIDTH }}>
                        <ad.Feed codeid={adStore.codeid_feed_image_three} adWidth={Device.width} />
                    </View>
                    <View style={styles.separator} />
                    <CollectionItem style={styles.collectionWrap} collection={item} navigation={navigation} />
                </>
            );
        }
        return <CollectionItem collection={item} navigation={navigation} style={styles.collectionWrap} />;
    }, []);

    return (
        <View style={styles.container}>
            <NavBarHeader
                title="视频合集"
                hasGoBackButton={true}
                hasSearchButton={true}
                StatusBarProps={{ barStyle: 'dark-content' }}
            />
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
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: pixel(Device.bottomInset) + PADDING,
    },
    collectionWrap: {
        paddingVertical: PADDING,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f0f0f0',
    },
});
