import React, { Component, useCallback } from 'react';
import { StyleSheet, View, Image, Animated, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Avatar, SafeText, MoreOperation } from '@src/components';
import { useApolloClient, ApolloProvider } from '@src/apollo';
import { useNavigation } from '@react-navigation/native';
import { observer } from '@src/store';
import { Overlay } from 'teaset';
import { font, pixel, count } from '../../helper';
import { AnimationLike } from '../../widget';

const imageSource = {
    liked: require('@app/assets/images/ic_liked.png'),
    unlike: require('@app/assets/images/ic_like.png'),
};

export default observer(({ media, store }) => {
    const navigation = useNavigation();
    const client = useApolloClient();

    const showComment = useCallback(() => {
        DeviceEventEmitter.emit('showCommentModal');
    }, []);

    const showMoreOperation = useCallback(() => {
        let overlayRef: any;
        const MoreOperationOverlay = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={(ref: any) => (overlayRef = ref)}>
                <ApolloProvider client={client}>
                    <MoreOperation
                        navigation={navigation}
                        onPressIn={() => overlayRef.close()}
                        target={media}
                        showShare={true}
                        downloadUrl={media?.video?.url}
                        downloadUrlTitle={media?.body}
                        options={['下载', '不感兴趣', '举报', '复制链接']}
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        Overlay.show(MoreOperationOverlay);
    }, [client, media]);

    return (
        <View style={styles.sideBar}>
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('User', { user: media?.user });
                    }}>
                    <Avatar
                        source={media?.user?.avatar}
                        size={pixel(52)}
                        style={{ borderColor: '#fff', borderWidth: 1 }}
                    />
                </TouchableOpacity>
            </View>
            <AnimationLike content={media} style={styles.itemWrap}>
                <Image source={media.liked ? imageSource.liked : imageSource.unlike} style={styles.imageSize} />
                <SafeText style={styles.countText} shadowText={true}>
                    {(media.count_likes <= 0 ? 0 : media.count_likes) || 0}
                </SafeText>
            </AnimationLike>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={showComment}>
                    <Image source={require('@app/assets/images/comment_item.png')} style={styles.imageSize} />
                    <SafeText style={styles.countText} shadowText={true}>
                        {count(media?.count_comments)}
                    </SafeText>
                </TouchableOpacity>
            </View>
            <View style={styles.itemWrap}>
                <TouchableOpacity onPress={showMoreOperation}>
                    <Image source={require('@app/assets/images/more_item.png')} style={styles.imageSize} />
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    countText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: font(12),
        marginTop: pixel(5),
        textAlign: 'center',
    },
    imageSize: {
        height: pixel(40),
        width: pixel(40),
    },
    itemWrap: {
        marginTop: pixel(18),
    },
    sideBar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
