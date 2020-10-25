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
import { useNavigation } from '@react-navigation/native';
import { PageContainer, Iconfont, Row, HxfButton, SafeText } from '@src/components';
import { observer, userStore, notificationStore } from '@src/store';
import { GQL, useMutation, useQuery, errorMessage } from '@src/apollo';
import { bindWechat, syncGetter, useNavigationListener } from '@src/common';

const fakeAmountListData = [
    {
        tips: '秒到账',
        amount: 1,
    },
    {
        tips: '限量抢',
        amount: 3,
    },
    {
        tips: '限量抢',
        amount: 5,
    },
    {
        tips: '限量抢',
        amount: 10,
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

export default observer((props: any) => {
    const navigation = useNavigation();
    // 提现方式
    const [withdrawType, setWithdrawType] = useState(WithdrawalPlatforms[0].type);
    // 钱包信息
    const { data: userMetaData, refetch } = useQuery(GQL.MeMetaQuery, {
        fetchPolicy: 'network-only',
    });
    const userProfile = useMemo(() => Object.assign({ ...userStore.me }, userMetaData?.me), [
        userStore.me,
        userMetaData,
    ]);
    const wallet = useMemo(() => userProfile?.wallet || fakeWallet, [userProfile]);
    // 提现额度
    const { data: withdrawAmountListData } = useQuery(GQL.getWithdrawAmountList);
    const withdrawAmountData = useMemo(() => {
        return withdrawAmountListData?.getWithdrawAmountList || fakeAmountListData;
    }, [withdrawAmountListData]);
    const [amount, setAmount] = useState(() => {
        if (userProfile?.gold >= userProfile?.exchangeRate * 0.3 && userProfile?.wallet?.total_withdraw_amount <= 0) {
            return withdrawAmountData[0].amount;
        }
        return userProfile.balance > withdrawAmountData[0].amount ? withdrawAmountData[0].amount : 0;
    });
    useEffect(() => {
        if (userProfile.balance > withdrawAmountData[0].amount) {
            setAmount(withdrawAmountData[0].amount);
        } else {
            setAmount(0);
        }
    }, [withdrawAmountData]);
    // 提现请求
    const [withdrawRequest, { loading }] = useMutation(GQL.CreateWithdrawMutation, {
        variables: {
            amount,
            platform: withdrawType,
        },
        errorPolicy: 'all',
        refetchQueries: () => [
            {
                query: GQL.MeMetaQuery,
                fetchPolicy: 'network-only',
            },
            {
                query: GQL.getWithdrawAmountList,
            },
        ],
        onCompleted: (data) => {
            navigation.navigate('WithdrawApply', {
                amount,
                created_at: syncGetter('createWithdraw.created_at', data),
            });
        },
        onError: (error) => {
            notificationStore.sendWalletNotice({
                title: '提现失败',
                content: errorMessage(error) || '提现时间为09:00-20:00的整点前十分钟哦，您可以下个时间段再来提现哦',
            });
        },
    });

    // 未提现过的用户
    const noWithdrawal = useMemo(() => userProfile?.gold >= 30 && userProfile?.wallet?.total_withdraw_amount <= 0, [
        userProfile,
    ]);
    // 设置提现金额
    const setWithdrawAmount = useCallback(
        (value) => {
            if (value == 0.3 && noWithdrawal) {
                if (userProfile?.gold >= userProfile?.exchangeRate * 0.3) {
                    setAmount(value);
                } else {
                    Toast.show({ content: `${Config.goldAlias}不足，去做任务吧` });
                }
            } else {
                // 正常流程
                if (userProfile.balance < value) {
                    Toast.show({ content: `余额不足，去做任务吧` });
                } else if (wallet.id) {
                    if (wallet.today_withdraw_left >= value) {
                        setAmount(value);
                    } else {
                        Toast.show({ content: `今日提现额度已用完` });
                    }
                } else {
                    Toast.show({ content: `请先绑定提现账号` });
                }
            }
        },
        [userProfile, wallet, noWithdrawal],
    );

    const onWithdraw = useCallback(__.debounce(withdrawRequest, 100), [withdrawRequest]);
    // 绑定提现账号
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
    // 提现按钮信息
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

    // useNavigationListener({ onFocus: refetch });

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
                    <ImageBackground
                        source={require('@app/assets/images/wallet/wallet_bg_balance.png')}
                        style={styles.walletRedBg}>
                        <View style={styles.assetItem}>
                            <Image
                                style={styles.assetIcon}
                                source={require('@app/assets/images/wallet/icon_wallet_diamond.png')}
                            />
                            <View style={styles.assetInfo}>
                                <SafeText style={styles.assetName}>{Config.goldAlias}</SafeText>
                                <Text style={styles.assetDescription}>
                                    用于转换余额，可以在任务、看视频等场景中获得
                                </Text>
                            </View>
                            <View style={styles.earnings}>
                                <SafeText style={styles.earningsText}>{userProfile.gold || '0.00'}</SafeText>
                            </View>
                        </View>
                        <View style={styles.assetItem}>
                            <Image
                                style={styles.assetIcon}
                                source={require('@app/assets/images/wallet/icon_wallet_balance.png')}
                            />
                            <View style={styles.assetInfo}>
                                <SafeText style={styles.assetName}>余额(元)</SafeText>
                                <Text style={styles.assetDescription}>
                                    用于提现，需要先绑定手机号以及支付宝/微信账号
                                </Text>
                            </View>
                            <View style={styles.earnings}>
                                <SafeText style={styles.earningsText}>{userProfile.balance || '0.00'}</SafeText>
                            </View>
                        </View>
                        <View style={styles.assetItem}>
                            <Image
                                style={styles.assetIcon}
                                source={require('@app/assets/images/wallet/icon_wallet_reworder_income.png')}
                            />
                            <View style={styles.assetInfo}>
                                <SafeText style={styles.assetName}>总收入</SafeText>
                                <SafeText style={styles.assetDescription}>
                                    历史提现总和，目前您在{Config.AppName}上面获得的累计收益
                                </SafeText>
                            </View>
                            <View style={styles.earnings}>
                                <SafeText style={styles.earningsText}>
                                    {wallet.total_withdraw_amount || '0.00'}
                                </SafeText>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <SafeText style={styles.sectionHeaderTitle}>提现金额</SafeText>
                    </View>
                    <View style={styles.amountOptions}>
                        <Text style={styles.withdrawTips}>
                            提现需要消耗相应{Config.goldAlias}，更多疑问请查看页面下方的温馨提示
                        </Text>
                        {withdrawAmountData.map((data, index) => {
                            const selected = data.amount === amount;
                            return (
                                <View key={data.amount}>
                                    <TouchableOpacity
                                        style={[styles.amountItem, selected && styles.activeAmountItem]}
                                        onPress={() => setWithdrawAmount(data.amount)}>
                                        <Row>
                                            <Image
                                                source={
                                                    index == 0 && noWithdrawal
                                                        ? require('@app/assets/images/wallet/icon_wallet_diamond.png')
                                                        : require('@app/assets/images/wallet/icon_wallet_balance.png')
                                                }
                                                style={styles.rmbImage}
                                            />
                                            <SafeText style={[styles.amountItemText, selected && { color: '#34BBFF' }]}>
                                                {data.amount}元
                                            </SafeText>
                                        </Row>
                                        <Row>
                                            <Image
                                                source={require('@app/assets/images/wallet/icon_wallet_diamond.png')}
                                                style={styles.diamondImage}
                                            />
                                            <SafeText style={[styles.amountTips, selected && { color: '#34BBFF' }]}>
                                                {data.amount * userProfile.exchangeRate}
                                            </SafeText>
                                        </Row>
                                    </TouchableOpacity>

                                    {((index == 0 && noWithdrawal) || !noWithdrawal) && (
                                        <View style={styles.amountItemBadge}>
                                            <SafeText style={styles.amountItemBadgeText} numberOfLines={1}>
                                                {data.tips}
                                            </SafeText>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.sectionHeader}>
                        <SafeText style={styles.sectionHeaderTitle}>提现方式</SafeText>
                    </View>
                    <View style={styles.withdrawPlatforms}>
                        {WithdrawalPlatforms.map((data) => {
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
                        colors={['#1A8EFF', '#30B5FF']}
                        disabled={buttonInfo.disabled}
                        style={styles.withdrawBtn}
                        title={buttonInfo.title}
                        onPress={buttonInfo.callback}
                    />
                </View>

                <View style={styles.ruleContainer}>
                    <SafeText style={[styles.ruleText, styles.ruleTitle]}>温馨提示</SafeText>

                    <Text style={styles.ruleText}>
                        {`1、您可以通过完成任务、观看首页视频等方式获取${Config.goldAlias}；只有当您绑定支付宝或微信之后，才能开始提现。`}
                    </Text>

                    <Text style={styles.ruleText}>
                        {`2、好评、点击广告、观看激励视频并点击下载有机率获得更多${Config.goldAlias}，点赞、评论、发布优质内容等方式都有机率获得${Config.goldAlias}。`}
                    </Text>

                    <Text style={styles.ruleText}>
                        {`3、每天的转换汇率与平台收益及您的平台活跃度相关，因此汇率会受到影响上下浮动；活跃度越高，汇率越高；您可以通过邀请好友、点赞、评论、发布优质内容等方式等行为来提高活跃度。`}
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

const BG_WIDTH = Device.WIDTH - pixel(20);
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
        paddingVertical: pixel(15),
    },
    walletRedBg: {
        marginHorizontal: pixel(10),
        width: BG_WIDTH,
        height: (BG_WIDTH * 693) / 1053,
        borderRadius: pixel(10),
        overflow: 'hidden',
    },
    assetItem: {
        flex: 1,
        padding: pixel(12),
        flexDirection: 'row',
        alignItems: 'center',
    },
    assetIcon: {
        height: pixel(40),
        width: pixel(40),
    },
    assetInfo: {
        flex: 1,
        alignSelf: 'stretch',
        marginLeft: pixel(15),
        marginRight: pixel(5),
        justifyContent: 'space-between',
    },
    assetName: {
        color: '#fff',
        fontSize: font(16),
        fontWeight: 'bold',
        lineHeight: font(18),
    },
    assetDescription: {
        color: '#fff',
        fontSize: font(12),
        lineHeight: font(14),
    },
    earnings: {
        minWidth: pixel(55),
        alignItems: 'flex-end',
    },
    earningsText: {
        color: '#fff',
        fontSize: font(20),
    },
    sectionContainer: {
        marginHorizontal: pixel(10),
        marginBottom: pixel(10),
        paddingHorizontal: pixel(12),
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
        height: pixel(30),
        width: pixel(30),
    },
    diamondImage: {
        height: pixel(25),
        width: pixel(25),
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
        backgroundColor: '#FE4966',
    },
    amountItemBadgeText: {
        color: '#fff',
        fontSize: font(11),
    },
    activeAmountItem: {
        borderColor: '#34BBFF',
        // backgroundColor: '#E9F6FF',
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
        marginTop: pixel(15),
        marginBottom: pixel(12),
        height: pixel(44),
        borderRadius: pixel(22),
        alignItems: 'center',
        justifyContent: 'center',
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
