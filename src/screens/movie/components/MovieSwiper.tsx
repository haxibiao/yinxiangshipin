import Theme from '@app/src/common/theme';
import React, { Component, useCallback } from 'react';
import { View, Text, StyleSheet, AppRegistry, Image, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import Swiper from 'react-native-swiper';
// import index from '..';
import { useNavigation, useRoute } from '@react-navigation/native';

interface props {
    swiperDataList: Array;
}

const MovieSwiper = (props: Props) => {
    const { swiperDataList } = props;
    const imageArray = Array.isArray(swiperDataList);
    const navigation = useNavigation();
    /**
     * dot={
                <View
                    style={{
                        backgroundColor: 'rgba(0,0,0,.2)',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3,
                        position: 'absolute',
                        right: 8,
                        bottom: 0,
                    }}
                />
            }
            activeDot={
                <View
                    style={{
                        backgroundColor: '#007aff',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3,
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                    }}
                />
            }
     */

    const swiperHandle = useCallback(
        (movie_id) => {
            navigation.navigate('MovieDetail', { movie_id });
        },
        [navigation],
    );

    const SwiperItem = useCallback((item) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    swiperHandle(item.data.movie.id);
                }}>
                <View style={styles.slide1}>
                    {/* <Text style={styles.text}>Hello Swiper</Text> */}
                    <ImageBackground
                        imageStyle={{ borderRadius: pixel(5), width: Device.WIDTH - pixel(22), height: pixel(185) }}
                        style={{
                            flex: 1,
                            borderRadius: pixel(5),
                            width: Device.WIDTH - pixel(20),
                            height: pixel(185),
                            position: 'relative',
                        }}
                        resizeMode="cover"
                        source={{ uri: item.data.image_url }}>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                height: pixel(30),
                                width: pixel(Device.WIDTH - pixel(38)),
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                borderBottomLeftRadius: pixel(5),
                                borderBottomEndRadius: pixel(5),
                            }}>
                            <Text
                                style={{ flex: 1, lineHeight: pixel(30), color: '#fff', paddingHorizontal: pixel(8) }}>
                                {item.data.title}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
        );
    }, []);
    if (!swiperDataList) {
        return <View style={{ height: pixel(185), width: Device.WIDTH - pixel(20) }}></View>;
    } else {
        return (
            <Swiper
                style={styles.wrapper}
                height={pixel(185)}
                width={Device.WIDTH - pixel(20)}
                index={0}
                showsButtons={false}
                autoplay={true}
                dotStyle={[styles.dotStyle, { backgroundColor: '#fff' }]}
                activeDotStyle={styles.dotStyle}
                activeDotColor={Theme.secondaryColor}
                paginationStyle={{
                    marginBottom: pixel(-20),
                    marginRight: -pixel(Device.WIDTH - swiperDataList?.length * 30),
                }}>
                {imageArray &&
                    swiperDataList.map((item, index) => {
                        return <SwiperItem key={index} data={item} />;
                    })}
            </Swiper>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        height: pixel(185),
        borderRadius: pixel(5),
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: pixel(5),
        resizeMode: 'cover',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
        borderRadius: pixel(5),
        resizeMode: 'cover',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
        borderRadius: pixel(5),
        resizeMode: 'cover',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    dotStyle: {
        // marginRight: pixel(0),
        // position: 'absolute',
        // right: pixel(15),
        // bottom: pixel(0),
        // backgroundColor: '#fff',
        // width: 8,
        // height: 8,
        // borderRadius: 4,
        // marginLeft: 3,
        // marginRight: 3,
        // marginTop: 3,
        // marginBottom: 3,
        width: pixel(15),
        height: pixel(5),
    },
});

export default MovieSwiper;
