import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions, Button, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PageContainer, HxfButton } from '@src/components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const WithdrawApply = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const created_at = route.params?.created_at; // 提现记录创建时间
    const amount = route.params?.amount; // 单次提现额度

    return (
        <PageContainer title="提现申请">
            <View style={styles.container}>
                <Image source={require('@app/assets/images/money.png')} style={styles.image} resizeMode="contain" />
                <View style={styles.content}>
                    <Text style={styles.header}>提现申请已提交</Text>
                    <View style={styles.center}>
                        <Text style={styles.money}>{amount}</Text>
                        <Text style={{ fontSize: font(10), color: Theme.secondaryColor, paddingTop: pixel(32) }}>
                            {' '}
                            元
                        </Text>
                    </View>
                    <View
                        style={{
                            width: SCREEN_WIDTH,
                            height: 60,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={styles.text}>预计3~5个工作日内到账</Text>
                    </View>
                    <HxfButton
                        title="知道了"
                        gradient={true}
                        style={styles.button}
                        onPress={() => navigation.goBack()}
                    />
                </View>
            </View>
        </PageContainer>
    );
};

export default WithdrawApply;

const styles = StyleSheet.create({
    button: {
        marginTop: pixel(20),
        alignItems: 'center',
        borderRadius: pixel(22),
        height: pixel(44),
        justifyContent: 'center',
        width: pixel(220),
    },
    center: {
        flexDirection: 'row',
        marginTop: pixel(20),
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,1)',
    },
    content: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingHorizontal: 23,
    },
    header: {
        color: Theme.defaultTextColor,
        fontSize: font(22),
    },
    image: {
        height: SCREEN_WIDTH * 0.5,
        marginTop: 40,
        width: SCREEN_WIDTH * 0.35,
    },
    money: {
        color: Theme.secondaryColor,
        fontSize: font(43),
    },
    text: {
        color: '#363636',
        fontSize: font(13),
    },
});
