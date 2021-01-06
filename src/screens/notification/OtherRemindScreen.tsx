import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, Text, Image } from 'react-native';
import { PageContainer, StatusView, SpinnerLoading } from '@src/components';
import { Query, GQL, useApolloClient } from '@src/apollo';
import { QueryList } from '@src/content';
import NotificationItem from './components/NotificationItem';
import { Iconfont, SvgIcon, SvgPath } from '@src/components';

export default (props: any) => {
    const client = useApolloClient();

    useEffect(() => {
        return () => {
            client.query({
                query: GQL.unreadsQuery,
                fetchPolicy: 'network-only',
            });
        };
    }, []);
    // const renderItem = useCallback(({ item, index }) => {
    //     return <NotificationItem data={item} />;
    // }, []);
    return (
        <PageContainer title="其他提醒" variables={{ fetchPolicy: 'network-only' }}>
            <View style={styles.container}>
                {/* <QueryList
                    gqlDocument={GQL.otherNotificationsQuery}
                    options={{
                        fetchPolicy: 'network-only',
                    }}
                    dataOptionChain="notifications.data"
                    paginateOptionChain="notifications.paginatorInfo"
                    renderItem={renderItem}
                /> */}
                <View style={styles.containers}>
                    <Text style={styles.containerTop}>01-06&nbsp;20:19</Text>
                    <View style={styles.containerBottom}>
                        <Text style={styles.containerBtmTitle}>净网行动违规公示</Text>
                        <Text style={styles.containerBtmContent}>
                            为维护平台绿色发展,为广大用户营造积极、健康的环境氛围,印象视频自即日起定期发布平台治理成果,点击下方链接查看本期整治结果
                        </Text>
                        <View style={styles.containerBtmHandle}>
                            <Text style={styles.handleText}>立即查看</Text>
                            <SvgIcon
                                style={{ marginRight: -pixel(7) }}
                                name={SvgPath.rightArrow}
                                size={25}
                                color={'#aaaaaa'}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.containers}>
                    <Text style={styles.containerTop}>01-06&nbsp;20:19</Text>
                    <View style={styles.containerBottom}>
                        <Image
                            style={styles.containerBtmImg}
                            resizeMode="cover"
                            source={{
                                uri:
                                    'http://img1.gamersky.com/image2014/11/20141105zx_6/gamersky_01small_02_2014115111123A.jpg',
                            }}
                        />
                        <Text style={styles.containerBtmTitle}>《斩赤红之瞳》至郁翻 艾斯德斯</Text>
                        <Text style={styles.containerBtmContent}>
                            为维护平台绿色发展,为广大用户营造积极、健康的环境氛围,印象视频自即日起定期发布平台治理成果,点击下方链接查看本期整治结果
                        </Text>
                        <View style={styles.containerBtmHandle}>
                            <Text style={styles.handleText}>立即查看</Text>
                            <SvgIcon
                                style={{ marginRight: -pixel(7) }}
                                name={SvgPath.rightArrow}
                                size={25}
                                color={'#aaaaaa'}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </PageContainer>
    );
};

const itemWidth = Device.WIDTH - pixel(20);

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.groundColour || '#FFF',
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
    },
    containers: {
        width: Device.width,
        alignItems: 'center',
    },
    containerTop: {
        marginTop: pixel(10),
        backgroundColor: '#ffffff',
        paddingHorizontal: pixel(8),
        paddingVertical: pixel(4),
        borderRadius: pixel(25),
        color: '#a8a8a8',
        fontSize: font(12),
    },
    containerBottom: {
        width: itemWidth,
        backgroundColor: '#ffffff',
        borderRadius: pixel(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: pixel(10),
    },
    containerBtmTitle: {
        width: itemWidth - pixel(30),
        marginTop: pixel(15),
        fontSize: font(16),
        fontWeight: 'bold',
    },
    containerBtmContent: {
        width: itemWidth - pixel(30),
        paddingVertical: pixel(10),
        color: '#a8a8a8',
        borderBottomWidth: pixel(0.5),
        borderBottomColor: '#a8a8a8',
        fontSize: font(13),
        lineHeight: pixel(20),
    },
    containerBtmHandle: {
        flexDirection: 'row',
        width: itemWidth - pixel(30),
        marginVertical: pixel(10),
        justifyContent: 'space-between',
    },
    handleText: {
        color: Theme.primaryColor,
        lineHeight: pixel(25),
        fontSize: font(14),
    },
    containerBtmImg: {
        width: itemWidth - pixel(30),
        height: (itemWidth - pixel(30)) / 2,
        marginTop: pixel(15),
        borderRadius: pixel(15),
    },
});
