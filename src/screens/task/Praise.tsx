import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    Linking,
    TextInput,
} from 'react-native';
import { Iconfont, MediaUploader, HxfButton, DropdownMenu, NavBarHeader, Loading, SafeText } from '@src/components';
import { GQL, useQuery, useMutation, useApolloClient, errorMessage } from '@src/apollo';
import { appStore, userStore } from '@src/store';

const shadowOpt = {
    width: Device.width,
    color: '#E8E8E8',
    border: 10,
    // radius: 10,
    opacity: 0.4,
    x: 0,
    y: 10,
    style: {
        marginTop: 0,
    },
};

const appStores = ['OPPO', 'VIVO', '小米', '华为', '魅族', '百度', '豌豆荚', '应用宝', '苹果'];

export default (props) => {
    const [appStore, setAppStore] = useState('');
    const [phone, setPhoneNumber] = useState('');
    const [images, setImages] = useState([]);
    const uploadResponse = useCallback((response) => {
        // if (response?.length > 0) {
        //     Toast.show({ content: '提交前请仔细阅读下方温馨提示，以免审核失败无法发放奖励', duration: 2000 });
        // }
        setImages(response);
    }, []);

    const client = useApolloClient();

    const onLoadToast = useCallback(() => {
        Toast.show({ content: '提交前请仔细阅读下方温馨提示，以免审核失败无法发放奖励', duration: 2000 });
    }, []);

    useEffect(() => {
        onLoadToast();
    }, [onLoadToast]);

    const highPraiseTask = useCallback(() => {
        Loading.show();
        client
            .mutate({
                mutation: GQL.highPraiseTaskMutation,
                variables: { user_id: userStore.me?.id, info: appStore, account: phone, images },
                refetchQueries: () => [
                    {
                        query: GQL.tasksQuery,
                    },
                ],
            })
            .then((result) => {
                Loading.hide();
                Toast.show({ content: '提交成功，请关注奖励发放' });
                props.navigation.goBack();
            })
            .catch((err) => {
                Loading.hide();
                Toast.show({ content: errorMessage(err) || '提交失败' });
            });
    }, [appStore, phone, images]);

    return (
        <View style={styles.container}>
            <NavBarHeader title="应用商店好评" StatusBarProps={{ barStyle: 'dark-content' }} />
            <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps={'always'}>
                <TouchableOpacity
                    style={styles.operationItem}
                    onPress={() =>
                        Linking.openURL(Device.isIos ? Config.iosAppStoreUrl : 'market://details?id=' + Config.AppID)
                    }>
                    <Text style={styles.operationName}>应用商店好评</Text>
                    <View style={styles.operationRight}>
                        <Text style={{ fontSize: font(14), color: '#b2b2b2' }}>去应用商店评价</Text>
                        <Iconfont name="right" size={font(14)} color={'#b2b2b2'} />
                    </View>
                </TouchableOpacity>
                <DropdownMenu
                    style={{ height: pixel(500) }}
                    bgColor={'white'}
                    dropStyle={styles.operationItem}
                    dropItemStyle={{ alignItems: 'flex-end' }}
                    labels={[appStore || '请选择应用商店']}
                    label={<Text style={styles.operationName}>选择应用商店</Text>}
                    tintColor={appStore ? Theme.primaryColor : '#b2b2b2'}
                    activityTintColor={Theme.primaryColor}
                    handler={(selection, row) => setAppStore(appStores[row])}
                    data={appStores}>
                    <View style={styles.appStoreContent}>
                        <View style={styles.operationItem}>
                            <Text style={styles.operationName}>应用商店账号</Text>
                            <TextInput
                                style={styles.inputStyle}
                                textAlignVertical={'top'}
                                placeholder={'请输入应用商店账号(手机号)'}
                                maxLength={11}
                                defaultValue={phone}
                                onChangeText={(value) => {
                                    setPhoneNumber(value);
                                }}
                            />
                        </View>
                        <View style={styles.operationItem}>
                            <Text style={styles.operationName}>评论内容截图</Text>
                            <Text style={{ fontSize: font(14), color: '#b2b2b2' }}>（{images.length}/3）</Text>
                        </View>
                    </View>
                    <View style={styles.mediaContainer}>
                        <MediaUploader
                            type="image"
                            maximum={3}
                            onResponse={uploadResponse}
                            maxWidth={Device.width / 2}
                            style={styles.mediaItem}
                        />
                    </View>
                    <View style={styles.ruleContainer}>
                        <SafeText style={styles.ruleTitle}>温馨提示</SafeText>
                        <Text style={styles.ruleText}>
                            在应用商店给我们评价后并截图，同您在应用商店的账号（手机号）一并提交。上传虚假评价与无关图片将不予通过!
                        </Text>
                        <Text style={styles.ruleText}>评价内容需大于15字，随意编写、复制他人评论粘贴将不予通过！</Text>
                        <Text style={styles.ruleText}>优质好评内容将优先进行审核与奖励发放。</Text>
                        <Text style={styles.ruleText}>
                            后续当您的评论在应用商店给其他人带来良好的参考价值时，系统将会根据点赞数给您发放追加奖励！
                        </Text>
                        <Text style={styles.ruleText}>后续请留意审核状态，经审核通过后即可领取奖励。</Text>
                    </View>
                </DropdownMenu>
            </ScrollView>
            <View style={styles.buttonWrap}>
                <HxfButton
                    gradient={true}
                    disabled={!(phone && appStore && images.length > 0)}
                    style={styles.buttonStyle}
                    title={'提交'}
                    onPress={highPraiseTask}
                />
            </View>
        </View>
    );
};

const MediaItemWidth = (Device.width - pixel(60)) / 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: pixel(12),
        paddingBottom: Device.bottomInset + pixel(80),
    },
    operationItem: {
        height: pixel(56),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f0f0f0',
    },
    operationName: {
        fontSize: font(16),
        color: '#2b2b2b',
    },
    operationRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appStoreContent: {
        marginBottom: pixel(20),
    },
    inputStyle: {
        textAlign: 'right',
        alignSelf: 'stretch',
        marginLeft: pixel(15),
        height: pixel(50),
        margin: 0,
        padding: 0,
        fontSize: font(14),
        paddingVertical: pixel(15),
    },
    mediaContainer: {
        marginRight: -pixel(15),
        marginBottom: pixel(10),
    },
    mediaItem: {
        width: MediaItemWidth,
        height: MediaItemWidth,
        marginRight: pixel(15),
    },
    ruleContainer: {
        marginTop: pixel(10),
    },
    ruleTitle: {
        color: 'red',
        fontSize: font(14),
        fontWeight: 'bold',
        // color: '#2b2b2b',
    },
    ruleText: {
        color: '#969696',
        fontSize: font(14),
        lineHeight: font(18),
        paddingVertical: pixel(5),
    },
    buttonWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: pixel(15),
        paddingBottom: Device.bottomInset + pixel(30),
        backgroundColor: '#fff',
    },
    buttonStyle: {
        height: pixel(44),
        borderRadius: pixel(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
});
