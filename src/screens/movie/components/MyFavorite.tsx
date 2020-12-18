import Theme from '@app/src/common/theme';
import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { GQL, useQuery, useMutation } from '@src/apollo';
import { userStore } from '@src/store';
import { CustomRefreshControl } from '@src/components';

interface props {
    favoriteList: Array;
    favoriteToMovie: Function;
    // onEndReached: any;
    refetch: any;
    checkMore: Function;
    hasMorePage: boolean;
}

const MyFavorite = (props: Props) => {
    const { favoriteList, favoriteToMovie, refetch, checkMore, hasMorePage } = props;
    const favoriteArray = Array.isArray(favoriteList);

    const HeadComponent = useCallback(() => {
        return (
            <View style={styles.headComponent}>
                <Text style={styles.pageTitle}>我的收藏</Text>
                {favoriteList.length >= 10 && hasMorePage && (
                    <TouchableOpacity onPress={() => checkMore()}>
                        <Text style={styles.checkMore}>查看更多</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }, [favoriteList, hasMorePage]);
    return (
        userStore.login &&
        favoriteArray &&
        favoriteList.length > 0 && (
            <View style={styles.favoriteModule}>
                <HeadComponent />
                <FlatList
                    horizontal={true}
                    data={favoriteList}
                    showsHorizontalScrollIndicator={false}
                    // keyExtractor={(index) => {
                    //     item.item.id.toString() || index.toString();
                    // }}
                    // onEndReached={onEndReached}
                    // onEndReachedThreshold={0.1}
                    contentContainerStyle={{ paddingHorizontal: pixel(5) }}
                    refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item) => {
                        return (
                            <TouchableOpacity onPress={() => favoriteToMovie(item.item.movie.id)}>
                                <View style={{ marginHorizontal: pixel(5) }}>
                                    <ImageBackground
                                        source={{ uri: item.item.movie.cover }}
                                        imageStyle={{ borderRadius: pixel(5) }}
                                        style={{
                                            width: pixel(135),
                                            height: pixel(85),
                                            justifyContent: 'flex-end',
                                            flexDirection: 'row',
                                        }}
                                        resizeMode="cover">
                                        <View style={styles.movieType}>
                                            <Text style={styles.movieTypeText}>{item.item.movie.data[0].name}</Text>
                                        </View>
                                    </ImageBackground>
                                    <Text style={styles.favoriteTitle} numberOfLines={1} ellipsizeMode="tail">
                                        {item.item.movie.name}
                                    </Text>
                                    {item.item.favoriteSeriesTime ? (
                                        <Text
                                            style={[styles.favoriteSeries, { color: Theme.primaryColor }]}
                                            numberOfLines={1}
                                            ellipsizeMode="tail">
                                            看到 {item.item.favoriteSeriesTime}
                                        </Text>
                                    ) : (
                                        <Text style={[styles.favoriteSeries]} numberOfLines={1} ellipsizeMode="tail">
                                            {/* {item.item?.movie.introduction} */}
                                            尚未观看
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        )
    );
};

const styles = StyleSheet.create({
    favoriteModule: {
        width: Device.WIDTH,
        height: pixel(165),
        // backgroundColor: 'skyblue',
        marginBottom: pixel(18),
        // border
    },
    headComponent: {
        height: pixel(20),
        justifyContent: 'space-between',
        flexDirection: 'row',
        // lineHeight: pixel(18),
        // marginVertical: pixel(6),
        marginBottom: pixel(5),
        paddingHorizontal: pixel(10),
    },
    pageTitle: {
        fontSize: font(16),
        fontWeight: 'bold',
    },
    favoriteTitle: {
        paddingVertical: pixel(4),
        fontSize: font(14),
        fontWeight: 'bold',
        width: pixel(135),
    },
    favoriteSeries: {
        color: '#c8c8c8',
        width: pixel(135),
        fontSize: font(12),
    },
    movieType: {
        backgroundColor: Theme.primaryColor,
        // minWidth: pixel(135 / 2.5),
        height: pixel(22),
        // justifyContent: 'center',
        // marginVertical: pixel(3),
        // marginHorizontal: pixel(4),
        borderRadius: pixel(2),
        paddingHorizontal: pixel(3),
    },
    movieTypeText: {
        // flex: 1,
        fontSize: font(12),
        lineHeight: pixel(22),
        // margin: pixel(5),
        color: '#fff',
    },
    checkMore: {
        color: '#c8c8c8',
    },
});

export default MyFavorite;
