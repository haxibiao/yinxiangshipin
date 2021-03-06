import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { PageContainer } from '@src/components';

const SpiderVideoTask = () => {
    const WIDTH = Device.width - 30;

    return (
        <PageContainer title="收藏视频教学" white>
            <ScrollView style={{ flex: 1, paddingHorizontal: pixel(15) }}>
                <Image
                    source={require('@app/assets/images/guide/spider_video_task1.png')}
                    style={{ width: WIDTH, height: (WIDTH * 724) / 892, marginTop: pixel(15) }}
                />
                <Image
                    source={require('@app/assets/images/guide/spider_video_task2.png')}
                    style={{ width: WIDTH, height: (WIDTH * 1598) / 989 }}
                />
                <Image
                    source={require('@app/assets/images/guide/spider_video_task3.png')}
                    style={{ width: WIDTH, height: (WIDTH * 1670) / 989 }}
                />
            </ScrollView>
        </PageContainer>
    );
};

export default SpiderVideoTask;
