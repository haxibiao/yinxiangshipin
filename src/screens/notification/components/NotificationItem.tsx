import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Iconfont, SafeText } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export default observer(({ data }) => {
    const navigation = useNavigation();
    const comment = Helper.syncGetter('comment', data);
    const article = useMemo(() => {
        const value = Helper.syncGetter('article', data);
        return value ? observable(value) : null;
    }, []);

    const cover = Helper.syncGetter('article.cover', data);

    const onPress = useCallback(() => {
        if (comment) {
            navigation.navigate('Comment', { comment });
        } else if (article) {
            navigation.navigate('PostDetail', { post: article });
        } else {
            Toast.show({ content: '该内容已经不存在了！' });
        }
    }, []);

    const title = useMemo(() => {
        const noticeType = Helper.syncGetter('type', data);
        if (comment) {
            const type = noticeType || '与您进行了互动';
            return `${type} ：”${comment.body}“`;
        }
        if (article) {
            const type = noticeType || '与您进行了互动';
            return `${type} 《${article.description}》`;
        }
        return noticeType;
    }, []);

    const articleCover = useMemo(() => {
        if (article || comment) {
            if (cover) {
                return (
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('PostDetail', { post: article })}>
                        <Image style={styles.contentCover} source={{ uri: cover }} />
                    </TouchableWithoutFeedback>
                );
            }
            return (
                <View style={styles.contentCover}>
                    <Iconfont name="morentupianccccccpx" size={pixel(40)} color="#fff" />
                </View>
            );
        }
        return null;
    }, []);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.noticeItem}>
                <TouchableOpacity
                    style={styles.avatar}
                    onPress={() => {
                        const user = Helper.syncGetter('user', data);
                        if (user) {
                            navigation.navigate('User', { user });
                        } else {
                            Toast.show({ content: '该用户已经消失了！' });
                        }
                    }}>
                    <Image style={styles.avatar} source={{ uri: Helper.syncGetter('user.avatar', data) }} />
                </TouchableOpacity>
                <View style={styles.content}>
                    <SafeText style={styles.userName}>{Helper.syncGetter('user.name', data) || '匿名用户'}</SafeText>
                    <Text style={styles.noticeType}>{title}</Text>
                    <Text style={styles.timeAgo}>{Helper.syncGetter('time_ago', data) || '1分钟前'}</Text>
                </View>
                {articleCover}
            </View>
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    noticeItem: {
        flexDirection: 'row',
        paddingHorizontal: pixel(15),
        marginVertical: pixel(15),
    },
    avatar: {
        width: pixel(40),
        height: pixel(40),
        borderRadius: pixel(20),
        backgroundColor: '#f0f0f0',
    },
    content: {
        flex: 1,
        marginLeft: pixel(15),
    },
    userName: {
        fontWeight: 'bold',
        fontSize: font(15),
        color: '#212121',
    },
    noticeType: {
        fontSize: font(15),
        color: '#212121',
        marginTop: pixel(6),
    },
    timeAgo: {
        fontSize: font(10),
        color: '#AAA',
        marginTop: pixel(10),
    },
    contentCover: {
        width: pixel(80),
        height: pixel(80),
        marginLeft: pixel(15),
        borderRadius: pixel(6),
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
