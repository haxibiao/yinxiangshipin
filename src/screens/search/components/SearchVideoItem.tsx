import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { Avatar, Iconfont, SafeText } from '@src/components';
import LinearGradient from 'react-native-linear-gradient';

export default function SearchVideoItem({ media }) {
    return (
        <ImageBackground style={styles.videoCover} source={{ uri: item?.video?.dynamic_cover || media?.video?.cover }}>
            <LinearGradient
                style={styles.contentContainer}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                colors={['rgba(000,000,000,0.6)', 'rgba(000,000,000,0.3)', 'rgba(000,000,000,0)']}>
                <SafeText style={styles.whiteText} numberOfLines={3}>
                    {String(media?.content || media?.description).trim()}
                </SafeText>
                <View style={styles.creator}>
                    <View style={styles.row}>
                        <Avatar source={media?.user?.avatar} size={pixel(20)} />
                        <SafeText style={styles.grayText}>{media?.user?.name}</SafeText>
                    </View>
                    <View style={styles.row}>
                        <Iconfont
                            size={font(12)}
                            name="xihuanfill"
                            color={media.liked ? Theme.watermelon : '#f0f0f0'}
                        />
                        <SafeText style={styles.grayText}>{media?.count_likes || 0}</SafeText>
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    videoCover: {
        ...StyleSheet.absoluteFillObject,
        width: undefined,
        height: undefined,
        justifyContent: 'flex-end',
    },
    contentContainer: {
        padding: pixel(10),
        paddingVertical: pixel(5),
    },
    whiteText: {
        fontSize: font(14),
        lineHeight: font(18),
        color: '#ffffff',
    },
    creator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: pixel(5),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    grayText: {
        fontSize: font(11),
        color: '#f0f0f0',
        marginLeft: pixel(3),
    },
});
