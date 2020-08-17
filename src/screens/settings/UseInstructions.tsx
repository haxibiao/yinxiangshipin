import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PageContainer } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
// 积分使用说明
const UseInstructions = () => {
    const navigation = useNavigation();
    return (
        <PageContainer title="使用说明" white>
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>印象视频积分使用说明</Text>
                </View>
                <View style={styles.fontWrap}>
                    <Text style={styles.tintFont}>目的：制定一个比较完善的健康分作为一个可视化文档,供用户参考。</Text>
                </View>
                <View style={styles.fontWrap}>
                    <Text style={styles.tintFont}>什么是积分？ </Text>
                    <Text style={styles.tintFont}> 积分作为一个虚拟的货币，只能通过印象视频软件才能获取并兑换。 </Text>
                </View>

                <View style={styles.fontWrap}>
                    <Text style={styles.tintFont}>如何获取？</Text>
                    <View>
                        <Text style={styles.tintFont}>
                            用户可以通过回答问题发布问题或者写文章来获取积分，也可通过《价值池》瓜分积分/金钱。详情请见
                        </Text>

                        {/* <TouchableOpacity onPress={() => navigation.navigate('价值池')}>
                            <Text style={{ fontSize: font(15), color: 'rgba(23, 171, 255, 1)', lineHeight: 20 }}>
                                价值池须知
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                </View>

                <View style={styles.fontWrap}>
                    <Text style={styles.tintFont}>积分能做什么？</Text>
                    <Text style={styles.tintFont}>
                        积分作为平台唯一的虚拟货币，积分可以兑换成余额进行提现。 每日每人都会被限制获取积分额度。
                    </Text>
                </View>
                <View style={styles.fontWrap}>
                    <Text style={styles.tintFont}>为什么限制获取额度？ </Text>
                    <Text style={styles.tintFont}>
                        因为平台需要提供正确的引导和正确的回答，或者是自己的亲身经历，帮助用户解决问题，树立一个正确的方式，而不是为了让一些刷子来回答一些无聊且没用的回答。
                    </Text>
                </View>
                <View style={styles.fontWrap}>
                    <Text style={styles.tintFont}>怎么提高获取积分每日额度？ </Text>
                    <Text style={styles.tintFont}> 账号活跃度越高，每日获得的积分额度也会越高。</Text>
                </View>
                <View style={styles.fontWrap}>
                    <Text style={styles.tintFont}>怎么才能提高日活跃度呢？ </Text>
                    <Text style={styles.tintFont}>
                        提供有效的问题；回答；经历；或者发布健康普及的文章。建立话题：每日活跃人数达到一定峰值系统都会自动为您提高提高获取额度。
                    </Text>
                </View>
            </View>
        </PageContainer>
    );
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: pixel(15),
    },
    fontWrap: {
        marginTop: 10,
    },
    tintFont: {
        color: Theme.subTextColor,
        fontSize: font(15),
        lineHeight: 20,
    },
    title: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        fontWeight: '500',
        marginBottom: pixel(10),
        textAlign: 'center',
    },
});
export default UseInstructions;
