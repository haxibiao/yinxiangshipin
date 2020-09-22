import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { Iconfont } from '@src/components';

export default function CollectionItem({ collection, navigation }) {
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('CollectionDetail', { collection })}>
            <View style={styles.collectionItem}>
                <Image
                    style={styles.collectionCover}
                    source={{ uri: collection?.cover?.url || 'http://cos.haxibiao.com/images/5f22a1fae6c3f.jpeg' }}
                />
                <View style={styles.collectionDetail}>
                    <View style={styles.goodsIntro}>
                        <Text style={styles.introduction} numberOfLines={2}>
                            {`${collection?.name} ${collection?.description}`}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    collectionItem: {
        flexDirection: 'row',
        paddingVertical: pixel(12),
        paddingHorizontal: pixel(15),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    collectionCover: {
        width: pixel(90),
        height: pixel(90),
        borderRadius: pixel(2),
    },
    collectionDetail: {
        flex: 1,
        marginLeft: pixel(12),
        justifyContent: 'space-between',
    },
    goodsIntro: {
        marginBottom: pixel(4),
    },
    introduction: {
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
    },
});
