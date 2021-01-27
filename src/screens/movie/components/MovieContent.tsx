import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, Pressable, ScrollView, Platform } from 'react-native';
import { observer, notificationStore, userStore } from '@src/store';
import { PlayerStore } from '@src/components/MoviePlayer';
import { DebouncedPressable, Iconfont } from '@src/components';
import AnthologyButton from './AnthologyButton';

export const SPACE = pixel(20);
const POSTER_WIDTH = (Device.width - SPACE) / 3;
const POSTER_HEIGHT = POSTER_WIDTH * 1.28;
const EPISODE_WIDTH_SPACE = pixel(6);
const EPISODE_WIDTH = (Device.width - SPACE * 2 - EPISODE_WIDTH_SPACE * 5 - 1) / 6;

export const MovieIntroduction = observer(({ movie, style }) => {
    const avatarId = useRef(String(movie.id)[movie.id?.length - 1]).current;

    return (
        <View style={[{ flex: 1 }, style]}>
            <ScrollView style={[styles.modalBody, style]}>
                <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: movie?.cover }} style={styles.movieCover} />
                    <View style={styles.intro}>
                        <Text style={styles.infoName}>{movie?.name}</Text>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaText}>
                                {movie?.region && `${movie.region} · `}
                                {movie?.year && `${movie.year} · `}
                                {movie?.count_series && `更新至第${movie?.count_series}集`}
                            </Text>
                        </View>

                        {!!movie?.producer && (
                            <View style={styles.metaItem}>
                                <Text style={styles.metaText} numberOfLines={1}>
                                    导演：{movie?.producer}
                                </Text>
                            </View>
                        )}
                        {!!movie?.actors && (
                            <View style={styles.metaItem}>
                                <Text style={styles.metaText} numberOfLines={2}>
                                    演员：{movie?.actors}
                                </Text>
                            </View>
                        )}
                        {!!movie?.count_favorites > 0 && (
                            <View style={styles.metaItem}>
                                <Text style={styles.metaText}>{movie?.count_favorites}人收藏</Text>
                            </View>
                        )}
                    </View>
                </View>
                {!!movie?.introduction && (
                    <View style={{ marginTop: pixel(20) }}>
                        <Text style={styles.infoName}>概要</Text>
                        <Text style={styles.description}>{movie?.introduction}</Text>
                    </View>
                )}
                <View style={styles.uploaderWrap}>
                    <Text style={styles.metaText}>UP主：</Text>
                    <View style={styles.uploader}>
                        <Image
                            style={styles.avatar}
                            source={{
                                uri: `https://yinxiangshipin-1254284941.cos.ap-guangzhou.myqcloud.com/storage/avatar/avatar-${avatarId}.jpg`,
                            }}
                        />
                        <Text style={styles.metaText}>匿名用户</Text>
                    </View>
                </View>
                <View style={styles.operations}>
                    <Pressable
                        style={styles.operateBtn}
                        onPress={() => notificationStore.sendReportNotice({ target: movie, type: 'movies' })}>
                        <Text style={styles.operationName}>举报该视频</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
});

export const MovieSeriesChooser = observer(({ seriesData, style }) => {
    return (
        <View style={[{ flex: 1 }, style]}>
            <ScrollView
                contentContainerStyle={[styles.modalBody, { paddingRight: SPACE - EPISODE_WIDTH_SPACE }]}
                showsVerticalScrollIndicator={false}>
                <View style={styles.episodes}>
                    {seriesData.map((item, index) => {
                        return (
                            <AnthologyButton
                                key={(item, index) => String(item.name + index)}
                                style={{
                                    marginBottom: pixel(12),
                                    minWidth: EPISODE_WIDTH,
                                    width: EPISODE_WIDTH,
                                    height: EPISODE_WIDTH,
                                    marginRight: EPISODE_WIDTH_SPACE,
                                }}
                                active={PlayerStore.currentEpisodeIndex === index}
                                content={index + 1}
                                onPress={() => {
                                    PlayerStore.setCurrentEpisode(item, index);
                                    setVisible(false);
                                }}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    modalBody: {
        flexGrow: 1,
        padding: SPACE,
        paddingBottom: SPACE + pixel(Device.bottomInset),
    },
    movieCover: {
        position: 'relative',
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        borderRadius: pixel(8),
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.24,
                shadowRadius: pixel(8),
                shadowOffset: {
                    width: 0,
                    height: pixel(3),
                },
            },
            android: {
                elevation: 6,
            },
        }),
    },
    intro: {
        flex: 1,
        paddingLeft: pixel(10),
        overflow: 'hidden',
    },
    infoName: {
        fontSize: font(16),
        color: '#202020',
        fontWeight: 'bold',
        marginBottom: pixel(10),
    },
    metaItem: {
        flexDirection: 'row',
        marginBottom: pixel(5),
    },
    metaText: {
        fontSize: font(13),
        lineHeight: pixel(20),
        color: '#AEBCC4',
    },
    description: {
        fontSize: font(14),
        lineHeight: pixel(20),
        color: '#AEBCC4',
        marginBottom: pixel(5),
    },
    uploaderWrap: {
        flexDirection: 'row',
        marginVertical: pixel(5),
    },
    uploader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: pixel(20),
        height: pixel(20),
        borderRadius: pixel(10),
        marginRight: pixel(6),
    },
    operations: {
        flexDirection: 'row',
    },
    operateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: pixel(5),
    },
    operationName: {
        fontSize: font(14),
        lineHeight: pixel(20),
        color: '#AEBCC4',
    },
    episodes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
