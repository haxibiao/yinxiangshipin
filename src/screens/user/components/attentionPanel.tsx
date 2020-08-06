import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Avatar } from 'components';
import { observer } from 'mobx-react';
import { from } from 'apollo-boost';

const attentionPanel = observer((props: Props) => {
    const { user } = props;
    return (
        <View style={styles.attentionPanel}>
            <View style={styles.AvatarSex}>
                <View activeOpacity={1}>
                    <Avatar style={styles.Avatar} source={user.avatar} />
                </View>
                {user.sex === 0 ? (
                    <Image style={styles.sexIcon} source={require('assets/images/notCertified.png')} />
                ) : (
                    <Image style={styles.sexIcon} source={require('assets/images/certified.png')} />
                )}
            </View>
            <View style={styles.panelTop}>
                <Text style={styles.secondeNick}>活捉一只傻逼</Text>
                <View style={styles.secondeInfoBox}>
                    <TouchableOpacity>
                        <Image style={styles.news} source={require('assets/images/secondeInfo.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}>
                        {/* &nbsp; */}
                        <Text style={styles.attention}>关注</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.certificationStatus}>
                <Text style={styles.statusText}>印象视频官方认证：未认证</Text>
            </View>
            <View style={styles.attentionPanelBtm}>
                <Text style={styles.fanBox}>
                    <Text style={styles.fanNum}>168</Text>粉丝
                </Text>
                <Text style={styles.attentionBox}>
                    <Text style={styles.fanNum}>168</Text>关注
                </Text>
            </View>
        </View>
    );
});
const styles = StyleSheet.create({
    // secondeContainer: {
    //     flex: 1,
    //     backgroundColor: 'skyblue',
    //     opacity: 0.8,
    //     paddingTop: Device.navBarHeight + Device.statusBarHeight,
    // },
    attentionPanel: {
        marginTop: Scale.size(-10),
        borderRadius: Scale.size(10),
        backgroundColor: '#ffffff',
        borderBottomWidth: Scale.size(0.15),
        borderBottomLeftRadius: Scale.size(0),
        borderBottomRightRadius: Scale.size(0),
        height: Scale.size(95),
        position: 'relative',
    },
    panelTop: {
        flexDirection: 'row',
        width: Device.width - Scale.size(110),
        // marginRight: Scale.size(15),
        marginLeft: Scale.size(94),
        marginTop: Scale.size(13),
        justifyContent: 'space-between',
    },
    secondeNick: {
        fontSize: Scale.font(16),
        color: '#000000',
    },
    secondeInfoBox: {
        flexDirection: 'row',
    },
    news: {
        width: Scale.size(20),
        height: Scale.size(20),
        marginRight: Scale.size(24),
    },
    attention: {
        fontSize: Scale.font(13),
        width: Scale.size(49),
        height: Scale.size(20),
        backgroundColor: 'rgba(23, 171, 255, 1)',
        textAlign: 'center',
        lineHeight: 20,
        color: 'rgba(254, 255, 255, 1)',
        borderRadius: Scale.size(5),
    },
    attentionPanelBtm: {
        marginTop: Scale.size(16),
        flexDirection: 'row',
    },
    fanNum: {
        color: 'rgba(23, 171, 255, 1)',
        fontWeight: '700',
        fontSize: Scale.font(16),
    },
    fanBox: {
        marginLeft: Scale.size(15),
        color: 'rgba(0, 0, 0, 1)',
        fontSize: Scale.font(16),
    },
    attentionBox: {
        marginLeft: Scale.size(28),
        color: 'rgba(0, 0, 0, 1)',
        fontSize: Scale.font(16),
    },
    infoPanel: {
        flexDirection: 'row',
        backgroundColor: 'skyblue',
    },
    myInfo: {
        alignItems: 'center',
        flexDirection: 'column',
        marginLeft: Scale.size(15),
    },
    sexIcon: {
        bottom: Scale.size(0),
        height: Scale.size(23),
        position: 'absolute',
        right: Scale.size(0),
        width: Scale.size(23),
        zIndex: 999,
    },
    AvatarSex: {
        flexDirection: 'row',
        height: Scale.size(72),
        position: 'absolute',
        width: Scale.size(72),
        top: Scale.size(-35),
        left: Scale.size(15),
    },
    Avatar: {
        borderRadius: Scale.size(50),
        height: Scale.size(71),
        width: Scale.size(71),
        position: 'absolute',
    },
    certificationStatus: {
        // width: Device.width - Scale.size(15),
        marginTop: Scale.size(8),
    },
    statusText: {
        fontSize: Scale.font(10),
        marginLeft: Scale.size(15),
    },
});
export default attentionPanel;
