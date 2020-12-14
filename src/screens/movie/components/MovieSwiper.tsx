import Theme from '@app/src/common/theme';
import React, { Component } from 'react';
import { View, Text, StyleSheet, AppRegistry } from 'react-native';
import Swiper from 'react-native-swiper';

const MovieSwiper = () => {
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

    return (
        <Swiper
            style={styles.wrapper}
            height={pixel(185)}
            width={Device.WIDTH - pixel(20)}
            index={0}
            showsButtons={false}
            autoplay={true}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.dotStyle}
            activeDotColor={Theme.secondaryColor}
            paginationStyle={{ marginBottom: pixel(-15), marginRight: -pixel(Device.WIDTH / 1.4) }}>
            <View style={styles.slide1}>
                <Text style={styles.text}>Hello Swiper</Text>
            </View>
            <View style={styles.slide2}>
                <Text style={styles.text}>Beautiful</Text>
            </View>
            <View style={styles.slide3}>
                <Text style={styles.text}>And simple</Text>
            </View>
        </Swiper>
    );
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
        backgroundColor: '#9DD6EB',
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
        // backgroundColor: 'rgba(0,0,0,.2)',
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
