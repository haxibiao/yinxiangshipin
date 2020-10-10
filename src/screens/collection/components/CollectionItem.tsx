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
            <Image source={{ uri: item.logo }} style={styles.logoImg} />
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
                    {`${count(item.count_views || 0)}播放`}
                    {item.updated_to_episode > 0 && `·更新至第${item.updated_to_episode}集`}
                </SafeText>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    collectionItem: {
        flexDirection: 'row',
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingVertical: pixel(Theme.itemSpace),
        borderBottomWidth: pixel(0.5),
        borderColor: '#666',
        alignItems: 'center',
    },
    logoImg: {
        width: pixel(70),
        height: pixel(70),
        marginRight: pixel(Theme.itemSpace),
        resizeMode: 'cover',
        borderRadius: pixel(3),
        backgroundColor: '#000',
    },
    collectionIcon: {
        width: pixel(12),
        height: pixel(12),
        resizeMode: 'cover',
        marginRight: pixel(3),
    },
    collectionInfo: {
        fontSize: font(13),
        marginTop: pixel(10),
        color: '#666',
    },
});
