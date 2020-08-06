import React, { useCallback, useState, useRef, useMemo, useEffect, Fragment } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ImageBackground,
    Image,
} from 'react-native';
import { PageContainer, Iconfont, Row, HxfButton, SafeText } from '@src/components';
import { observer, userStore } from '@src/store';
import { useNavigation } from '@src/router';
import { GQL, useMutation, useQuery } from '@src/apollo';
import { bindWechat, syncGetter } from '@src/common';

const fakeAmountListData = [
    {
        tips: '秒到账',
        amount: 1,
        contributes: 100,
        description: 100 + Config.limitAlias,
    },
    {
        tips: '限量抢',
        amount: 3,
        contributes: 300,
        description: 100 + Config.limitAlias,
    },
    {
        tips: '限量抢',
        amount: 5,
        contributes: 500,
        description: 100 + Config.limitAlias,
    },
    {
        tips: '限量抢',
        amount: 10,
        contributes: 1000,
        description: 100 + Config.limitAlias,
    },
];

const WithdrawalPlatforms = [
    {
        type: 'ALIPAY',
        name: '支付宝',
        icon: require('@app/assets/images/alipay.png'),
    },
    // {
    //     type: 'WECHAT',
    //     name: '微信',
    //     icon: require('@app/assets/images/wechat.png'),
    // },
];

const fakeWallet = {
    id: null,
    pay_account: '',
    real_name: '',
    reward: 0,
    total_withdraw_amount: 0,
    today_withdraw_left: 0,
    available_balance: 0,
};

const BANNER_WIDTH = Device.WIDTH - pixel(Theme.itemSpace * 2);

