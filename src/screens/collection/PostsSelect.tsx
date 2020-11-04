import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { observer, appStore, userStore } from '@src/store';
import { NavBarHeader } from '@src/components';
import { GQL, useQuery } from '@src/apollo';
import { QueryList } from '@src/content';
import { useRoute, useNavigation } from '@react-navigation/native';

function PostItem({ cover, post }) {
    const [checked, setChecked] = useState(false);
    const trackImage = checked
        ? require('@app/assets/images/icons/ic_radio_check.png')
        : require('@app/assets/images/icons/ic_radio_uncheck.png');
    return (
        <TouchableWithoutFeedback onPress={() => setChecked((c) => !c)}>
            <View style={styles.itemWrap}>
                <Image style={styles.videoCover} source={{ uri: cover }} />
                <Image source={trackImage} style={styles.itemRadio} />
            </View>
        </TouchableWithoutFeedback>
    );
}

export default function EditPosts() {
    const renderItem = useCallback(({ item }) => {
        let cover;
        if (item?.video?.id) {
            cover = item?.video?.dynamic_cover || item?.video?.cover;
        } else {
            cover = item?.images?.['0']?.url;
        }
        return <PostItem cover={cover} post={item} />;
    }, []);

    return (
        <View style={styles.container}>
            <NavBarHeader title={'添加视频'} hasSearchButton={false} onPressSearch={() => null} />
            <QueryList
                contentContainerStyle={styles.contentContainer}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapperStyle}
                gqlDocument={GQL.postsQuery}
                dataOptionChain="posts.data"
                paginateOptionChain="posts.paginatorInfo"
                options={{
                    variables: {
                        user_id: userStore.me.id,
                    },
                    fetchPolicy: 'network-only',
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
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
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
        // borderWidth: pixel(1),
        // borderRadius: pixel(13),
        // justifyContent:'center',
        // alignItems:'center'
    },
});
