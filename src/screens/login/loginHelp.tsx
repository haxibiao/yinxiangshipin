import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, ViewStyle } from 'react-native';
import { HxfButton, PageContainer, SafeText } from '@src/components';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const HelpItem = (props: { issue: string; answer: string; style?: ViewStyle }) => {
    const { style, issue, answer } = props;
    const [state, setstate] = useState(false);
    return (
        <View style={style}>
            <TouchableOpacity
                onPress={() => {
                    setstate(!state);
                }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: '#000',
                                fontSize: pixel(14),
                                marginLeft: pixel(5),
                                marginRight: pixel(10),
                            }}>
                            {issue}
                        </Text>
                    </View>

                    <Image
                        style={{ width: pixel(20), height: pixel(20) }}
                        source={
                            state
                                ? require('@app/assets/images/ic_loginhelp_packup.png')
                                : require('@app/assets/images/ic_loginhelp_unfold.png')
                        }
                    />
                </View>
            </TouchableOpacity>
            {state && (
                <View
                    style={{
                        backgroundColor: '#9991',
                        paddingVertical: pixel(10),
                        paddingHorizontal: pixel(5),
                        marginTop: pixel(5),
                        borderRadius: 5,
                    }}>
                    <Text>{answer}</Text>
                </View>
            )}
        </View>
    );
};

export default function loginHelp() {
    const navigation = useNavigation();
    return (
        <PageContainer title="登陆帮助" white>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                    style={{ height: 220, backgroundColor: Theme.primaryColor }}
                    source={require('@app/assets/images/loginhelp_back.png')}>
                    <View style={{ flex: 1, padding: pixel(20) }}>
                        <View style={{ flexDirection: 'row', marginTop: pixel(10) }}>
                            <View
                                style={{
                                    paddingVertical: pixel(4),
                                    paddingHorizontal: pixel(12),
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 100,
                                    backgroundColor: '#FFF',
                                }}>
                                <SafeText style={{ color: Theme.primaryColor, fontWeight: 'bold' }}>
                                    {Config.AppName}
                                </SafeText>
                            </View>
                            <View style={{ flex: 1 }} />
                        </View>

                        <SafeText
                            style={{ marginTop: pixel(10), fontSize: pixel(26), color: '#FFF', fontWeight: 'bold' }}>
                            登陆帮助
                        </SafeText>
                        <View style={{ flex: 1 }} />
                        <Text style={{ color: '#FFFC' }}>2020 年 06 月修订</Text>
                    </View>
                    <View
                        style={{
                            height: pixel(20),
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                            backgroundColor: '#FFF',
                        }}
                    />
                </ImageBackground>
                <View style={{ paddingHorizontal: pixel(15) }}>
                    {[
                        {
                            q: '为什么我无法登陆？',
                            i:
                                '当您无法进行登陆时，建议您：\n1.检查账号密码是否填写无误\n2.检查手机号验证码是否填写无误\n3.尝试进行第三方登陆',
                        },
                        {
                            q: '手机接收不到验证码？',
                            i:
                                '如果您无法收到短信验证码，建议您：\n1.检查您的手机是否已经停机/关机/没有信号\n2.检查您的手机是否输入正确无误，是否是空号\n3.检查您的垃圾短信箱，确保短信没有被屏蔽',
                        },
                        {
                            q: '忘记密码了如何找回密码？',
                            i: '当您忘记密码时，您可以点击登陆下方的忘记密码入口，按提示进行操作，将密码进行重置',
                        },
                        {
                            q: '可以用其他账号进行第三方登陆吗？',
                            i: '您可以使用微信进行第三方登陆，暂不支持其他平台的第三方登陆',
                        },
                        {
                            q: '如何更换绑定手机号？',
                            i:
                                '当您想要更换绑定手机号时，您可以修改当前该账号绑定的手机号码\n具体入口：设置 ➡️ 修改绑定账号 ➡️ 输入新绑定号码',
                        },
                        {
                            q: '微信提示登陆失败？',
                            i: '这是微信平台的问题，请您稍后重新登陆试试',
                        },
                        {
                            q: '什么是识别码认证一键登陆？',
                            i:
                                '这是哈希坊科技提供的手机唯一身份认证登陆功能，通过该功能可以享受静默登陆和快速一键登陆的权益',
                        },
                        {
                            q: '为什么我的手机没有识别码认证一键登陆？',
                            i:
                                '识别码认证一键登陆是哈希坊科技提供的手机唯一身份认证登陆功能，需要您给予应用获取手机信息的权限，部分手机可能暂时不支持该功能可以使用其他方法登陆账号',
                        },
                        {
                            q: '怎么使用其他手机号码登陆？',
                            i:
                                '可以通过点击一键登陆然后点击弹窗上的使用其他手机登陆功能，输入手机号获取验证码的方式登陆您的账号',
                        },
                        {
                            q: '如何注销账号？',
                            i:
                                '如您不想使用该账号时，您可以对当前账号进行注销，\n具体入口：设置 ➡️ 账号注销\n注意，您注销账号后，账户数据将全部清空，且该操作不可逆，注销之前需要您先处理完正在进行中的订单以及账户中的余额',
                        },
                    ].map((item: any, index: number) => (
                        <HelpItem key={index} style={{ marginBottom: pixel(20) }} issue={item.q} answer={item.i} />
                    ))}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: pixel(50),
                        marginBottom: pixel(30),
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text>您还有其他登陆问题？</Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('Feedback');
                        }}>
                        <Text style={{ color: '#29F' }}>点击反馈</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({});
