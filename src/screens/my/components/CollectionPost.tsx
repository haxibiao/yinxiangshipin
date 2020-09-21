import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import { FocusAwareStatusBar } from '@src/router';
import { NavBarHeader, SafeText, Iconfont } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GQL } from '@src/apollo';
import { userStore } from '@src/store';
import { QueryList } from '@src/content';

export default function CollectionPost({ user_id, uploadVideoResponse }) {
    const navigation = useNavigation();
    const route = useRoute();

    const renderItem = useCallback(({ item }) => {
        let { images, video, id } = item;
        let isSelected = false;
        console.log('isSelected', isSelected);
        return (
            <View style={styles.rowItem}>
                <Image
                    source={{ uri: item.images.length > 0 ? item.images[0] : item.video && item.video.cover }}
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
                {!isSelected && (
                    <TouchableOpacity
                        style={{ padding: pixel(5), alignSelf: 'center' }}
                        onPress={() => {
                            uploadVideoResponse({ response: video, post_id: id });
                            isSelected = true;
                            // navigation.goBack();
                        }}>
                        <Iconfont name="iconfontadd" size={pixel(18)} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
        );
    }, []);
    return (
        <View style={styles.container}>
            <QueryList
                contentContainerStyle={styles.contentContainer}
                gqlDocument={GQL.postsQuery}
                dataOptionChain="posts.data"
                paginateOptionChain="posts.paginatorInfo"
                options={{
                    variables: {
                        user_id,
                        filter: 'normal',
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161924',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
        backgroundColor: '#161924',
    },
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
