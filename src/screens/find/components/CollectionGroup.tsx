import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { Iconfont } from '@src/components';
import { BoxShadow } from 'react-native-shadow';

const GROUP_WIDTH = Device.WIDTH - pixel(40);
const LOGO_WIDTH = (GROUP_WIDTH - pixel(40)) / 3;
const GROUP_HEIGHT = pixel(99) + LOGO_WIDTH;

// const shadowOpt = {
//     width: GROUP_WIDTH,
//     color: '#000000',
//     border: pixel(10),
//     radius: pixel(6),
//     opacity: 0.5,
//     x: 0,
//     y: 0,
// };
const shadowOpt = {
    width: GROUP_WIDTH,
    height: GROUP_HEIGHT,
    color: '#ddd',
    border: pixel(4),
    radius: pixel(6),
    opacity: 0.5,
    x: 0,
    y: 1,
    style: {},
};

function Collection({ collection, navigation }) {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.collectionItem}
            onPress={() => navigation.navigate('CollectionDetail', { collection })}>
            <ImageBackground style={styles.collectionLogo} source={{ uri: collection?.logo }}>
                <View style={styles.videoMark}>
                    <Iconfont name="bofang1" size={pixel(10)} color={'#fff'} style={{ opacity: 0.8 }} />
                </View>
            </ImageBackground>
            <View style={{ height: pixel(36), marginTop: pixel(6) }}>
                <Text style={styles.collectionName} numberOfLines={2}>
                    {collection?.name} {collection?.description}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default function CollectionGroup({ style = {}, groupName, collections, navigation }) {
    const [boxShadowHeight, setBoxShadowHeight] = useState(GROUP_HEIGHT);

    const onLayoutEffect = useCallback((event) => {
        setBoxShadowHeight(event.nativeEvent.layout.height);
    }, []);

    return (
        <View style={style}>
            <BoxShadow
                setting={Object.assign({}, shadowOpt, {
                    height: GROUP_HEIGHT,
                })}>
                <View style={styles.groupContainer} onLayout={onLayoutEffect}>
                    <Text style={styles.groupName}>{groupName}</Text>
                    <View style={styles.collectionsWrap}>
                        {collections?.map((collection) => (
                            <Collection key={collection?.id} collection={collection} navigation={navigation} />
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
        width: LOGO_WIDTH,
        marginHorizontal: pixel(4),
    },
    collectionLogo: {
        width: LOGO_WIDTH,
        height: LOGO_WIDTH,
        borderRadius: pixel(6),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoMark: {
        width: pixel(28),
        height: pixel(28),
        borderRadius: pixel(14),
        paddingLeft: pixel(2),
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    collectionName: {
        fontSize: font(13),
        lineHeight: font(18),
        color: '#212121',
    },
});
