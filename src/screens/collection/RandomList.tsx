import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavBarHeader } from '@src/components';
import { QueryList } from '@src/content';
import { GQL, useQuery } from '@src/apollo';
import { observer, adStore } from '@src/store';
import { ad } from 'react-native-ad';
import CollectionItem from '../find/components/CollectionItem';

const PADDING = pixel(14);
const CONTENT_WIDTH = Device.WIDTH - PADDING * 2;
const LOGO_WIDTH = (CONTENT_WIDTH - pixel(60)) / 3;

// 随机合集
export default observer(() => {
    const navigation = useNavigation();

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
        paddingHorizontal: PADDING,
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT) + PADDING,
    },
    collectionWrap: {
        paddingVertical: PADDING,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#f0f0f0',
    },
});
