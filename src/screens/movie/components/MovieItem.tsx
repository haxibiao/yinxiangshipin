import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeText } from '@src/components';

export default function movieItem(props) {
    const { movie, boxStyle } = props;
    return (
        <TouchableOpacity style={[boxStyle]}>
            <View style={{ borderRadius: pixel(5), overflow: 'hidden' }}>
                <Image style={styles.cover} resizeMode="cover" source={{ uri: movie.cover }} />
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.gradientStyle}>
                    <View style={{ width: itemWidth }}>
                        <Text style={styles.totalEpisodes}>{movie.totalEpisodes}</Text>
                    </View>
                </LinearGradient>
            </View>
            <SafeText numberOfLines={1} style={styles.movieTitle}>
                {movie.title}
            </SafeText>
            <SafeText numberOfLines={1} style={styles.description}>
                {movie.description}
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
