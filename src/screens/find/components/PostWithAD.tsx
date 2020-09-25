import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { SafeText } from '@src/components';
import { PostItem } from '@src/content';
import { adStore } from '@src/store';
import { ad } from 'react-native-ad';

export default function PostWithAD({ item, index, adClick }) {
    const [visible, setVisible] = useState(true);

    const adContent = useMemo(() => {
        // item?.is_ad && adStore.enableAd
        // index > 0 && index % 5 === 0
        if (adStore.enableAd && visible && (index + 1) % 5 === 0) {
            const avatarId = Math.round(Math.random() * 10);
            return (
                <>
                    <View style={styles.itemContainer}>
                        <View style={styles.header}>
                            <View style={styles.creator}>
                                <Image
                                    style={styles.avatar}
                                    source={{
                                        uri: `https://yinxiangshipin-1254284941.cos.ap-guangzhou.myqcloud.com/storage/avatar/avatar-${avatarId}.jpg`,
                                    }}
                                />
                                <View style={styles.userInfo}>
                                    <Text style={styles.nameText}>匿名用户</Text>
                                    <SafeText style={styles.timeAgoText} numberOfLines={1}>
                                        {`${avatarId}分钟前`}
                                    </SafeText>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginHorizontal: -pixel(14), minHeight: pixel(100) }}>
                            <ad.Feed
                                codeid={adStore.codeid_feed}
                                adWidth={Device.WIDTH}
                                onAdClick={() => adClick(index)}
                                onAdError={(err) => {
                                    // console.log('setVisible(false)', err);
                                    setVisible(false);
                                }}
                                onAdClose={() => {
                                    setVisible(false);
                                }}
                            />
                        </View>
                        <View style={styles.footer}>
                            <View style={styles.metaList}>
                                <View style={styles.metaItem}>
                                    <Image
                                        style={{ width: pixel(22), height: pixel(22) }}
                                        source={require('@app/assets/images/icons/ic_heart_normal.png')}
                                    />
                                    <Text style={styles.countText}>{Math.round(Math.random() * 100)}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Image
                                        style={{ width: pixel(22), height: pixel(22) }}
                                        source={require('@app/assets/images/icons/ic_comment_normal.png')}
                                    />
                                    <Text style={styles.countText}>{Math.round(Math.random() * 100)}</Text>
                                </View>
                            </View>
                            <View>
                                <Image
                                    style={{ width: pixel(22), height: pixel(22) }}
                                    source={require('@app/assets/images/icons/ic_share_normal.png')}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.separator} />
                </>
            );
        }
        return null;
    }, [adStore.enableAd, visible]);

    return (
        <>
            {adContent}
            <PostItem data={item} />
        </>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        marginVertical: pixel(14),
        paddingHorizontal: pixel(14),
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    creator: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(14),
    },
    avatar: {
        width: pixel(38),
        height: pixel(38),
        borderRadius: pixel(19),
        backgroundColor: '#f0f0f0',
    },
    userInfo: {
        justifyContent: 'space-between',
        marginLeft: pixel(14),
    },
    timeAgoText: { fontSize: font(12), color: '#ECEAF3', fontWeight: '300', marginTop: pixel(5) },
    nameText: { fontSize: font(14), color: '#2b2b2b' },
    footer: {
        marginTop: pixel(13),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaList: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(30),
    },
    countText: {
        color: '#2b2b2b',
        fontSize: font(14),
        marginLeft: pixel(8),
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
