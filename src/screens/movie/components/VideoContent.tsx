import React, { useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Iconfont } from '@src/components';
import MovieItem from './MovieItem';

export default function VideoContent({ movie }) {
    const episodeItem = useCallback((item, index) => {
        return (
            <View style={[styles.episodeBox, item === movie.latestEpisode && { borderColor: '#92CAEE' }]}>
                <Text style={styles.episodeText}>{item}</Text>
            </View>
        );
    }, []);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.areaStyle}>
                <Text style={styles.title}>迷雾追踪</Text>
                <Text numberOfLines={1} style={styles.description}>
                    <Text style={{ color: '#F3583F' }}>🔥4564</Text>
                    ·更新至第{movie.latestEpisode}集&nbsp;共{movie.totalEpisodes}集·简介
                    <Iconfont name="zuojiantou" color={'#BBBBBB'} size={pixel(12)} />
                </Text>
                <View style={[styles.header, { marginTop: pixel(10) }]}>
                    <View style={styles.row}>
                        <Image source={require('@app/assets/images/ic_comment.png')} style={styles.operationIcon} />
                        <Text style={styles.description}>{movie.count_comments}人参与讨论</Text>
                    </View>
                    <Image source={require('@app/assets/images/ic_collect.png')} style={styles.operationIcon} />
                </View>
            </TouchableOpacity>
            {/* 选集 */}
            <View style={{ marginBottom: pixel(20) }}>
                <TouchableOpacity style={[styles.header, { marginBottom: pixel(10) }]}>
                    <Text style={styles.episodeTitle}>选集</Text>
                    <View style={styles.right}>
                        <Text numberOfLines={1} style={styles.description}>
                            {movie.updateTime}
                        </Text>
                        <Iconfont name="zuojiantou" color={'#BBBBBB'} size={pixel(12)} />
                    </View>
                </TouchableOpacity>
                <FlatList
                    contentContainerStyle={styles.episodesContentStyle}
                    data={Array.from({ length: movie.totalEpisodes }, (v, k) => k + 1)}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => episodeItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            {/* 推荐 */}
            <View style={styles.areaStyle}>
                <Text style={styles.title}>为你推荐</Text>
                <FlatList
                    numColumns={3}
                    data={recommendData}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => <MovieItem movie={item} boxStyle={styles.boxStyle} />}
                    keyExtractor={(item, index) => item.id.toString()}
                />
            </View>
        </ScrollView>
    );
}

const itemWidth = (Device.WIDTH - pixel(Theme.itemSpace) * 2 - pixel(20)) / 3;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: pixel(15),
    },
    title: {
        fontSize: font(16),
        fontWeight: 'bold',
        marginBottom: pixel(10),
    },
    areaStyle: {
        marginBottom: pixel(20),
        paddingLeft: pixel(Theme.itemSpace),
    },
    description: {
        fontSize: font(12),
        lineHeight: pixel(17),
        color: '#BBBBBB',
    },
    operationIcon: {
        width: pixel(25),
        height: pixel(25),
        resizeMode: 'contain',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: pixel(Theme.itemSpace),
    },
    episodeTitle: {
        fontSize: font(16),
        fontWeight: 'bold',
        paddingLeft: pixel(Theme.itemSpace),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    right: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: pixel(10),
        justifyContent: 'flex-end',
    },
    episodeBox: {
        minWidth: pixel(50),
        height: pixel(50),
        paddingHorizontal: pixel(16),
        borderWidth: 1,
        borderColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: pixel(5),
        marginRight: pixel(5),
    },
    episodeText: {
        fontSize: font(14),
        lineHeight: pixel(18),
    },
    episodesContentStyle: {
        paddingRight: pixel(9),
        paddingLeft: pixel(Theme.itemSpace),
    },
    boxStyle: {
        width: itemWidth,
        marginRight: pixel(10),
        marginBottom: pixel(10),
    },
});

const recommendData = [
    {
        id: 0,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 1,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 2,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 3,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 4,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
    {
        id: 5,
        cover:
            'https://r1.ykimg.com/058400005FD7031114187C084F409233?x-oss-process=image/resize' +
            ',w_290/interlace,1/quality,Q_80/sharpen,100',
        title: '同一屋檐下 第一季',
        description: '李诞和他的朋友们快问快答大拷问',
        totalEpisodes: '20集全',
    },
];
