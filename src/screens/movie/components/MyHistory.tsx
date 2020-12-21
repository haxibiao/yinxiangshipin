import Theme from '@app/src/common/theme';
import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { Iconfont } from '@src/components';
// 我的观看浏览记录
interface Props {
    historyData: any;
}
export default function MyHistory(props: Props) {
    const { historyData, navigation } = props;
    const HeadComponent = useCallback(() => {
        return (
            <View style={styles.headComponent}>
                <Text style={styles.pageTitle}>观看历史</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MoreTable')}>
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
                        }}>
                        <View style={styles.movieType}>
                            <Text style={styles.movieTypeText}>{movie.series_history[0].name}</Text>
                        </View>
                    </ImageBackground>
                    <Text style={[styles.favoriteTitle]} numberOfLines={2} ellipsizeMode="tail">
                        {movie.name}
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
                keyExtractor={(item, index) => index.toString()}
                renderItem={_renderItem}
                contentContainerStyle={{ paddingHorizontal: pixel(5) }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    favoriteModule: {
        width: Device.WIDTH,
        marginBottom: pixel(Theme.itemSpace),
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

export default MyHistory;
