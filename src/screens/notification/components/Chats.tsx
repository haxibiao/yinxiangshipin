import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Animated, I18nManager } from 'react-native';
import { SafeText, Row, Badge, Avatar } from '@src/components';
import { RectButton, FlatList } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, GQL } from '@src/apollo';

interface Props {
    chats: any;
}

function SwipeAbleRow({ chat, remove, children }) {
    const swipeRef = useRef();
    const closeSwipe = useCallback(() => {
        swipeRef.current.close();
    }, []);

    const [deleteChatMutation] = useMutation(GQL.deleteChatMutation, {
        variables: {
            id: chat.id,
        },
    });

    const removeChat = useCallback(async () => {
        remove(chat);
        await Helper.exceptionCapture(deleteChatMutation);
        // if (error) {
        //     Toast.show({ content: error.message || '删除失败', layout: 'top' });
        // }
    }, [deleteChatMutation]);

    const renderRightAction = useCallback((text, color, width, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [width, 0],
        });
        const pressHandler = () => {
            if (text === '删除') {
                removeChat();
            }
            closeSwipe();
        };
        return (
            <Animated.View style={{ width, transform: [{ translateX: trans }] }}>
                <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={pressHandler}>
                    <SafeText style={styles.actionText}>{text}</SafeText>
                </RectButton>
            </Animated.View>
        );
    }, []);

    const renderRightActions = useCallback(progress => {
        return (
            <View style={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
                {/* {renderRightAction('屏蔽', '#C7C7CD', pixel(192), progress)} */}
                {/* {renderRightAction('Flag', '#FF9D01', 128, progress)} */}
                {renderRightAction('删除', '#FF3A2F', pixel(86), progress)}
            </View>
        );
    }, []);

    return (
        <Swipeable
            ref={swipeRef}
            friction={2}
            leftThreshold={10}
            overshootRight={false}
            // rightThreshold={40}
            renderRightActions={renderRightActions}>
            {children}
        </Swipeable>
    );
}

const ChatItem = ({ chat, navigation }) => (
    <TouchableOpacity style={styles.notifyItem} activeOpacity={1} onPress={() => navigation.navigate('Chat', { chat })}>
        <TouchableOpacity onPress={() => navigation.navigate('User', { user: Helper.syncGetter('withUser', chat) })}>
            <Avatar source={Helper.syncGetter('withUser.avatar', chat)} size={pixel(46)} />
        </TouchableOpacity>
        <View style={styles.notifyContent}>
            <Row style={styles.itemContentTop}>
                <SafeText style={styles.itemName}>{Helper.syncGetter('withUser.name', chat)}</SafeText>
                <SafeText style={styles.timeAgo}>{Helper.syncGetter('updated_at', chat)}</SafeText>
            </Row>
            <Row style={styles.itemContentBottom}>
                <SafeText style={styles.lastMessage} numberOfLines={1}>
                    {Helper.syncGetter('lastMessage.message', chat) || '“还没有发过消息”'}
                </SafeText>
                <Badge count={chat.unreads} />
            </Row>
        </View>
    </TouchableOpacity>
);

export default props => {
    const navigation = useNavigation();
    const [chats, setChats] = useState(props.chats);

    const removeChatItem = useCallback(chat => {
        setChats(data => {
            data.splice(data.indexOf(chat), 1);

            return [...data];
        });
    }, []);

    useEffect(() => {
        setChats(props.chats);
    }, [props.chats]);

    return (
        <FlatList
            data={chats}
            renderItem={({ item }) => {
                return (
                    <SwipeAbleRow chat={item} remove={removeChatItem}>
                        <ChatItem chat={item} navigation={navigation} />
                    </SwipeAbleRow>
                );
            }}
            keyExtractor={item => `message ${item.id}`}
        />
    );
};

const styles = StyleSheet.create({
    notifyItem: {
        height: pixel(70),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: pixel(Theme.edgeDistance),
    },
    notifyContent: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        marginLeft: pixel(10),
        paddingVertical: pixel(8),
        borderBottomWidth: Device.minimumPixel,
        borderBottomColor: '#f0f0f0',
    },
    itemContentTop: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemContentBottom: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemName: {
        color: Theme.defaultTextColor,
        fontSize: font(15),
        fontWeight: 'bold',
    },
    lastMessage: {
        color: Theme.subTextColor,
        fontSize: font(12),
        lineHeight: font(14),
        paddingRight: pixel(20),
    },
    timeAgo: {
        color: Theme.subTextColor,
        fontSize: font(12),
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    actionText: {
        color: 'white',
        fontSize: font(16),
        backgroundColor: 'transparent',
        padding: pixel(10),
    },
});
