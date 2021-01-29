import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, Text, ImageBackground, TouchableOpacity, ViewStyle } from 'react-native';
import { Iconfont, Row, SafeText } from '@src/components';
import { count, moment } from '@src/common';

interface Props {
    style?: ViewStyle;
    collection: any;
    navigation: any;
    logoWidth?: number;
    onLongPress?: (c: any) => void;
}

export default ({ style, collection, navigation, logoWidth = pixel(80), onLongPress }: Props) => {
    return (
        <TouchableOpacity
            style={[styles.collectionItem, style]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Collection', { collection })}
            onLongPress={() => {
                if (onLongPress instanceof Function) {
                    onLongPress(collection);
                }
            }}>
            <ImageBackground
                style={[styles.cover, { width: logoWidth, height: logoWidth }]}
                source={{ uri: collection?.logo }}>
                <ImageBackground
                    style={styles.picLabel}
                    source={require('@app/assets/images/movie/ic_movie_tag_pink.png')}>
                    <Text style={styles.picLabelText} numberOfLines={1}>
                        合集
                    </Text>
                </ImageBackground>
            </ImageBackground>
            <View style={styles.content}>
                <View style={{ marginBottom: pixel(10) }}>
                    <SafeText style={styles.name} numberOfLines={1}>
                        {collection?.name}
                    </SafeText>
                    <SafeText style={styles.description} numberOfLines={1}>
                        {collection?.description}
                    </SafeText>
                </View>
                <SafeText style={styles.mateText} numberOfLines={1}>
                    {`${count(Number(collection?.count_views) + Number(collection?.id))}次播放`}
                    {collection?.updated_to_episode > 0 && ` · 更新至第${collection?.updated_to_episode}集`}
                </SafeText>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    collectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: pixel(Theme.edgeDistance),
    },
    cover: {
        width: pixel(80),
        height: pixel(80),
        marginRight: pixel(12),
        borderRadius: pixel(8),
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        resizeMode: 'cover',
    },
    picLabel: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: (font(19) * 64) / 34,
        height: font(19),
        paddingHorizontal: pixel(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    picLabelText: {
        color: '#fff',
        lineHeight: font(14),
        fontSize: font(11),
    },
    content: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
    },
    name: {
        lineHeight: font(20),
        fontSize: font(15),
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        marginTop: pixel(4),
        lineHeight: font(18),
        fontSize: font(14),
        color: '#b2b2b2',
    },
    mateText: {
        fontSize: font(12),
        color: '#b2b2b2',
    },
});
