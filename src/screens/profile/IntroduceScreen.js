import React from 'react';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, width } from '@src/common';
import { Screen, Avatar, Header, ShareModal } from '@src/components';

import { Query, GQL } from '@src/apollo';

const IntroduceScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const user = route.params?.user || {};
    const [modalVisible, setModalVisible] = React.useState(false);

    const toggleModalVisible = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <Screen customStyle={{ backgroundColor: Colors.nightColor }} lightBar header={<Header lightBar />}>
            <Query query={GQL.userDetailQuery} variables={{ id: user.id }}>
                {(res: { loading: any, error: any, data: any }) => {
                    const { loading, error, data } = res;
                    if (!(data && data.user)) {
                        return null;
                    }
                    const user = data.user;
                    return (
                        <View style={styles.container}>
                            <ScrollView style={styles.visitingCardContainer}>
                                <View style={styles.visitingCard}>
                                    <View>
                                        <Image
                                            style={styles.cover}
                                            source={{
                                                uri: 'https://www.ainicheng.com/images/appicons/cover.jpg',
                                            }}
                                        />
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{ marginTop: -10 }}>
                                            <Avatar
                                                source={user.avatar}
                                                size={90}
                                                borderStyle={{ borderColor: '#fff', borderWidth: 2 }}
                                            />
                                        </View>
                                        <View style={{ marginTop: 5 }}>
                                            <Text
                                                style={{
                                                    fontSize: font(22),
                                                    fontWeight: '500',
                                                    color: Colors.primaryFontColor,
                                                }}>
                                                {user.name}
                                            </Text>
                                        </View>
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: font(15), color: '#666' }}>
                                                {user.count_articles || 0}
                                                个作品,获得了
                                                {user.count_likes || 0}
                                                个喜欢
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.gutterWrap}>
                                        <View style={styles.hole} />
                                        <View style={styles.gutter} />
                                        <View style={styles.hole} />
                                    </View>
                                    <View style={styles.cardBottom}>
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: font(15),
                                                    color: Colors.primaryFontColor,
                                                    lineHeight: 21,
                                                }}>
                                                {user.introduction ? user.introduction : '本宝宝暂时还没想到个性签名'}
                                            </Text>
                                        </View>
                                        {
                                            // 隐藏功能
                                            // <View style={styles.QRcodeRow}>
                                            // 	<Image
                                            // 		style={styles.QRcode}
                                            // 		source={{ uri: "https://www.dongmeiwei.com/images/app/heiheihei.png" }}
                                            // 	/>
                                            // 	<View style={styles.QRcodeInfo}>
                                            // 		<Text style={{ fontSize: font(12), color: Colors.primaryFontColor }}>
                                            // 			长按识别图中二维码,查看TA的{Config.AppDisplayName}主页
                                            // 		</Text>
                                            // 	</View>
                                            // </View>
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                            {
                                // 隐藏功能
                                // <View style={styles.bottomSection}>
                                // 	<View>
                                // 		<Text style={{ fontSize: font(14), color: "#fff", textAlign: "center" }}>———— 分享图片到 ————</Text>
                                // 	</View>
                                // 	<View style={styles.shareVisitingCrad}>
                                // 		<TouchableOpacity>
                                // 			<Iconfont name={"weixin"} size={35} color={Colors.weixinColor} />
                                // 		</TouchableOpacity>
                                // 		<TouchableOpacity>
                                // 			<Image
                                // 				style={{ width: 32, height: 32, resizeMode: "contain" }}
                                // 				source={require("@app/assets/images/pengyouquan.png")}
                                // 			/>
                                // 		</TouchableOpacity>
                                // 		<TouchableOpacity onPress={toggleModalVisible}>
                                // 			<Iconfont name={"more"} size={36} color={Colors.lightFontColor} />
                                // 		</TouchableOpacity>
                                // 	</View>
                                // </View>
                            }
                        </View>
                    );
                }}
            </Query>
            <ShareModal plain visible={modalVisible} toggleVisible={toggleModalVisible} />
        </Screen>
    );
};

export default IntroduceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.nightColor,
    },
    visitingCardContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    visitingCard: {
        marginTop: 35,
        marginBottom: 25,
        borderRadius: 5,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    cover: {
        width: width - 40,
        height: (width - 40) / 3,
        resizeMode: 'cover',
    },
    gutterWrap: {
        marginTop: 25,
        marginHorizontal: -8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    gutter: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.lightGray,
        marginHorizontal: 16,
    },
    hole: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.nightColor,
    },
    cardBottom: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    QRcodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
    },
    QRcode: {
        width: 58,
        height: 58,
        resizeMode: 'contain',
        marginRight: 12,
    },
    QRcodeInfo: {
        flex: 1,
        marginTop: 3,
        height: 55,
        borderTopWidth: 1,
        borderColor: Colors.lightBorderColor,
        justifyContent: 'center',
    },
    bottomSection: {
        paddingVertical: 25,
        backgroundColor: '#303030',
    },
    shareVisitingCrad: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
});
