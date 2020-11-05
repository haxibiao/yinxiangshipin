import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Iconfont, Row, SafeText } from '@src/components';
import { count, moment } from '@src/common';

export default ({ item, index, navigation, onLongPress }) => {
    return (
        <TouchableOpacity
            style={styles.collectionItem}
            onPress={() => navigation.navigate('CollectionDetail', { collection: item })}
            onLongPress={onLongPress && onLongPress}>
            <View style={styles.collectionLogo}>
                <Image source={{ uri: item.logo }} style={styles.logoImg} />
            </View>
            <View style={{ flex: 1 }}>
                <Row>
                    <Image
                        source={require('@app/assets/images/icons/ic_mine_collect.png')}
                        style={styles.collectionIcon}
                    />
                    <SafeText style={{ fontSize: font(15), fontWeight: 'bold', color: '#000' }} numberOfLines={1}>
                        {item.name}
                    </SafeText>
                </Row>
                <SafeText style={styles.collectionInfo} numberOfLines={1}>
                    {item.updated_to_episode > 0 && `·更新至第${item.updated_to_episode}集`}
                </SafeText>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    collectionItem: {
        flexDirection: 'row',
        paddingHorizontal: pixel(12),
        paddingVertical: pixel(12),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
        alignItems: 'center',
    },
    collectionLogo: {
        width: pixel(70),
        height: pixel(70),
        marginRight: pixel(10),
        resizeMode: 'cover',
        borderRadius: pixel(3),
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },
    logoImg: {
        ...StyleSheet.absoluteFillObject,
        width: null,
        height: null,
    },
    collectionIcon: {
        width: pixel(14),
        height: pixel(14),
        resizeMode: 'cover',
        marginRight: pixel(3),
    },
    collectionInfo: {
        fontSize: font(13),
        marginTop: pixel(10),
        color: '#666',
    },
});
