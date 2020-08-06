import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { StyleSheet, View, FlatList, StatusBar, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { PageContainer, Iconfont } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
const { height, width } = Dimensions.get('window');

export default function Douyin_tutorial() {
    const navigation = useNavigation();

    return (
        <PageContainer title="如何采集抖音视频">
            <FlatList
                data={[
                    {
                        value: '第一步:打开抖音',
                        url: 'http://cos.haxibiao.com/storage/image/1576034354rcOqEz2QgqLxhOsU.jpg',
                    },
                    {
                        value: '第二步:点击右下角转发箭头',
                        url: 'http://cos.haxibiao.com/storage/image/1576119230Ab9oU2eeqdBDool3.jpg',
                    },
                    {
                        value: '第三步:点击复制链接',
                        url: 'http://cos.haxibiao.com/storage/image/1576119234gFyPXxNgXulhnI6t.jpg',
                    },
                    {
                        value: '第四步:打开点墨阁 ',
                        url: 'http://cos.haxibiao.com/storage/image/1576119237QD0M3eTmJxl3sKUY.jpg',
                    },
                    {
                        value: '第五步:采集完成',
                        url: 'http://cos.haxibiao.com/storage/image/1576119241FPOqdYFWoSMeNhQT.jpg',
                    },
                ]}
                renderItem={({ item }) => (
                    <View style={styles.content}>
                        <Text style={{ color: '#212121' }}>{item.value}</Text>
                        <Image
                            style={{ height: 0.55 * height, width: 0.6 * width, marginTop: pixel(20) }}
                            source={{ uri: item.url }}
                        />
                        <View
                            style={{
                                backgroundColor: '#f1f1f1',
                                alignSelf: 'flex-start',
                                marginTop: 6,
                                height: 1,
                                width: width * 0.9,
                            }}
                        />
                    </View>
                )}
            />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        width: width,
        height: 'auto',
        paddingHorizontal: 14,
        alignItems: 'center',
        marginTop: pixel(20),
    },
});
