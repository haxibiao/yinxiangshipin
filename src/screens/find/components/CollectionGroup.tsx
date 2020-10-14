import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Iconfont } from '@src/components';
import { BoxShadow } from 'react-native-shadow';
import LinearGradient from 'react-native-linear-gradient';

const shadowOpt = {
    color: '#e4e4e4',
    border: pixel(2),
    radius: pixel(6),
    opacity: 0.5,
    x: 0,
    y: 1,
    style: {},
};

function Collection({ collection, navigation, logoWidth }) {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={[styles.collectionItem, { width: logoWidth }]}
            onPress={() => navigation.navigate('CollectionDetail', { collection })}>
            <ImageBackground
                style={[styles.collectionLogo, { width: logoWidth, height: logoWidth }]}
                source={{ uri: collection?.logo }}>
                <LinearGradient
                    style={styles.videoMark}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={['rgba(000,000,000,0.2)', 'rgba(000,000,000,0.1)', 'rgba(000,000,000,0)']}>
                    <Iconfont name="bofang1" size={pixel(10)} color={'#fff'} style={{ opacity: 0.8 }} />
                    <Text style={styles.countViews} numberOfLines={2}>
                        {Helper.count((Number(collection?.count_views) + Number(collection?.id)) * 100)}
                    </Text>
                </LinearGradient>
            </ImageBackground>
            <View style={{ height: pixel(36), marginTop: pixel(6) }}>
                <Text style={styles.collectionName} numberOfLines={2}>
                    {collection?.name} {collection?.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default function CollectionGroup({ style = {}, groupName, collections, navigation, groupWidth }) {
    const LOGO_WIDTH = useMemo(() => (groupWidth - pixel(40)) / 3, [groupWidth]);
    const GROUP_HEIGHT = useMemo(() => pixel(99) + LOGO_WIDTH, [LOGO_WIDTH]);

    const [boxShadowHeight, setBoxShadowHeight] = useState(GROUP_HEIGHT);

    const onLayoutEffect = useCallback((event) => {
        setBoxShadowHeight(event.nativeEvent.layout.height);
    }, []);

    return (
        <View style={style}>
            <BoxShadow
                setting={Object.assign({}, shadowOpt, {
                    width: groupWidth,
                    height: GROUP_HEIGHT,
                })}>
                <View style={styles.groupContainer} onLayout={onLayoutEffect}>
                    <Text style={styles.groupName}>{groupName}</Text>
                    <View style={styles.collectionsWrap}>
                        {collections?.map((collection) => (
                            <Collection
                                key={collection?.id}
                                collection={collection}
                                navigation={navigation}
                                logoWidth={LOGO_WIDTH}
                            />
                        ))}
                    </View>
                </View>
            </BoxShadow>
        </View>
    );
}

const styles = StyleSheet.create({
    groupContainer: {
        paddingVertical: pixel(10),
        paddingHorizontal: pixel(8),
        borderRadius: pixel(6),
        backgroundColor: '#fff',
    },
    groupName: {
        fontSize: font(16),
        lineHeight: font(20),
        marginTop: pixel(5),
        marginBottom: pixel(12),
        marginHorizontal: pixel(4),
        fontWeight: 'bold',
        color: '#212121',
    },
    collectionsWrap: {
        flexDirection: 'row',
    },
    collectionItem: {
        marginHorizontal: pixel(4),
    },
    collectionLogo: {
        borderRadius: pixel(6),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoMark: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: pixel(3),
        paddingHorizontal: pixel(5),
        paddingBottom: pixel(6),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    countViews: {
        marginLeft: pixel(4),
        fontSize: font(11),
        lineHeight: font(14),
        color: 'rgba(255,255,255,0.9)',
    },
    collectionName: {
        fontSize: font(13),
        lineHeight: font(18),
        color: '#212121',
    },
});
