import Theme from '@app/src/common/theme';
import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { GQL, useQuery, useMutation } from '@src/apollo';
import { userStore } from '@src/store';
import { CustomRefreshControl, Iconfont } from '@src/components';

interface props {
    favoriteList: Array;
    favoriteToMovie: Function;
    // onEndReached: any;
    refetch: any;
    hasMorePage: boolean;
}
const MyFavorite = (props: Props) => {
    const { favoriteList, favoriteToMovie, refetch, checkMore, hasMorePage, navigation } = props;
    const favoriteArray = Array.isArray(favoriteList);
    const HeadComponent = useCallback(() => {
        return (
            <View style={styles.headComponent}>
                <Text style={styles.pageTitle}>我的追剧</Text>
                {/* {favoriteList.length >= 10 && hasMorePage && ( */}
                <TouchableOpacity onPress={() => navigation.navigate('MoreTable', { follower: true })}>
                    <View style={styles.movieHeader}>
                        <Text style={styles.checkMore}>更多</Text>
                        <Iconfont name="right" size={pixel(16)} color="#969696" />
                    </View>
                </TouchableOpacity>
                {/* )} */}
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
                    contentContainerStyle={{ paddingHorizontal: pixel(5) }}
                    refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item) => {
                        return (
                            <TouchableOpacity onPress={() => favoriteToMovie(item.item.movie.id)}>
                                <View style={{ marginHorizontal: pixel(5) }}>
                                    <ImageBackground
                                        source={{ uri: item.item.movie.cover }}
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
    },
    headComponent: {
        height: pixel(20),
        justifyContent: 'space-between',
        flexDirection: 'row',
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

        height: pixel(22),

        borderRadius: pixel(2),
        paddingHorizontal: pixel(3),
    },
    movieTypeText: {
        fontSize: font(12),
        lineHeight: pixel(22),
        color: '#fff',
    },
    checkMore: {
        color: '#c8c8c8',
        fontSize: font(12),
    },
    movieHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export default MyFavorite;
