import Theme from '@app/src/common/theme';
import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';

interface props {
    favoriteList: Array;
}

const MyFavorite = (props: Props) => {
    const { favoriteList } = props;
    const HeadComponent = useCallback(() => {
        return (
            <View style={styles.headComponent}>
                <Text style={styles.pageTitle}>我的收藏</Text>
                {/* <Text>3</Text> */}
            </View>
        );
    }, []);
    return (
        <View style={styles.favoriteModule}>
            <HeadComponent />
            <FlatList
                horizontal={true}
                data={favoriteList}
                showsHorizontalScrollIndicator={false}
                renderItem={(item) => {
                    return (
                        <View style={{ marginHorizontal: pixel(8) }}>
                            <ImageBackground
                                source={{ uri: item.item.image }}
                                imageStyle={{ borderRadius: pixel(5) }}
                                style={{
                                    width: pixel(135),
                                    height: pixel(85),
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row',
                                }}
                                resizeMode="cover">
                                <View style={styles.movieType}>
                                    <Text style={styles.movieTypeText}>{item.item.movieType}</Text>
                                </View>
                            </ImageBackground>
                            <Text style={styles.favoriteTitle} numberOfLines={1} ellipsizeMode="tail">
                                {item.item.title}
                            </Text>
                            {item.item.favoriteSeriesTime ? (
                                <Text style={styles.favoriteSeries} numberOfLines={1} ellipsizeMode="tail">
                                    看到 {item.item.favoriteSeriesTime}
                                </Text>
                            ) : (
                                <Text
                                    style={[styles.favoriteSeries, { color: Theme.primaryColor }]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {item.item?.favoriteType}
                                </Text>
                            )}
                        </View>
                    );
                }}
            />
        </View>
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
        marginBottom: pixel(10),
        paddingHorizontal: pixel(10),
    },
    pageTitle: {
        fontSize: font(16),
        fontWeight: 'bold',
    },
    favoriteTitle: {
        paddingVertical: pixel(4),
        fontSize: font(15),
        fontWeight: 'bold',
        width: pixel(135),
    },
    favoriteSeries: {
        color: '#c8c8c8',
        width: pixel(135),
        fontSize: font(13),
    },
    movieType: {
        backgroundColor: Theme.primaryColor,
        minWidth: pixel(135 / 2.5),
        height: pixel(85 / 4),
        marginVertical: pixel(3),
        marginHorizontal: pixel(4),
        borderRadius: pixel(2),
        // padding: pixel(5),
    },
    movieTypeText: {
        // flex: 1,
        lineHeight: pixel(85 / 5),
        margin: pixel(5),
        color: '#fff',
    },
});

export default MyFavorite;
