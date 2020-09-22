import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeText, Iconfont } from '@src/components';
import { useNavigation } from '@react-navigation/native';

export default function SearchCollectionPostItem({ item, index, uploadVideoResponse }) {
    let { images, video, id, collections } = item;
    // const navigation = useNavigation();
    return (
        !collections?.[0] && (
            <View style={styles.rowItem}>
                <Image
                    source={{
                        uri: item.images.length > 0 ? item.images[0] : item.video && item.video.cover,
                    }}
                    style={styles.postCover}
                />
                <View style={{ flex: 1, justifyContent: 'space-around' }}>
                    <SafeText style={styles.bodyText} numberOfLines={1}>
                        {item.content || item.description}
                    </SafeText>
                    <SafeText style={styles.collectionInfo} numberOfLines={1}>
                        1.2w播放·更新至第n集
                    </SafeText>
                </View>
                <TouchableOpacity
                    style={{ padding: pixel(5), alignSelf: 'center' }}
                    onPress={() => {
                        uploadVideoResponse({ response: video, post_id: id });
                        // navigation.goBack();
                    }}>
                    <Iconfont name="iconfontadd" size={pixel(18)} color="#fff" />
                </TouchableOpacity>
            </View>
        )
    );
}

const styles = StyleSheet.create({
    rowItem: {
        flexDirection: 'row',
        padding: pixel(Theme.itemSpace),
        paddingBottom: 0,
    },
    postCover: {
        width: Device.WIDTH * 0.25,
        height: Device.WIDTH * 0.3,
        resizeMode: 'cover',
        borderRadius: pixel(3),
        marginRight: pixel(10),
    },
    bodyText: {
        fontSize: font(14),
        fontWeight: 'bold',
        color: '#fff',
    },
    collectionInfo: {
        fontSize: font(11),
        marginTop: pixel(10),
        color: '#666',
    },
});
