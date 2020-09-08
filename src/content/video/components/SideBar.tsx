import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Image, Animated, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Avatar, SafeText } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import { ApolloProvider } from 'react-apollo';
import { observer } from '@src/store';
import { Overlay } from 'teaset';
import { AnimationLike, MoreOperation } from '../../widget';

const imageSource = {
    liked: require('@app/assets/images/ic_liked.png'),
    unlike: require('@app/assets/images/ic_like.png'),
};

export default observer(({ media, store, client, removeMedia }) => {
    const navigation = useNavigation();

    const showComment = useCallback(() => {
        DeviceEventEmitter.emit('showCommentModal');
    }, []);

    const overlayRef = useRef();

    const moreOperation = useMemo(() => {
        return (
            <ApolloProvider client={client}>
                <MoreOperation
                    target={media}
                    options={['举报', '不感兴趣', '下载', '复制链接']}
                    videoUrl={media?.video?.url}
                    videoTitle={media?.body}
                    closeOverlay={() => overlayRef.current?.close()}
                    onRemove={removeMedia}
                    client={client}
                    navigation={navigation}
                />
            </ApolloProvider>
        );
    }, [client, media, removeMedia]);

    const showMoreOperation = useCallback(() => {
        const MoreOperationOverlay = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={(ref: any) => (overlayRef.current = ref)}>
                {moreOperation}
            </Overlay.PullView>
        );
        Overlay.show(MoreOperationOverlay);
    }, [moreOperation]);

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
                        {Helper.count(media?.count_comments)}
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
        marginTop: pixel(4),
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
