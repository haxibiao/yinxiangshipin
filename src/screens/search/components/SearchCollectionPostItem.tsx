import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeText, Iconfont, Row } from '@src/components';
import { useNavigation } from '@react-navigation/native';

export default function SearchCollectionPostItem({ item, index, collection_id, uploadVideoResponse }) {
    let { images, video, id, collections } = item;
    // const navigation = useNavigation();
    return (
        (collection_id || !collections?.[0]) && (
            <View style={styles.rowItem}>
                <Image
                    source={{
                        uri: item.images.length > 0 ? item.images[0] : item.video && item.video.cover,
                    }}
                    style={styles.postCover}
                />
                <View style={{ flex: 1, overflow: 'hidden', justifyContent: 'space-around' }}>
                    <SafeText style={styles.contentText} numberOfLines={2}>
                        {`第${index + 1}集￨${item?.content || item?.description}`}
                    </SafeText>
                    <Row>
                        <SafeText style={[styles.metaText, { marginRight: pixel(15) }]}>
                            {Helper.moment(item?.video?.duration)}
                        </SafeText>
                        <Iconfont
                            name={item.liked ? 'xihuanfill' : 'xihuan'}
                            size={pixel(15)}
                            color={item.liked ? Theme.primaryColor : '#fff'}
                        />
                        <Text style={[styles.metaText, { marginLeft: pixel(3) }]} numberOfLines={1}>
                            {item.count_likes}
                        </Text>
                    </Row>
                </View>
                {uploadVideoResponse && (
                    <TouchableOpacity
                        style={{ padding: pixel(5), alignSelf: 'center' }}
                        onPress={() => {
                            uploadVideoResponse({ response: video, post_id: id });
                            // navigation.goBack();
                        }}>
                        <Iconfont name="iconfontadd" size={pixel(18)} color="#fff" />
                    </TouchableOpacity>
                )}
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
    contentText: {
        fontSize: font(15),
        color: '#fff',
    },
    metaText: {
        fontSize: font(13),
        color: '#fff',
    },
});
