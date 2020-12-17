import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { TouchFeedback } from '@src/components';
import { useNavigation } from '@react-navigation/native';

// 搜索结果
export default function MovieCard({ movieresult }) {
    const { id, name, cover, count_series } = movieresult;
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchFeedback style={styles.button} onPress={() => navigation.navigate('MovieDetail', { movie_id: id })}>
                <Image source={{ url: cover }} resizeMode="cover" style={styles.pageImage} />
                <Text style={styles.title} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.count_series}>更新第{count_series}集</Text>
            </TouchFeedback>
        </View>
    );
}
const maxWidth = Device.WIDTH - pixel(Theme.itemSpace) * 2;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: pixel(10),
    },
    pageImage: {
        width: maxWidth / 3,
        height: pixel(145),
        borderRadius: pixel(5),
        marginHorizontal: pixel(5),
        marginBottom: pixel(8),
    },
    title: {
        fontSize: font(13),
        paddingHorizontal: pixel(8),
    },
    count_series: {
        fontSize: font(12),
        paddingTop: pixel(4),
        paddingHorizontal: pixel(8),
        color: '#BBBBBB',
    },
});
