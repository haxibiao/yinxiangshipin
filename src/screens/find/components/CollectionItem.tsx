import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, ImageBackground, Text, TouchableWithoutFeedback } from 'react-native';
import { Iconfont, SafeText } from '@src/components';
import { moment, count } from '@src/common';

export default function CollectionItem({ collection, navigation, style, logoWidth }) {
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('CollectionDetail', { collection })}>
            <View style={[styles.collectionItem, style]}>
                <ImageBackground
                    style={[styles.collectionCover, { width: logoWidth, height: logoWidth }]}
                    source={{ uri: collection?.logo }}>
                    {/* <View style={styles.videoMark}>
                        <Iconfont name="bofang1" size={pixel(10)} color={'#fff'} style={{ opacity: 0.8 }} />
                    </View> */}
                </ImageBackground>
                <View style={styles.collectionInfo}>
                    <View>
                        <Text style={styles.collectionName} numberOfLines={2}>
                            {collection?.name}
                        </Text>
                    </View>
                    <View style={styles.collectionDescription}>
                        <Text style={styles.description} numberOfLines={2}>
                            {collection?.description}
                        </Text>
                    </View>
                    <View style={styles.collectionMeta}>
                        <Image style={styles.userAvatar} source={{ uri: collection?.user?.avatar }} />
                        <SafeText style={[styles.metaText, { marginRight: pixel(15) }]}>
                            {collection?.user?.name}
                        </SafeText>
                        {/* <Iconfont
                            name={'liulan2'}
                            size={pixel(15)}
                            color={'#b2b2b2'}
                            style={{ marginRight: pixel(4) }}
                        />
                        <SafeText style={styles.metaText}>
                            {count(collection?.count_views || Math.random() * 10000)}
                        </SafeText> */}
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    collectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    collectionCover: {
        borderRadius: pixel(6),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#e4e4e4',
        backgroundColor: '#e4e4e4',
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
    collectionInfo: {
        flex: 1,
        marginLeft: pixel(12),
        justifyContent: 'center',
    },
    collectionName: {
        fontSize: font(14),
        lineHeight: font(20),
        color: '#212121',
        fontWeight: 'bold',
    },
    collectionDescription: {
        marginTop: pixel(10),
        marginBottom: pixel(12),
        // padding: pixel(7),
        // paddingVertical: pixel(4),
        // backgroundColor: '#f6f6f6',
        // borderRadius: pixel(5),
    },
    description: {
        fontSize: font(12),
        lineHeight: font(18),
        color: '#b2b2b2',
    },
    collectionMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: pixel(14),
        height: pixel(14),
        borderRadius: pixel(7),
        marginRight: pixel(4),
    },
    metaText: {
        fontSize: font(11),
        lineHeight: pixel(14),
        color: '#b2b2b2',
    },
});
