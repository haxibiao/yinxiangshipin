import Theme from '@app/src/common/theme';
import React, { useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { GQL, useQuery, useMutation } from '@src/apollo';
import { userStore } from '@src/store';
import { CustomRefreshControl, Iconfont } from '@src/components';
// 我的观看浏览记录
interface Props {
    historyData: any;
    // onEndReached: any;
    // refetch: any;
    // checkMore: Function;
    // hasMorePage: boolean;
}
export default function MyHistory(props: Props) {
    const { historyData, navigation } = props;
    const HeadComponent = useCallback(() => {
        return (
            <View style={styles.headComponent}>
                <Text style={styles.pageTitle}>观看历史</Text>
                <TouchableOpacity>
                    <View style={styles.movieHeader}>
                        <Text style={styles.checkMore}>更多</Text>
                        <Iconfont name="right" size={pixel(16)} color="#969696" />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }, []);
    const _renderItem = ({ item, index }) => {
        const movie = item.movie ?? [];
        return (
            <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movie_id: movie.id })}>
                <View style={{ marginHorizontal: pixel(5) }}>
                    <ImageBackground
                        source={{
                            uri: movie.cover,
                        }}
                        style={{
                            width: pixel(135),
                            height: pixel(85),
                            justifyContent: 'flex-end',
                            flexDirection: 'row',
                        }}
                        resizeMode="cover">
                        <View style={styles.movieType}>
                            <Text style={styles.movieTypeText}>{movie.series_history[0].name}</Text>
                        </View>
                    </ImageBackground>
                    <Text style={[styles.favoriteSeries]} numberOfLines={2} ellipsizeMode="tail">
                        {movie.introduction || movie.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.favoriteModule}>
            <HeadComponent />
            <FlatList
                horizontal={true}
                data={historyData}
                showsHorizontalScrollIndicator={false}
                // refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                keyExtractor={(item, index) => index.toString()}
                renderItem={_renderItem}
                contentContainerStyle={styles.contentContainerStyle}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    favoriteModule: {
        width: Device.WIDTH,
        marginVertical: pixel(5),
    },
    contentContainerStyle: {
        paddingHorizontal: pixel(5),
    },
    headComponent: {
        height: pixel(20),
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: pixel(5),
        paddingLeft: pixel(20),
        paddingRight: pixel(15),
    },
    pageTitle: {
        color: '#2b2b2b',
        fontSize: font(13),
        lineHeight: font(22),
    },
    favoriteTitle: {
        paddingVertical: pixel(4),
        fontSize: font(15),
        textAlign: 'center',
        width: pixel(135),
    },
    favoriteSeries: {
        color: '#000',
        width: pixel(135),
        fontSize: font(12),
        marginTop: pixel(5),
    },
    movieType: {
        backgroundColor: Theme.primaryColor,
        height: pixel(24),

        justifyContent: 'center',
        borderRadius: pixel(2),
        alignItems: 'center',
    },
    movieTypeText: {
        marginHorizontal: pixel(3),
        color: '#fff',
        fontSize: font(12),
        lineHeight: pixel(18),
    },
    checkMore: {
        color: '#2b2b2b',
        fontSize: font(12),
    },
    movieHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export default MyHistory;
