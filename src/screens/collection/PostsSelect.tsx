import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { observer, appStore, userStore } from '@src/store';
import { NavBarHeader } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { QueryList } from '@src/content';
import { useRoute, useNavigation } from '@react-navigation/native';
import lodashUtil from 'lodash';

function PostItem({ cover, id, pickedPosts, pickPosts }) {
    const pickedIndex = useMemo(() => {
        return lodashUtil.findIndex(pickedPosts, function (p) {
            return p.id == id;
        });
    }, [pickedPosts]);

    const onPress = useCallback(() => {
        if (pickedIndex >= 0) {
            pickPosts((posts) => {
                posts.splice(pickedIndex, 1);
                return [...posts];
            });
        } else {
            pickPosts((posts) => {
                if (posts.length >= 30) {
                    Toast.show({ content: '一次最多添加30个作品哦' });
                    return [...posts];
                }
                return [...posts, { id, cover }];
            });
        }
    }, [pickedIndex]);

    const trackImage = useMemo(() => {
        if (pickedIndex >= 0) {
            return (
                <View style={[styles.itemRadio, { backgroundColor: '#FE2E55' }]}>
                    <Text style={styles.pickedIndex}>{pickedIndex + 1}</Text>
                </View>
            );
        } else {
            return <Image source={require('@app/assets/images/icons/ic_radio_uncheck.png')} style={styles.itemRadio} />;
        }
    }, [pickedIndex]);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.itemWrap}>
                <Image style={styles.videoCover} source={{ uri: cover }} />
                {pickedIndex >= 0 && <View style={styles.shade} />}
                {trackImage}
            </View>
        </TouchableWithoutFeedback>
    );
}

export default function EditPosts() {
    const route = useRoute();
    const navigation = useNavigation();
    // 待添加的视频作品
    const videoPosts = useMemo(() => route?.params?.videoPosts, []);
    // 添加至创建合集
    const selectVideoPosts = useMemo(() => route?.params?.selectVideoPosts, []);
    // 选择视频
    const [pickedPosts, pickPosts] = useState(videoPosts);

    const renderItem = useCallback(
        ({ item }) => {
            let cover;
            if (item?.video?.id) {
                cover = item?.video?.dynamic_cover || item?.video?.cover;
            } else {
                cover = item?.images?.['0']?.url;
            }
            return <PostItem cover={cover} id={item.id} pickedPosts={pickedPosts} pickPosts={pickPosts} />;
        },
        [videoPosts, pickedPosts],
    );

    return (
        <View style={styles.container}>
            <NavBarHeader
                title={'添加视频'}
                rightComponent={
                    pickedPosts.length > 0 && (
                        <TouchableOpacity
                            style={styles.publishButton}
                            onPress={() => {
                                selectVideoPosts(pickedPosts);
                                navigation.goBack();
                            }}>
                            <Text style={styles.publishText}>选好了</Text>
                        </TouchableOpacity>
                    )
                }
            />
            <QueryList
                style={{ flex: 1 }}
                contentContainerStyle={styles.contentContainer}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapperStyle}
                gqlDocument={GQL.postsQuery}
                dataOptionChain="posts.data"
                paginateOptionChain="posts.paginatorInfo"
                options={{
                    variables: {
                        user_id: userStore.me.id,
                        count: 12,
                    },
                }}
                renderItem={renderItem}
            />
        </View>
    );
}

{
    /* <QueryList
contentContainerStyle={styles.contentContainer}
numColumns={3}
columnWrapperStyle={styles.columnWrapperStyle}
gqlDocument={GQL.searchPostQuery}
dataOptionChain="searchPosts.data"
paginateOptionChain="searchPosts.paginatorInfo"
options={{
    variables: {
        query: keyword,
        type: 'VIDEO',
        tag_id: tag_id,
        user_id: user_id,
    },
    fetchPolicy: 'network-only',
}}
renderItem={renderItem}
/> */
}

const itemBorder = pixel(2);
const itemWidth = percent(33.33) + itemBorder * 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    publishButton: {
        height: pixel(28),
        paddingHorizontal: pixel(12),
        justifyContent: 'center',
    },
    publishText: {
        color: Theme.watermelon,
        fontSize: font(15),
    },
    contentContainer: {
        paddingBottom: Theme.bottomInset,
        marginHorizontal: -itemBorder * 6,
        // marginLeft: -itemBorder * 2,
    },
    columnWrapperStyle: {
        borderWidth: itemBorder,
        borderColor: '#fff',
    },
    itemWrap: {
        width: itemWidth,
        height: itemWidth,
        borderLeftWidth: itemBorder,
        borderRightWidth: itemBorder,
        borderColor: '#fff',
    },
    videoCover: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        resizeMode: 'cover',
    },
    itemRadio: {
        position: 'absolute',
        top: pixel(4),
        right: pixel(4),
        width: pixel(18),
        height: pixel(18),
        borderRadius: pixel(9),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickedIndex: {
        fontSize: pixel(10),
        color: '#fff',
    },
    shade: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
});
