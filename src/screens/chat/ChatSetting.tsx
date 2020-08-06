import React, { Component, useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeText, Row, Badge, Avatar, PageContainer, TouchFeedback, Iconfont, HxfRadio } from '@src/components';

const ChatSetting = (props: any) => {
    const navigation = useNavigation();
    const route = useRoute();
    const user = route.params?.user || {};
    const [contentType, setContentType] = useState(false);

    const changeContentType = useCallback(() => {
        setContentType(!contentType);
    }, []);

    console.log('user', user);
    return (
        <PageContainer title={'聊天信息'}>
            <TouchFeedback style={styles.itemStyle} onPress={() => navigation.navigate('User', { user })}>
                <Row>
                    <Avatar source={user.avatar} size={pixel(50)} />
                    <View style={{ marginLeft: pixel(10) }}>
                        <Text style={{ fontSize: font(15), color: Theme.navBarTitleColor || '#666' }}>{user.name}</Text>
                        <Text style={{ fontSize: font(13), color: Theme.secondaryTextColor }}>
                            {user.introduction || '本宝宝暂时还没想到个性签名~'}
                        </Text>
                    </View>
                </Row>
                <Iconfont name="right" color={Theme.navBarMenuColor} size={pixel(18)} />
            </TouchFeedback>
            <TouchFeedback style={styles.itemStyle}>
                <Text style={{ fontSize: font(15), color: Theme.navBarTitleColor || '#666' }}>屏蔽消息</Text>
                <HxfRadio onChange={changeContentType} mode="switch" />
            </TouchFeedback>
            <TouchFeedback
                style={styles.itemStyle}
                onPress={() =>
                    Toast.show({
                        content: '举报成功',
                    })
                }>
                <Text style={{ fontSize: font(15), color: Theme.navBarTitleColor || '#666' }}>举报</Text>
                <Iconfont name="right" color={Theme.navBarMenuColor} size={pixel(18)} />
            </TouchFeedback>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pixel(15),
        paddingVertical: pixel(15),
        borderBottomColor: Theme.navBarSeparatorColor,
        borderBottomWidth: pixel(0.5),
    },
    radioText: {
        fontSize: font(15),
        color: Theme.watermelon,
    },
});

export default ChatSetting;
