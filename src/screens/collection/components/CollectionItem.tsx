import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Iconfont, Row, SafeText } from '@src/components';

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

const UserCollectionItem = ({ item, index, navigation, onLongPress }) => {
    return (
        <TouchableOpacity
            style={styles.rowBoxItem}
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
                    1.2w播放·更新至第{item.posts.paginatorInfo?.total || 0}集
                </SafeText>
            </View>
        </TouchableOpacity>
    );
};

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
    rowBoxItem: {
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

export { UserCollectionItem };
