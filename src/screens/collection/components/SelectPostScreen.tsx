import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeText, Iconfont, FocusAwareStatusBar } from '@src/components';
import { observer } from '@src/store';
import { GQL } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { QueryList } from '@src/content';
import CollectionPost from './CollectionPost';

export default function SelectPostScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const user_id = useMemo(() => route?.params?.user_id, []);
    // 在添加区的视频作品
    const videoData = useMemo(() => route?.params?.videoData, []);
    // 点击完成：暂时添加至创建合集作品区
    const uploadVideoResponse = useMemo(() => route?.params?.uploadVideoResponse, []);
    // 选择作品页：已暂时添加还未点击完成的视频
    const [stashVideo, setStashVideo] = useState([{ videoUrl: '', post_id: '' }]);
    const addPostPress = useCallback(
        (item) => {
            if (
                __.find(stashVideo, function (videoItem) {
                    return videoItem.post_id === item.id;
                })
            ) {
                // 避免重复添加已暂时添加的视频
                Toast.show({ content: '该作品已经添加过了' });
                item.collections.push(1);
                setStashVideo([...stashVideo]);
            } else if (
                __.find(videoData, function (videoItem) {
                    return videoItem.post_id === item.id;
                })
            ) {
                // 避免重复选择视频
                Toast.show({ content: '该作品已经添加过了' });
                item.collections.push(1);
                setStashVideo([...stashVideo]);
            } else {
                item.collections.push(1);
                setStashVideo((prevVideo) => {
                    return [...prevVideo, { videoUrl: item.video ? item.video.url : '', post_id: item.id }];
                });
            }
        },
        [stashVideo, videoData],
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
            <FocusAwareStatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Iconfont name="zuojiantou" color={'#fff'} size={pixel(21)} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        uploadVideoResponse(stashVideo);
                        navigation.goBack();
                    }}
                    style={styles.searchButton}>
                    <Text style={styles.searchButtonText}>完成</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.posContent}>
                    <CollectionPost user_id={user_id} addPostPress={addPostPress} videoData={videoData} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        height: pixel(Theme.statusBarHeight + 48),
        paddingTop: pixel(Theme.statusBarHeight + 5),
        paddingBottom: pixel(5),
        backgroundColor: '#161924',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: pixel(45),
        paddingLeft: pixel(15),
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    searchButton: {
        paddingHorizontal: pixel(15),
        alignSelf: 'stretch',
        justifyContent: 'center',
        textAlign: 'center',
    },
    searchButtonText: {
        fontSize: font(14),
        color: '#98999E',
    },
    container: {
        flex: 1,
        backgroundColor: '#161924',
    },
    posContent: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#161924',
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
});
