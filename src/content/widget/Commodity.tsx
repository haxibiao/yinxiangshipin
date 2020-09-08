import React from 'react';
import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from 'react-native';

// style, product, navigation,
export default function Commodity({ style, product, navigation }) {
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('MerchandiseDetail', { storeProduct: product })}>
            <View style={[styles.container, style]}>
                <View style={styles.bezel}>
                    <Image style={styles.iconStore} source={require('../assets/icon_store.png')} />
                    <Text style={styles.storeText}>商品上架了，去抢购~</Text>
                </View>
                <View style={styles.goodsInfo}>
                    <Image
                        style={styles.cover}
                        source={{ uri: product?.cover?.url || 'http://cos.haxibiao.com/images/5f22a1fae6c3f.jpeg' }}
                    />
                    <View style={styles.detail}>
                        <View style={styles.goodsIntro}>
                            <Text style={styles.introduction} numberOfLines={2}>
                                {`${product?.name} ${product?.description}`}
                            </Text>
                        </View>
                        <View style={styles.goodsPrice}>
                            <Text style={styles.price}>¥{product?.price}</Text>
                            <Image style={styles.iconGoods} source={require('../assets/icon_goods.png')} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: pixel(6),
        overflow: 'hidden',
    },
    bezel: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pixel(24),
        paddingHorizontal: pixel(10),
        backgroundColor: '#CCF4DF',
    },
    iconStore: {
        width: pixel(14),
        height: pixel(14),
        marginRight: pixel(4),
    },
    storeText: {
        fontSize: font(12),
        color: '#4EC67F',
    },
    goodsInfo: {
        flexDirection: 'row',
        paddingHorizontal: pixel(10),
        paddingVertical: pixel(12),
    },
    cover: {
        width: pixel(64),
        height: pixel(64),
        borderRadius: pixel(2),
    },
    detail: {
        flex: 1,
        marginLeft: pixel(10),
        justifyContent: 'space-between',
    },
    goodsIntro: {
        marginBottom: pixel(4),
    },
    introduction: {
        fontSize: font(14),
        lineHeight: font(18),
        color: '#2b2b2b',
    },
    goodsPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    price: {
        fontSize: font(12),
        lineHeight: font(16),
        color: '#FD567E',
    },
    iconGoods: {
        width: pixel(14),
        height: pixel(14),
    },
});
