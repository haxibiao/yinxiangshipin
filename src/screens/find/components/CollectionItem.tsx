import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { Iconfont, SafeText } from '@src/components';
import { moment, count } from '@src/common';

export default function CollectionItem({ collection, navigation, style }) {
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('CollectionDetail', { collection })}>
            <View style={[styles.collectionItem, style]}>
                <Image style={styles.collectionCover} source={{ uri: collection?.logo }} />
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
                        <Iconfont
                            name={'liulan2'}
                            size={pixel(15)}
                            color={'#b2b2b2'}
                            style={{ marginRight: pixel(4) }}
                        />
                        <SafeText style={styles.metaText}>
                            {count(collection?.count_views || Math.random() * 10000)}
                        </SafeText>
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
        width: pixel(90),
        height: pixel(90),
        borderRadius: pixel(4),
        backgroundColor: '#e4e4e4',
    },
    collectionInfo: {
        flex: 1,
        marginLeft: pixel(12),
        justifyContent: 'center',
    },
    collectionName: {
        fontSize: font(14),
        fontWeight: 'bold',
        lineHeight: font(20),
        color: '#212121',
    },
    collectionDescription: {
        marginVertical: pixel(7),
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
        fontSize: font(10),
        color: '#b2b2b2',
    },
});