export default observer((props: any) => {
    const navigation = useNavigation();
    const [withdrawType, setWithdrawType] = useState(WithdrawalPlatforms[0].type);

    const { data: userMetaData } = useQuery(GQL.MeMetaQuery, {
        fetchPolicy: 'network-only',
    });
    const userProfile = useMemo(() => Object.assign(userStore.me, userMetaData?.me), [userStore.me, userMetaData]);
    const wallet = useMemo(() => userProfile?.wallet || fakeWallet, [userProfile]);

    const { data: withdrawAmountListData } = useQuery(GQL.getWithdrawAmountList);
    const withdrawAmountData = useMemo(() => {
        return withdrawAmountListData?.getWithdrawAmountList || fakeAmountListData;
    }, [withdrawAmountListData]);
    const [amount, setAmount] = useState(
        userProfile.balance > withdrawAmountData[0].amount ? withdrawAmountData[0].amount : 0,
    );
    const [withdrawRequest, { loading }] = useMutation(GQL.CreateWithdrawMutation, {
        variables: {
            amount,
            platform: withdrawType,
        },
        errorPolicy: 'all',
        refetchQueries: () => [
            {
                query: GQL.userProfileQuery,
                variables: { id: userStore.me.id },
                fetchPolicy: 'network-only',
            },
            {
                query: GQL.getWithdrawAmountList,
            },
        ],
        onCompleted: data => {
            navigation.navigate('WithdrawApply', {
                amount,
                created_at: syncGetter('createWithdraw.created_at', data),
            });
        },
        onError: error => {
            Toast.show({ content: error.message.replace('GraphQL error: ', '') || '提现失败' });
        },
    });

    const setWithdrawAmount = useCallback(
        value => {
            if (userProfile.balance < value) {
                Toast.show({ content: `余额不足，去做任务吧` });
            } else if (wallet.id) {
                if (wallet.today_withdraw_left >= value) {
                    setAmount(value);
                } else {
                    Toast.show({ content: `今日提现额度已用完` });
                }
            } else {
                Toast.show({ content: `请先完善信息` });
            }
        },
        [userProfile, wallet],
    );

    const onWithdraw = useCallback(__.debounce(withdrawRequest, 500), [withdrawRequest]);

    const bindWithdrawAccount = useMemo(() => {
        return {
            ALIPAY() {
                return navigation.navigate(userProfile.phone ? 'VerifyAliPay' : 'BindingAccount');
            },
            WECHAT() {
                bindWechat({
                    onSuccess: () => {
                        Toast.show({
                            content: '绑定微信成功',
                        });
                    },
                    onFailed: () => {
                        Toast.show({
                            content: '绑定微信失败',
                        });
                    },
                });
            },
        };
    }, [userProfile]);

    const buttonInfo = useMemo(() => {
        const platformName = withdrawType === 'ALIPAY' ? '支付宝' : '微信';
        const isBound =
            platformName === '支付宝'
                ? syncGetter('wallet.platforms.alipay', userProfile)
                : syncGetter('wallet.bind_platforms.wechat', userProfile);
        const disabled = isBound && amount <= 0;
        if (isBound) {
            return {
                disabled,
                title: amount > 0 ? `提现${amount}元` : '选择提现金额',
                callback: onWithdraw,
            };
        } else {
            return {
                disabled,
                title: `请先绑定${platformName}`,
                callback: bindWithdrawAccount[withdrawType],
            };
        }
    }, [amount, withdrawType, userProfile, onWithdraw]);

    return (
        <PageContainer
            title="提现"
            rightView={
                <TouchableOpacity
                    style={styles.logButton}
                    onPress={() => {
                        navigation.navigate('WithdrawHistory', {
                            wallet_id: wallet.id,
                        });
                    }}>
                    <Text style={styles.logText}>账单</Text>
                </TouchableOpacity>
            }
            submitting={loading}
            submitTips="请稍后...">
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.statistics}>
                    <ImageBackground source={require('@app/assets/images/wallet_bg.png')} style={styles.cardPackage}>
                        <View style={styles.currentGold}>
                            <View style={styles.cardItem}>
                                <View>
                                    <Text style={styles.blackText}>{Config.goldAlias}：</Text>
                                    <SafeText style={styles.boldBlackText}>
                                        {Helper.count(userProfile.gold) || 0}
                                    </SafeText>
                                </View>
                                <View>
                                    <SafeText style={styles.blackText}>余额(元)</SafeText>
                                    <SafeText style={styles.boldBlackText}>{userProfile.balance || 0}</SafeText>
                                </View>
                            </View>
                            <View style={styles.cardItem}>
                                <View style={styles.withdrawLimit}>
                                    <SafeText style={styles.blackText2}>今日{Config.limitAlias}：</SafeText>
                                    <SafeText style={styles.boldBlackText2}>
                                        {userProfile.today_contributes || 0}
                                    </SafeText>
                                </View>
                                <View style={styles.withdrawLimit}>
                                    <SafeText style={styles.blackText2}>总{Config.limitAlias}：</SafeText>
                                    <SafeText style={styles.boldBlackText2}>
                                        {userProfile.total_contributes || 0}
                                    </SafeText>
                                </View>
                                <View style={styles.withdrawLimit}>
                                    <SafeText style={styles.blackText2}>总提现：</SafeText>
                                    <SafeText style={styles.boldBlackText2}>
                                        {wallet.total_withdraw_amount || 0}
                                    </SafeText>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderTitle}>提现金额</Text>
                    </View>
                    <View style={styles.amountOptions}>
                        <Text style={styles.withdrawTips}>
                            提现需要消耗相应{Config.limitAlias}，更多疑问请查看下方提示
                        </Text>
                        {withdrawAmountData.map(data => {
                            const selected = data.amount === amount;
                            return (
                                <View key={data.amount}>
                                    <TouchableOpacity
                                        style={[styles.amountItem, selected && styles.activeAmountItem]}
                                        onPress={() => setWithdrawAmount(data.amount)}>
                                        <Row>
                                            <Image
                                                source={require('@app/assets/images/icon_wallet_rmb.png')}
                                                style={styles.rmbImage}
                                            />
                                            <Text style={[styles.amountItemText, selected && { color: '#34BBFF' }]}>
                                                {data.amount}元
                                            </Text>
                                        </Row>
                                        <Row>
                                            <Image
                                                source={require('@app/assets/images/diamond.png')}
                                                style={styles.diamondImage}
                                            />
                                            <Text style={[styles.amountTips, selected && { color: '#34BBFF' }]}>
                                                {data.contributes}
                                            </Text>
                                        </Row>
                                    </TouchableOpacity>
                                    <View style={styles.amountItemBadge}>
                                        <Text style={styles.amountItemBadgeText} numberOfLines={1}>
                                            {data.tips}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderTitle}>提现方式</Text>
                    </View>
                    <View style={styles.withdrawPlatforms}>
                        {WithdrawalPlatforms.map(data => {
                            if (Device.IOS && data.type === 'WECHAT') return null;
                            return (
                                <TouchableWithoutFeedback
                                    key={data.type}
                                    onPress={() => {
                                        setWithdrawType(data.type);
                                    }}>
                                    <View style={styles.withdrawOption}>
                                        <View style={styles.withdrawPlatform}>
                                            <Image source={data.icon} style={styles.platformImage} />
                                            <Text style={styles.platformName}>{data.name}</Text>
                                        </View>
                                        <Iconfont
                                            name={
                                                data.type === withdrawType
                                                    ? 'radiobuttonchecked'
                                                    : 'radiobuttonunchecked'
                                            }
                                            color={data.type === withdrawType ? '#1C9AFF' : '#f0f0f0'}
                                            size={font(20)}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        })}
                    </View>
                    <HxfButton
                        gradient={true}
                        disabled={buttonInfo.disabled}
                        style={styles.withdrawBtn}
                        title={buttonInfo.title}
                        onPress={buttonInfo.callback}
                    />
                </View>

                <View style={styles.ruleContainer}>
                    <Text style={[styles.ruleText, styles.ruleTitle]}>温馨提示</Text>

                    <Text style={styles.ruleText}>
                        {`1、您可以通过首页刷视频等方式获取${Config.goldAlias}；只有当您绑定懂得赚（官方专属钱包，提现秒到账不限时不限量）或支付宝或微信之后，才能开始提现。`}
                    </Text>

                    <Text style={styles.ruleText}>
                        {`2、${Config.limitAlias}获取方式：点击视频广告有机率获得${Config.limitAlias}、每天前十次观看并点击激励视频有机率获得${Config.limitAlias}，点赞，评论，发布优质内容等方式都有机率获得${Config.limitAlias}。提现所需${Config.limitAlias}为：提现金额*60`}
                    </Text>

                    <Text style={styles.ruleText}>
                        {`3、每天的转换汇率与平台收益及您的平台活跃度相关，因此汇率会受到影响上下浮动；活跃度越高，汇率越高；您可以通过刷视频、点赞评论互动、邀请好友一起来${Config.AppName}等行为来提高活跃度。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        {`4、每天凌晨 00:00-08:00 期间，系统会把您账户中的所有${Config.goldAlias}自动转为余额。`}
                    </Text>
                    <Text style={styles.ruleText}>5、提现 3~5 天内到账。若遇高峰期，可能延迟到账，请您耐心等待。</Text>
                    <Text style={styles.ruleText}>
                        {`6、若您通过非正常手段获取${Config.goldAlias}或余额（包括但不限于刷单、应用多开等操作、一人名下只能绑定一个支付宝，同一人不得使用多个账号提现），${Config.AppName}有权取消您的提现资格，并视情况严重程度，采取封禁等措施。`}
                    </Text>
                </View>
            </ScrollView>
        </PageContainer>
    );
});

const amountItemWidth = (Device.WIDTH - pixel(65)) / 2;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F8F8F8',
        paddingBottom: pixel(Theme.itemSpace) + Theme.HOME_INDICATOR_HEIGHT,
    },
    logButton: {
        height: pixel(25),
        justifyContent: 'center',
        paddingHorizontal: pixel(10),
    },
    logText: {
        color: Theme.primaryColor,
        fontSize: font(16),
        textAlign: 'center',
    },
    statistics: {
        padding: pixel(Theme.itemSpace),
    },
    cardPackage: {
        borderRadius: pixel(10),
        height: BANNER_WIDTH * 0.4,
        overflow: 'hidden',
        resizeMode: 'contain',
        width: BANNER_WIDTH,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: pixel(Theme.itemSpace),
    },
    currentGold: {
        flex: 1,
        justifyContent: 'space-between',
        padding: pixel(Theme.itemSpace),
    },
    cardItem: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    blackText: {
        color: Theme.defaultTextColor,
        fontSize: font(14),
        fontWeight: 'bold',
        ...Platform.select({
            ios: {},
            android: {
                fontFamily: ' ',
            },
        }),
    },
    blackText2: {
        color: Theme.defaultTextColor,
        fontSize: font(14),
        ...Platform.select({
            ios: {},
            android: {
                fontFamily: ' ',
            },
        }),
    },
    boldBlackText: {
        color: Theme.defaultTextColor,
        fontSize: font(30),
        fontWeight: 'bold',
        ...Platform.select({
            ios: {},
            android: {
                fontFamily: ' ',
            },
        }),
    },
    boldBlackText2: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        fontWeight: 'bold',
        ...Platform.select({
            ios: {},
            android: {
                fontFamily: ' ',
            },
        }),
    },
    sectionContainer: {
        margin: pixel(10),
        padding: pixel(15),
        paddingVertical: pixel(10),
        backgroundColor: '#fff',
        borderRadius: pixel(5),
    },
    sectionHeader: {
        marginTop: pixel(10),
    },
    sectionHeaderTitle: {
        color: '#212121',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    amountOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: pixel(10),
    },
    withdrawTips: {
        color: '#AEAEAE',
        fontSize: font(12),
        lineHeight: font(18),
        marginTop: pixel(5),
    },
    amountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: amountItemWidth,
        height: pixel(50),
        paddingHorizontal: pixel(10),
        borderWidth: pixel(1),
        borderColor: '#dfdfdf',
        borderRadius: pixel(5),
        backgroundColor: '#fff',
        marginTop: pixel(20),
    },
    amountItemText: {
        color: '#212121',
        fontSize: font(16),
    },
    amountTips: {
        color: '#AEAEAE',
        fontSize: font(12),
    },
    rmbImage: {
        height: pixel(18),
        marginRight: pixel(2),
        width: pixel(18),
    },
    diamondImage: {
        height: pixel(13),
        marginRight: pixel(2),
        width: pixel(13),
    },
    amountItemBadge: {
        position: 'absolute',
        right: -pixel(5),
        top: pixel(10),
        minWidth: pixel(50),
        height: pixel(20),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pixel(8),
        borderRadius: pixel(10),
        backgroundColor: '#FF5152',
    },
    amountItemBadgeText: {
        color: '#fff',
        fontSize: font(11),
    },
    activeAmountItem: {
        borderColor: '#34BBFF',
        backgroundColor: '#E9F6FF',
    },
    withdrawOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: pixel(12),
    },
    withdrawPlatform: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    platformImage: {
        height: pixel(18),
        marginRight: pixel(6),
        width: pixel(18),
    },
    platformName: {
        color: '#212121',
        fontSize: font(14),
    },
    withdrawBtn: {
        marginTop: pixel(20),
        marginBottom: pixel(15),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pixel(23),
        height: pixel(46),
    },
    ruleContainer: {
        marginHorizontal: pixel(10),
        marginTop: pixel(10),
    },
    ruleText: {
        color: '#AEAEAE',
        fontSize: font(14),
        lineHeight: font(18),
        paddingVertical: pixel(5),
    },
    ruleTitle: {
        color: '#AEAEAE',
        fontSize: font(14),
        fontWeight: 'bold',
    },
});
