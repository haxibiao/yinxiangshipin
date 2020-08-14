import React, { useMemo, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Image,
    Animated,
    DeviceEventEmitter,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { FollowButton, Row, Iconfont, MoreOperation, GenderLabel } from '@src/components';
import { GQL, useQuery, useApolloClient, ApolloProvider } from '@src/apollo';
import { useNavigation, useRoute } from '@react-navigation/native';
import { userStore, observer } from '@src/store';
import { Overlay } from 'teaset';

export default observer((props: { user: any; titleStyle: TextStyle; contentStyle: ViewStyle }) => {
    const { user, titleStyle, contentStyle } = props;
    const navigation = useNavigation();
    const client = useApolloClient();
    const { data: userQueryResult, refetch } = useQuery(GQL.userQuery, {
        variables: { id: user.id },
        fetchPolicy: 'network-only',
    });
    const isSelf = useMemo(() => userStore.me.id === user.id, []);
    const userProfile = useMemo(() => Object.assign(user, userQueryResult?.user), [userQueryResult]);

    const showMoreOperation = useCallback(() => {
        let overlayRef: any;
        const MoreOperationOverlay = (
            <Overlay.PullView
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                containerStyle={{ backgroundColor: 'transparent' }}
                animated={true}
                ref={(ref: any) => (overlayRef = ref)}>
                <ApolloProvider client={client}>
                    <MoreOperation
                        onPressIn={() => overlayRef.close()}
                        navigation={navigation}
                        target={userProfile}
                        options={['举报', '拉黑']}
                        type="user"
                    />
                </ApolloProvider>
            </Overlay.PullView>
        );
        Overlay.show(MoreOperationOverlay);
    }, [client, userProfile]);

    const withChat = useCallback(() => {
        if (TOKEN) {
            navigation.navigate('Chat', {
                chat: {
                    withUser: { ...userProfile },
                },
            });
        } else {
            navigation.navigate('Login');
        }
    }, [userProfile]);

    useEffect(() => {
        const navigationFocus = navigation.addListener('focus', () => {
            refetch();
        });
        DeviceEventEmitter.addListener('userOperation', showMoreOperation);
        return () => {
            navigationFocus();
            DeviceEventEmitter.removeListener('userOperation', showMoreOperation);
        };
    }, [showMoreOperation]);

    return (
        <View style={styles.profileContainer}>
            {/* 用户信息卡片 */}
            <ImageBackground
                source={require('@app/assets/images/default/user_detail_bg.jpg')}
                style={styles.userProfileBg}>
                <View style={styles.mask} />
                <View style={styles.content}>
                    <View style={styles.userAvatar}>
                        <Image
                            source={{
                                uri: userProfile?.avatar,
                            }}
                            style={styles.avatar}
                        />
                        {isSelf ? (
                            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                                <View style={[styles.hollowButton, { borderRadius: pixel(5) }]}>
                                    <Text style={styles.hollowButtonText}>编辑</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <Row>
                                <TouchableOpacity
                                    style={[styles.hollowButton, { marginRight: pixel(15) }]}
                                    onPress={withChat}>
                                    <Text style={styles.hollowButtonText}>聊天</Text>
                                </TouchableOpacity>
                                <FollowButton
                                    user={userProfile}
                                    style={styles.hollowButton}
                                    titleStyle={styles.hollowButtonText}
                                />
                            </Row>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.userName} numberOfLines={1}>
                            {userProfile.name}
                        </Text>
                        <GenderLabel user={userProfile} />
                    </View>
                    <View style={{ marginTop: pixel(15) }}>
                        <Text style={styles.introduction} numberOfLines={2}>
                            {userProfile.introduction
                                ? userProfile.introduction
                                : '这个人不是很勤快的亚子，啥也没留下…'}
                        </Text>
                    </View>
                </View>
            </ImageBackground>
            {/* 用户页面顶部操作栏 */}
            <View style={styles.navBarStyle}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.navBarButton}>
                    <Iconfont name="zuojiantou" color={'#fff'} size={pixel(22)} />
                </TouchableOpacity>
                {/* <Animated.View style={[styles.navBarTitle, titleStyle]}> */}
                {/* <Text style={styles.titleText} numberOfLines={1}>
                        {userProfile.name}
                    </Text> */}
                {/* </Animated.View> */}
                {isSelf ? (
                    <View style={[styles.navBarButton, { opacity: 0 }]}>
                        <Iconfont name="qita1" size={pixel(21)} color={'#fff'} />
                    </View>
                ) : (
                    <TouchableOpacity activeOpacity={1} onPress={showMoreOperation} style={styles.navBarButton}>
                        <Iconfont name="qita1" size={pixel(21)} color={'#fff'} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
    },
    mask: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    userProfileBg: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    content: {
        flex: 1,
        paddingHorizontal: pixel(15),
        paddingTop: pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight + 10),
        paddingBottom: pixel(15),
    },
    userAvatar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: pixel(15),
    },
    avatar: {
        width: pixel(70),
        height: pixel(70),
        borderColor: '#FFF',
        borderRadius: pixel(84),
        borderWidth: pixel(2),
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    hollowButton: {
        paddingHorizontal: pixel(22),
        height: pixel(36),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: pixel(1),
        borderRadius: pixel(18),
        borderColor: '#fff',
        backgroundColor: 'transparent',
    },
    hollowButtonText: {
        color: '#fff',
        fontSize: font(15),
        lineHeight: font(18),
    },
    userName: {
        marginRight: pixel(10),
        color: '#fff',
        fontSize: font(20),
        fontWeight: 'bold',
    },
    introduction: {
        color: '#fff',
        fontSize: font(15),
    },
    metaList: {
        flexDirection: 'row',
    },
    metaItem: {
        alignItems: 'baseline',
        flexDirection: 'row',
        marginRight: pixel(Theme.itemSpace),
    },
    metaText: {
        color: '#fff',
        fontSize: font(12),
    },
    metaCountText: {
        color: '#fff',
        fontSize: font(16),
        fontWeight: 'bold',
        marginRight: pixel(5),
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        height: pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
        paddingTop: pixel(Theme.statusBarHeight),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navBarButton: {
        alignSelf: 'stretch',
        paddingHorizontal: pixel(Theme.itemSpace),
        justifyContent: 'center',
    },
    followButton: {
        borderRadius: pixel(5),
        paddingHorizontal: pixel(16),
        paddingVertical: pixel(8),
    },
    navBarTitle: {
        alignSelf: 'center',
    },
    titleText: {
        color: '#fff',
        fontSize: font(15),
    },
});
