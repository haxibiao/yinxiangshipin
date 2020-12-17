import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeText } from '@src/components';
import { useNavigation } from '@react-navigation/native';

export default function movieItem({ movie, boxStyle }) {
    const navigation = useNavigation();
    const { name, cover, introduction, count_series } = movie;
    return (
        <TouchableOpacity style={boxStyle} onPress={() => navigation.navigate('MovieDetail', { movie_id: movie.id })}>
            <View style={{ borderRadius: pixel(5), overflow: 'hidden' }}>
                <Image style={styles.cover} resizeMode="cover" source={{ uri: cover }} />
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.gradientStyle}>
                    <View style={{ width: itemWidth }}>
                        <Text style={styles.totalEpisodes}>更新至第{count_series}集</Text>
                    </View>
                </LinearGradient>
            </View>
            <SafeText numberOfLines={1} style={styles.movieTitle}>
                {name}
            </SafeText>
            <SafeText numberOfLines={1} style={styles.description}>
                {introduction}
            </SafeText>
        </TouchableOpacity>
    );
}

const itemWidth = (Device.WIDTH - pixel(Theme.itemSpace) * 2 - pixel(20)) / 3;

const styles = StyleSheet.create({
    cover: {
        width: itemWidth,
        height: itemWidth * 1.3,
    },
    gradientStyle: {
        position: 'absolute',
        bottom: 0,
        paddingVertical: pixel(3),
    },
    totalEpisodes: {
        fontSize: font(10),
        color: '#FFFFFF',
        alignSelf: 'flex-end',
        marginRight: pixel(5),
    },
    movieTitle: {
        marginVertical: pixel(3),
        fontSize: font(12),
    },
    description: {
        fontSize: font(10),
        color: '#F3583F',
    },
});
